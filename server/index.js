const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from file-storage
app.use('/files', express.static(path.join(__dirname, '../file-storage')));

// Routes
const authRoutes = require('./routes/auth');
const fileRoutes = require('./routes/files');
const aiRoutes = require('./routes/ai');
const dashboardRoutes = require('./routes/dashboard');

app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Socket.io for real-time AI chat
io.on('connection', (socket) => {
  console.log('User connected to AI chat');
  
  socket.on('ai-message', async (data) => {
    try {
      // This will integrate with Claude AI service
      const response = await processAIMessage(data.message, data.context);
      socket.emit('ai-response', response);
    } catch (error) {
      socket.emit('ai-error', { error: error.message });
    }
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected from AI chat');
  });
});

// AI Message Processing (placeholder for Claude integration)
async function processAIMessage(message, context) {
  // This will be replaced with actual Claude AI integration
  return {
    message: `AI Response to: ${message}`,
    timestamp: new Date().toISOString(),
    context: context
  };
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'TD Studios Portal Server Running', timestamp: new Date().toISOString() });
});

server.listen(PORT, () => {
  console.log(`🚀 TD Studios Portal Server running on port ${PORT}`);
  console.log(`🎯 Tyler's Personal Command Center Active`);
});

module.exports = { app, server, io }; 