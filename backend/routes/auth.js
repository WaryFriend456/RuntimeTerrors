const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const router = express.Router();

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_for_development';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

// Show a warning when using the fallback secret
if (!process.env.JWT_SECRET) {
  console.warn('WARNING: Using fallback JWT_SECRET in auth routes - this is NOT secure for production!');
}

// Register route
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if all required fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user - password will be hashed by the pre-save hook
    const newUser = await User.create({
      name,
      email,
      password,
      interests: [] // Initialize with empty interests array
    });

    // Create JWT token with interests included
    const token = jwt.sign({ 
      id: newUser._id, 
      email: newUser.email,
      interests: newUser.interests 
    }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        interests: newUser.interests
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token with interests included
    const token = jwt.sign({ 
      id: user._id, 
      email: user.email,
      interests: user.interests 
    }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        interests: user.interests
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get current user
router.get('/user', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      interests: user.interests
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add this endpoint to your auth routes file

router.put('/user/interests', authenticateToken, async (req, res) => {
  try {
    const { interests } = req.body;
    
    if (!interests || !Array.isArray(interests)) {
      return res.status(400).json({ message: 'Interests must be an array' });
    }
    
    // Update user interests
    const user = await User.findByIdAndUpdate(
      req.user.id, 
      { interests }, 
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json({ 
      success: true, 
      interests: user.interests 
    });
  } catch (error) {
    console.error('Update interests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
