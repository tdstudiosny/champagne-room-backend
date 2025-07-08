const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'td-studios-portal-secret-key';

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token.' });
  }
};

// Tyler-specific authentication (since this is a personal portal)
const authenticateTyler = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. Tyler authentication required.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Verify it's Tyler's account
    if (decoded.username !== 'tyler' && decoded.email !== 'tyler@tdstudiosny.com') {
      return res.status(403).json({ message: 'Access denied. This is Tyler\'s personal portal.' });
    }
    
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token.' });
  }
};

module.exports = {
  authenticateToken,
  authenticateTyler
}; 