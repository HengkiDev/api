// File: /api/downloader.js

export default async function handler(req, res) {
  const { url } = req.query;
  
  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }
  
  try {
    // Using native fetch instead of node-fetch
    const apiUrl = `https://wapi.tiqu.cc/api/all/?key=bfa95f704ce74c5cba31820ea1c0da05&url=${encodeURIComponent(url)}`;
    
    console.log('Fetching from:', apiUrl);
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API response not OK:', response.status, errorText);
      return res.status(response.status).json({ 
        error: `External API error: ${response.status}`,
        details: errorText
      });
    }
    
    const data = await response.json();
    console.log('API response:', JSON.stringify(data).substring(0, 200) + '...');
    
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error in API handler:', error);
    return res.status(500).json({ 
      error: 'An error occurred while processing your request',
      message: error.message
    });
  }
}
