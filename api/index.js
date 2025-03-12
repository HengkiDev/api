const express = require('express');
const cors = require('cors');
const app = express();

// Import routes
const downloadRouter = require('./download');

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Root endpoint
app.get('/', (req, res) => {
  res.send(`
    <h1>TikTok Downloader API</h1>
    <p>Use the /api/download endpoint with a TikTok URL parameter to download videos</p>
    <p>Example: /api/download?url=https://www.tiktok.com/@username/video/1234567890</p>
  `);
});

// API routes
app.use('/api/download', downloadRouter);

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Local server running on port ${PORT}`);
  });
}

// Export for Vercel
module.exports = app;
