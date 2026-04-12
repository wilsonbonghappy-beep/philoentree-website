const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const LEADS_FILE = path.join(__dirname, '..', 'data', 'leads.json');

// Helper: read leads
function readLeads() {
  if (!fs.existsSync(LEADS_FILE)) return [];
  try { return JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8')); }
  catch { return []; }
}

// Helper: save lead
function saveLead(lead) {
  const leads = readLeads();
  leads.unshift(lead); // newest first
  fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));
}

// Validation rules
const validateContact = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('phone').trim().optional().isLength({ max: 20 }),
  body('service').trim().notEmpty().withMessage('Please select a service'),
  body('message').trim().notEmpty().withMessage('Message is required').isLength({ max: 2000 })
];

// POST /api/contact
router.post('/', validateContact, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }

  const { name, email, phone, service, message } = req.body;

  const lead = {
    id: Date.now().toString(),
    name,
    email,
    phone: phone || '',
    service,
    message,
    createdAt: new Date().toISOString(),
    status: 'new'
  };

  try {
    saveLead(lead);
  } catch (err) {
    console.error('Failed to save lead:', err);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }

  // Send email notification if configured
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      });

      await transporter.sendMail({
        from: `"Philoentree Website" <${process.env.SMTP_USER}>`,
        to: process.env.NOTIFY_EMAIL || process.env.SMTP_USER,
        subject: `New Enquiry: ${service} — ${name}`,
        html: `
          <h2>New Enquiry from Philoentree Website</h2>
          <table cellpadding="8" style="border-collapse:collapse;width:100%">
            <tr><td><strong>Name</strong></td><td>${name}</td></tr>
            <tr><td><strong>Email</strong></td><td>${email}</td></tr>
            <tr><td><strong>Phone</strong></td><td>${phone || '—'}</td></tr>
            <tr><td><strong>Service</strong></td><td>${service}</td></tr>
            <tr><td><strong>Message</strong></td><td>${message}</td></tr>
            <tr><td><strong>Date</strong></td><td>${new Date().toLocaleString('en-MY', { timeZone: 'Asia/Kuala_Lumpur' })}</td></tr>
          </table>
        `
      });
    } catch (emailErr) {
      // Log but don't fail — lead is already saved
      console.error('Email notification failed:', emailErr.message);
    }
  }

  res.json({ success: true, message: 'Message received! We will contact you shortly.' });
});

module.exports = router;
