// Enable us to retrieve env variables
require('dotenv').config

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api/health', (req, res) => {
    res.json({
        message: 'Server is running correctly'
    })
});

// Check if the health message is correctly display by following the ling
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}/api/health`);
});