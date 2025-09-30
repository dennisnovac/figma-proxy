module.exports = async (req, res) => {
  // Log that function was called
  console.log('=== PROXY FUNCTION CALLED ===');
  console.log('Method:', req.method);
  
  // Check API key
  const apiKey = process.env.ANTHROPIC_API_KEY;
  console.log('API Key exists:', !!apiKey);
  console.log('API Key first 10 chars:', apiKey ? apiKey.substring(0, 10) : 'NOT FOUND');
  console.log('API Key length:', apiKey ? apiKey.length : 0);
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS preflight');
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    console.log('Invalid method, returning 405');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  if (!apiKey) {
    console.log('ERROR: API key not configured!');
    return res.status(500).json({ error: 'API key not configured' });
  }
  
  console.log('Request body:', JSON.stringify(req.body, null, 2));
  
  try {
    console.log('Calling Anthropic API...');
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(req.body)
    });
    
    console.log('Anthropic response status:', response.status);
    
    const data = await response.json();
    console.log('Anthropic response:', JSON.stringify(data, null, 2));
    
    return res.status(response.status).json(data);
    
  } catch (error) {
    console.log('ERROR:', error.message);
    console.log('Stack:', error.stack);
    return res.status(500).json({ error: error.message });
  }
};
