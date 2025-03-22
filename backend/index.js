const express = require('express');
const cors = require('cors');

// Create Express app
const app = express();

// Enable CORS
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Define routes
app.get('/', (req, res) => {
    res.json({ message: 'Server is running' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});