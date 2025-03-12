const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

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

// Download endpoint
app.get('/download', async (req, res) => {
  try {
    const tiktokUrl = req.query.url;
    
    if (!tiktokUrl) {
      return res.status(400).json({ 
        status: false, 
        message: 'TikTok URL is required' 
      });
    }

    // Validate TikTok URL
    if (!tiktokUrl.includes('tiktok.com')) {
      return res.status(400).json({ 
        status: false, 
        message: 'Invalid TikTok URL' 
      });
    }

    // Get TikTok video info using a third-party service
    const response = await axios.get('https://api.tikmate.app/api/lookup', {
      params: { url: tiktokUrl },
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    if (!response.data || !response.data.success) {
      return res.status(404).json({ 
        status: false, 
        message: 'Failed to fetch video information' 
      });
    }

    // Construct download links
    const downloadUrl = `https://tikmate.app/download/${response.data.token}/${response.data.id}.mp4`;
    
    return res.status(200).json({
      status: true,
      message: 'Success',
      result: {
        title: response.data.title || 'TikTok Video',
        author: response.data.author || 'Unknown',
        downloadUrl: downloadUrl,
        coverUrl: response.data.cover || '',
        originalUrl: tiktokUrl
      }
    });
  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({
      status: false,
      message: 'Server error: ' + error.message
    });
  }
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Local server running on port ${PORT}`);
  });
}

// Export for Vercel
module.exports = app;
