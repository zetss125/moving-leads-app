const express = require('express');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
require('dotenv').config();
// Configure CORS for production
const allowedOrigins = [
  'http://localhost:5173',  // Local development
  'https://zetss125.github.io'  // Your GitHub Pages URL
];
const app = express();
const PORT = process.env.PORT || 3001;

// ========== MIDDLEWARE ==========
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// OR simpler version (allows all in development):
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://zetss125.github.io'
    : 'http://localhost:5173',
  credentials: true
}));

// ========== MOCK DATABASE ==========
let leadsDatabase = [];

// ========== ROUTES ==========

// 1. Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    mode: process.env.FACEBOOK_APP_ID ? 'Facebook Mode' : 'Mock Mode',
    leadsCount: leadsDatabase.length,
    timestamp: new Date().toISOString()
  });
});

// 2. Mock Facebook analysis (for development)
app.post('/api/analyze-facebook', async (req, res) => {
  try {
    const { accessToken } = req.body;
    
    if (!accessToken) {
      return res.status(400).json({ 
        success: false, 
        error: 'Access token required' 
      });
    }

    // Generate mock lead data
    const mockLead = generateMockLead(accessToken);
    
    // Add to database
    leadsDatabase.push(mockLead);
    
    // Sort by score (highest first)
    leadsDatabase.sort((a, b) => b.score - a.score);

    res.json({
      success: true,
      lead: mockLead,
      message: `Mock lead analyzed: ${mockLead.score}/100 (${mockLead.urgency} priority)`,
      mode: 'mock'
    });

  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      mode: 'mock'
    });
  }
});

// 3. Get all leads
app.get('/api/leads', (req, res) => {
  // Return leads sorted by score
  const sortedLeads = [...leadsDatabase].sort((a, b) => b.score - a.score);
  
  // If no leads, generate some mock data
  if (sortedLeads.length === 0) {
    for (let i = 0; i < 5; i++) {
      leadsDatabase.push(generateMockLead(`mock-token-${i}`));
    }
    leadsDatabase.sort((a, b) => b.score - a.score);
  }

  res.json(leadsDatabase.sort((a, b) => b.score - a.score));
});

// 4. Delete a lead
app.delete('/api/leads/:id', (req, res) => {
  const id = req.params.id;
  leadsDatabase = leadsDatabase.filter(lead => lead.id !== id);
  res.json({ success: true, message: 'Lead deleted' });
});

// 5. Get test users (for development)
app.get('/api/test-users', (req, res) => {
  res.json({
    testUsers: [
      { name: 'Test User 1', token: process.env.TEST_USER_1_TOKEN || 'mock_token_1' },
      { name: 'Test User 2', token: process.env.TEST_USER_2_TOKEN || 'mock_token_2' }
    ]
  });
});

// ========== HELPER FUNCTIONS ==========
function generateMockLead(token) {
  const names = ['John Smith', 'Sarah Johnson', 'Mike Williams', 'Lisa Brown', 'David Wilson'];
  const cities = ['New York, NY', 'Chicago, IL', 'Los Angeles, CA', 'Miami, FL', 'Houston, TX'];
  const platforms = ['facebook', 'twitter', 'linkedin', 'instagram'];
  
  const allSignals = [
    'Posted: "Moving to new apartment next month!"',
    'Asked: "Any good movers in the area?"',
    'Joined: "City Relocation Help" group',
    'Changed location from NYC to Chicago',
    'Selling furniture on Marketplace',
    'Researching moving truck rentals',
    'Complained about packing stress',
    'Looking for new neighborhood recommendations',
    'Posted moving timeline',
    'Asked about storage unit prices'
  ];
  
  const name = names[Math.floor(Math.random() * names.length)];
  const email = `${name.toLowerCase().replace(' ', '.')}@example.com`;
  const location = cities[Math.floor(Math.random() * cities.length)];
  const platform = platforms[Math.floor(Math.random() * platforms.length)];
  
  // Generate 3-6 random signals
  const numSignals = 3 + Math.floor(Math.random() * 4);
  const signals = [];
  for (let i = 0; i < numSignals; i++) {
    const signal = allSignals[Math.floor(Math.random() * allSignals.length)];
    if (!signals.includes(signal)) signals.push(signal);
  }
  
  // Calculate score based on signals
  let score = signals.length * 15;
  if (signals.some(s => s.includes('Moving to'))) score += 20;
  if (signals.some(s => s.includes('movers'))) score += 15;
  if (signals.some(s => s.includes('timeline'))) score += 10;
  score = Math.min(score, 100);
  
  const urgency = score > 60 ? 'HIGH' : score > 30 ? 'MEDIUM' : 'LOW';
  
  return {
    id: `lead-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name,
    email,
    location,
    platform,
    score,
    signals,
    urgency,
    profileUrl: `https://${platform}.com/${name.toLowerCase().replace(' ', '')}`,
    timestamp: new Date().toISOString()
  };
}

// ========== START SERVER ==========
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints:`);
  console.log(`   GET  /health - Health check`);
  console.log(`   POST /api/analyze-facebook - Analyze token (mock)`);
  console.log(`   GET  /api/leads - Get all leads`);
  console.log(`   GET  /api/test-users - Get test users`);
  console.log(`\n🎮 Mode: ${process.env.FACEBOOK_APP_ID ? 'Facebook' : 'MOCK'} (using mock data)`);
  console.log(`🔗 Frontend: ${process.env.FRONTEND_URL}`);
});