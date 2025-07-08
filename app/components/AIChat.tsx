'use client'

import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

interface AIChatProps {
  user: any
}

export default function AIChat({ user }: AIChatProps) {
  const [messages, setMessages] = useState<any[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [socket, setSocket] = useState<any>(null)

  useEffect(() => {
    // Load chat history
    loadChatHistory()
    
    // Initialize socket connection
    const newSocket = io('http://localhost:5001')
    setSocket(newSocket)

    newSocket.on('ai-response', (response: any) => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'ai',
        message: response.message,
        timestamp: new Date().toISOString()
      }])
      setIsLoading(false)
    })

    newSocket.on('ai-error', (error: any) => {
      console.error('AI error:', error)
      setIsLoading(false)
    })

    return () => {
      newSocket.close()
    }
  }, [])

  const loadChatHistory = async () => {
    try {
      const token = localStorage.getItem('td-portal-token')
      const response = await fetch('/api/ai/history', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        setMessages(data.history)
      }
    } catch (error) {
      console.error('Failed to load chat history:', error)
    }
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      message: inputMessage,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    // Send via socket for real-time response
    if (socket) {
      socket.emit('ai-message', {
        message: inputMessage,
        context: {
          user: user,
          currentProject: 'TD Studios Portal'
        }
      })
    }

    setInputMessage('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">AI Assistant</h2>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Online</span>
        </div>
      </div>

      <div className="chat-container flex-1">
        <div className="chat-messages">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold mb-2">Hey Tyler!</h3>
              <p className="text-gray-600">
                I'm your personal AI assistant. I know everything about your projects, 
                tech stack, and preferences. What can I help you with today?
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`chat-message ${message.type}`}
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center">
                  {message.type === 'user' ? (
                    <div className="bg-black text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                      {user.name.charAt(0)}
                    </div>
                  ) : (
                    <div className="text-xl">🤖</div>
                  )}
                </div>
                <div className={`chat-bubble ${message.type}`}>
                  <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                  <div className="text-xs opacity-70 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))
          )}
          
          {isLoading && (
            <div className="chat-message ai">
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center">
                <div className="text-xl">🤖</div>
              </div>
              <div className="chat-bubble ai">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="chat-input">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your projects, code, or need help with something..."
              className="form-input flex-1"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="btn-primary"
            >
              Send
            </button>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-500">
              Press Enter to send, Shift+Enter for new line
            </span>
            <button
              onClick={loadChatHistory}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 