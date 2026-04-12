require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
const contactRoute = require('./routes/contact');

// Ensure data directory exists (needed on fresh Railway deploy)
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
const leadsFile = path.join(dataDir, 'leads.json');
if (!fs.existsSync(leadsFile)) fs.writeFileSync(leadsFile, '[]');

const app = express();
const PORT = process.env.PORT || 3000;

// Security
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: process.env.ALLOWED_ORIGIN || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiter for API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { success: false, message: 'Too many requests, please try again later.' }
});

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/contact', apiLimiter, contactRoute);

// Admin: view leads (basic, no auth for now — protect in production)
app.get('/api/leads', (req, res) => {
  const fs = require('fs');
  const leadsPath = path.join(__dirname, 'data', 'leads.json');
  if (!fs.existsSync(leadsPath)) return res.json([]);
  const leads = JSON.parse(fs.readFileSync(leadsPath, 'utf8'));
  res.json(leads);
});

// Serve index.html for all other routes (SPA fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Philoentree server running on http://localhost:${PORT}`);
});
