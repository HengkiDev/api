const express = require('express');
const axios = require('axios');
const router = express.Router();

// Download endpoint
router.get('/', async (req, res) => {
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

module.exports = router;
