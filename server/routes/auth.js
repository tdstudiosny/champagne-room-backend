const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Tyler's credentials (in production, this would be in a database)
const TYLER_CREDENTIALS = {
  username: 'tyler',
  email: 'tyler@tdstudiosny.com',
  // This will be the hashed password for 'tdstudios2024'
  password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // placeholder
  name: 'Tyler Davis',
  role: 'CEO'
};

const JWT_SECRET = process.env.JWT_SECRET || 'td-studios-portal-secret-key';

// Initialize Tyler's password hash
async function initializeTylerPassword() {
  TYLER_CREDENTIALS.password = await bcrypt.hash('tdstudios2024', 10);
}
initializeTylerPassword();

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Check if it's Tyler
    if (username !== TYLER_CREDENTIALS.username && username !== TYLER_CREDENTIALS.email) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, TYLER_CREDENTIALS.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        username: TYLER_CREDENTIALS.username,
        email: TYLER_CREDENTIALS.email,
        name: TYLER_CREDENTIALS.name,
        role: TYLER_CREDENTIALS.role
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      token,
      user: {
        username: TYLER_CREDENTIALS.username,
        email: TYLER_CREDENTIALS.email,
        name: TYLER_CREDENTIALS.name,
        role: TYLER_CREDENTIALS.role
      },
      message: 'Welcome back to your TD Studios Portal, Tyler!'
    });
    
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Verify token endpoint
router.post('/verify', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ valid: true, user: decoded });
    
  } catch (error) {
    res.status(401).json({ valid: false, message: 'Invalid token' });
  }
});

// Logout endpoint (client-side token removal)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

module.exports = router; 