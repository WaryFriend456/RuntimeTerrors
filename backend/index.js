// Load environment variables first before other imports
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');

// Create Express app
const app = express();

// Enable CORS
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Routes
app.use('/api', authRoutes);

// Default route
app.get('/', (req, res) => {
    res.json({ message: 'Server is running' });
});

// Connect to database then start server
connectDB().then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error(`Failed to start server: ${err.message}`);
  process.exit(1);
});