'use client'

import { useState, useEffect, useRef } from 'react'

interface Message {
  id: string
  content: string
  sender: 'user' | 'ai'
  timestamp: Date
  context?: any
}

interface AIChatProps {
  user: any
}

export default function AIChat({ user }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [socket, setSocket] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsDesktop(!!(window as any).electronAPI)
    initializeChat()
    
    return () => {
      if (socket) {
        socket.disconnect()
      }
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const initializeChat = () => {
    // Add welcome message
    const welcomeMessage: Message = {
      id: '1',
      content: isDesktop 
        ? `🤖 Tyler's AI Beast is online and ready to dominate! I'm your autonomous business assistant with complete knowledge of your empire. I can help you with strategy, analyze competitors, optimize revenue, and execute plans 24/7. What shall we conquer today?`
        : `Hey Tyler! I'm your personal AI assistant. I know all about TD Studios, your projects, and your goals. How can I help you today?`,
      sender: 'ai',
      timestamp: new Date(),
      context: { user: user.name, platform: isDesktop ? 'desktop' : 'web' }
    }
    
    setMessages([welcomeMessage])

    // Initialize socket connection for real-time chat
    if (typeof window !== 'undefined') {
      const io = require('socket.io-client')
      const newSocket = io('http://localhost:5001')
      
      newSocket.on('ai-response', (response: any) => {
        const aiMessage: Message = {
          id: Date.now().toString(),
          content: response.message,
          sender: 'ai',
          timestamp: new Date(response.timestamp),
          context: response.context
        }
        setMessages(prev => [...prev, aiMessage])
        setIsTyping(false)
      })

      newSocket.on('ai-error', (error: any) => {
        console.error('AI Error:', error)
        setIsTyping(false)
      })

      setSocket(newSocket)
    }
  }

  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    // Send to AI via socket
    if (socket) {
      socket.emit('ai-message', {
        message: inputMessage,
        context: {
          user: user.name,
          platform: isDesktop ? 'ai-beast-desktop' : 'web-portal',
          timestamp: new Date().toISOString(),
          business: 'TD Studios',
          focus: 'luxury platforms, adult content, AI automation'
        }
      })
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const quickActions = isDesktop 
    ? [
        '🔄 Clone competitor website',
        '🤖 Create automation bot',
        '📈 Analyze market trends',
        '💰 Revenue optimization ideas',
        '🎯 Find new opportunities',
        '🚀 Scale current projects'
      ]
    : [
        'Show my active projects',
        'What tasks need attention?',
        'Revenue analysis',
        'Upload a file',
        'Create new project',
        'Help with strategy'
      ]

  const handleQuickAction = (action: string) => {
    setInputMessage(action)
    setTimeout(() => sendMessage(), 100)
  }

  return (
    <div className="flex flex-col h-full max-h-screen">
      {/* Header */}
      <div className="border-b border-gray-200 p-4 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">🤖</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {isDesktop ? 'Tyler\'s AI Beast' : 'AI Assistant'}
            </h3>
            <p className="text-sm text-gray-500">
              {isDesktop ? 'Autonomous Business Domination AI' : 'Your personal assistant'}
            </p>
          </div>
          {isDesktop && (
            <div className="ml-auto">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-600 font-medium">BEAST MODE</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-black text-white'
                  : 'bg-white text-gray-900 border border-gray-200'
              }`}
            >
              <div className="text-sm leading-relaxed">{message.content}</div>
              <div
                className={`text-xs mt-2 ${
                  message.sender === 'user' ? 'text-gray-300' : 'text-gray-500'
                }`}
              >
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-900 border border-gray-200 px-4 py-3 rounded-lg max-w-xs">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="mb-3">
          <p className="text-xs text-gray-500 mb-2">
            {isDesktop ? 'AI Beast Quick Commands:' : 'Quick actions:'}
          </p>
          <div className="flex flex-wrap gap-2">
            {quickActions.slice(0, 3).map((action) => (
              <button
                key={action}
                onClick={() => handleQuickAction(action)}
                className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                {action}
              </button>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder={isDesktop ? "Command the AI Beast..." : "Type your message..."}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            disabled={isTyping}
          />
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isDesktop ? '🚀' : 'Send'}
          </button>
        </div>
      </div>

      {/* AI Beast Status (Desktop Only) */}
      {isDesktop && (
        <div className="border-t border-gray-200 p-3 bg-black text-white">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>AI Beast Active • Monitoring 24/7 • Ready to Execute</span>
            </div>
            <div className="flex gap-3">
              <span>🎯 Opportunities: 12</span>
              <span>🤖 Bots: 5 Active</span>
              <span>💰 Revenue: $45.2K</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 