const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_for_development';

// Remove the process exit logic since we now have a fallback
// Instead just log a warning
if (!process.env.JWT_SECRET) {
  console.warn('WARNING: Using fallback JWT_SECRET - this is NOT secure for production!');
}

function authenticateToken(req, res, next) {
  const authHeader = req.header('Authorization');
  
  if (!authHeader) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const token = authHeader.split(' ')[1]; // Format: "Bearer TOKEN"
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = { authenticateToken };
