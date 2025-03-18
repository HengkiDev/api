import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { url } = req.query;
  
  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }
  
  try {
    const apiUrl = https://wapi.tiqu.cc/api/all/?key=bfa95f704ce74c5cba31820ea1c0da05&url=${encodeURIComponent(url)};
    
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to download TikTok video');
    }
    
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message || 'An error occurred while processing your request' });
  }
}
