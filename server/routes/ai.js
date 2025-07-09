const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Tyler's personal context for AI
const TYLER_CONTEXT = {
  name: 'Tyler Davis',
  company: 'TD Studios NY',
  website: 'tdstudiosny.com',
  role: 'CEO',
  business: 'Luxury platforms and adult content sites',
  techStack: ['Node.js', 'React', 'MongoDB', 'Claude AI', 'Next.js', 'Express.js'],
  projects: [
    'TD Studios Portal',
    'TD Studios AI Beast',
    'Luxury platform development',
    'Adult content site architecture'
  ],
  preferences: {
    workStyle: 'Fast-paced development',
    codeStyle: 'Clean, modern, production-ready',
    designStyle: 'Minimal, black and white, professional',
    tools: 'VS Code, Cursor, Terminal, GitHub'
  },
  workingHours: 'Flexible, but primarily EST timezone',
  currentFocus: 'Building personal TD Studios Portal as daily command center'
};

// Load chat history
function loadChatHistory() {
  const historyPath = path.join(__dirname, '../../ai-brain/chat-history.json');
  if (fs.existsSync(historyPath)) {
    return JSON.parse(fs.readFileSync(historyPath, 'utf8'));
  }
  return [];
}

// Save chat history
function saveChatHistory(history) {
  const historyPath = path.join(__dirname, '../../ai-brain/chat-history.json');
  const aiDir = path.dirname(historyPath);
  if (!fs.existsSync(aiDir)) {
    fs.mkdirSync(aiDir, { recursive: true });
  }
  fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));
}

// AI Chat endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message, context } = req.body;
    
    // Load chat history
    const history = loadChatHistory();
    
    // Add user message to history
    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: message,
      timestamp: new Date().toISOString(),
      context: context || {}
    };
    
    history.push(userMessage);
    
    // Process AI response (this will be enhanced with actual Claude integration)
    const aiResponse = await generateAIResponse(message, context, history);
    
    // Add AI response to history
    const aiMessage = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      message: aiResponse,
      timestamp: new Date().toISOString(),
      context: TYLER_CONTEXT
    };
    
    history.push(aiMessage);
    
    // Save updated history
    saveChatHistory(history);
    
    res.json({
      response: aiResponse,
      messageId: aiMessage.id,
      timestamp: aiMessage.timestamp
    });
    
  } catch (error) {
    res.status(500).json({ message: 'AI chat failed', error: error.message });
  }
});

// Get chat history endpoint
router.get('/history', (req, res) => {
  try {
    const history = loadChatHistory();
    res.json({ history });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load chat history', error: error.message });
  }
});

// Clear chat history endpoint
router.delete('/history', (req, res) => {
  try {
    saveChatHistory([]);
    res.json({ message: 'Chat history cleared' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to clear chat history', error: error.message });
  }
});

// AI Response generation (placeholder for Claude integration)
async function generateAIResponse(message, context, history) {
  // This is a placeholder - will be replaced with actual Claude API integration
  const responses = [
    `Hey Tyler! As your personal AI assistant, I understand you're working on ${context?.currentProject || 'the TD Studios Portal'}. ${message.includes('help') ? 'I\'m here to help you with anything you need.' : 'What can I help you with today?'}`,
    `Based on your tech stack (Node.js, React, MongoDB), I can help you with development, architecture, or any other questions about your luxury platform projects.`,
    `I see you're focused on ${TYLER_CONTEXT.currentFocus}. ${message.includes('code') ? 'I can help review code, suggest improvements, or assist with implementation.' : 'How can I assist you today?'}`,
    `Tyler, as the CEO of TD Studios NY, I know you value efficiency and clean code. ${message.includes('project') ? 'Let me know what project you\'d like to discuss.' : 'What\'s on your mind?'}`
  ];
  
  // Simple response selection based on message content
  let response = responses[Math.floor(Math.random() * responses.length)];
  
  // Add specific context based on message content
  if (message.toLowerCase().includes('file') || message.toLowerCase().includes('upload')) {
    response = `Tyler, I can help you manage your files in the TD Studios Portal. You can upload .env files, media, documents, and I'll help you organize them securely. What files are you working with?`;
  } else if (message.toLowerCase().includes('project')) {
    response = `I see you're asking about projects. Your current focus is on ${TYLER_CONTEXT.currentFocus}. I can help you manage your projects: ${TYLER_CONTEXT.projects.join(', ')}. Which project needs attention?`;
  } else if (message.toLowerCase().includes('code') || message.toLowerCase().includes('develop')) {
    response = `As your development assistant, I know you prefer ${TYLER_CONTEXT.preferences.codeStyle} code. Your tech stack includes ${TYLER_CONTEXT.techStack.join(', ')}. What are you building today?`;
  }
  
  return response;
}

// Get Tyler's context endpoint
router.get('/context', (req, res) => {
  res.json({ context: TYLER_CONTEXT });
});

// Update Tyler's context endpoint
router.put('/context', (req, res) => {
  try {
    const { updates } = req.body;
    
    // Update context (in production, this would be in a database)
    Object.assign(TYLER_CONTEXT, updates);
    
    res.json({ message: 'Context updated successfully', context: TYLER_CONTEXT });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update context', error: error.message });
  }
});

module.exports = router; 