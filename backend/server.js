const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const dotenv = require('dotenv')

dotenv.config()

const app = express()
const PORT = process.env.PORT || 8000

// ─── MIDDLEWARE ───
app.use(helmet())
app.use(cors({
  origin: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  credentials: true,
}))
app.use(morgan('dev'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// ─── HEALTH CHECK ───
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: '🚀 WYWA API is running!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  })
})

// ─── CONTACT MESSAGES ───
app.post('/api/contact', (req, res) => {
  const { name, email, phone, subject, message } = req.body
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email and message are required' })
  }
  console.log('📧 New message from:', name, email)
  res.status(201).json({ message: 'Message sent successfully!' })
})

// ─── VOLUNTEERS ───
app.post('/api/volunteers/apply', (req, res) => {
  const { name, email, phone } = req.body
  if (!name || !email || !phone) {
    return res.status(400).json({ error: 'Name, email and phone are required' })
  }
  console.log('🤝 New volunteer application from:', name, email)
  res.status(201).json({ message: 'Application submitted successfully!' })
})

// ─── NEWSLETTER ───
app.post('/api/newsletter/subscribe', (req, res) => {
  const { email } = req.body
  if (!email) {
    return res.status(400).json({ error: 'Email is required' })
  }
  console.log('📬 New newsletter subscriber:', email)
  res.status(201).json({ message: 'Subscribed successfully!' })
})

// ─── PROGRAMS ───
app.get('/api/programs', (req, res) => {
  res.json({
    programs: [
      { id: 1, title: 'WYWA Scholarship Fund', category: 'EDUCATION', status: 'PUBLISHED', slug: 'scholarship-fund' },
      { id: 2, title: 'Mobile Health Clinics', category: 'HEALTH', status: 'PUBLISHED', slug: 'mobile-health' },
      { id: 3, title: 'Clean Water Initiative', category: 'INFRASTRUCTURE', status: 'PUBLISHED', slug: 'clean-water' },
    ]
  })
})

// ─── EVENTS ───
app.get('/api/events', (req, res) => {
  res.json({
    events: [
      { id: 1, title: 'Annual Scholarship Ceremony', date: '2026-05-15', location: 'Wana', slug: 'scholarship-ceremony-2026' },
      { id: 2, title: 'Free Medical Camp', date: '2026-05-22', location: 'Shawal Valley', slug: 'medical-camp-may-2026' },
    ]
  })
})

// ─── NEWS ───
app.get('/api/news', (req, res) => {
  res.json({
    news: [
      { id: 1, title: 'WYWA Scholar Becomes First Female Doctor', slug: 'first-female-doctor', publishedAt: '2026-04-20' },
      { id: 2, title: '60th Water Well Completed', slug: '60th-water-well', publishedAt: '2026-04-15' },
    ]
  })
})

// ─── TEAM ───
app.get('/api/team', (req, res) => {
  res.json({
    team: [
      { id: 1, name: 'Zahir Khan', role: 'Founder & President', isActive: true },
      { id: 2, name: 'Nasreen Mehsud', role: 'Director of Education', isActive: true },
    ]
  })
})

// ─── GALLERY ───
app.get('/api/gallery', (req, res) => {
  res.json({
    gallery: [
      { id: 1, albumName: 'Scholarship Ceremony 2025', imageUrl: '', caption: 'Annual ceremony' },
      { id: 2, albumName: 'Flood Relief Operations', imageUrl: '', caption: 'Relief work' },
    ]
  })
})

// ─── DONATIONS ───
app.post('/api/donations/initiate', (req, res) => {
  const { donorName, email, amount, campaign } = req.body
  if (!donorName || !email || !amount) {
    return res.status(400).json({ error: 'Donor name, email and amount are required' })
  }
  console.log('💰 New donation from:', donorName, 'Amount:', amount)
  res.status(201).json({
    message: 'Donation initiated successfully!',
    reference: `WYWA-${Date.now()}`
  })
})

// ─── REPORTS ───
app.get('/api/reports', (req, res) => {
  res.json({
    reports: [
      { id: 1, title: 'Annual Report 2025', year: 2025, category: 'ANNUAL_REPORT' },
      { id: 2, title: 'Financial Statement 2025', year: 2025, category: 'FINANCIAL_STATEMENT' },
    ]
  })
})

// ─── SETTINGS ───
app.get('/api/settings', (req, res) => {
  res.json({
    settings: {
      siteName: 'WYWA',
      contactEmail: 'info@wywa.org.pk',
      phone: '+92-300-1234567',
      address: 'Wana, South Waziristan, KP, Pakistan',
    }
  })
})

// ─── AUTH ───
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body
  if (email === 'admin@wywa.org.pk' && password === 'wywa2026') {
    res.json({
      token: 'wywa-admin-token-2026',
      user: {
        id: '1',
        name: 'Super Admin',
        email: 'admin@wywa.org.pk',
        role: 'SUPER_ADMIN',
      }
    })
  } else {
    res.status(401).json({ error: 'Invalid email or password' })
  }
})

app.get('/api/auth/me', (req, res) => {
  res.json({
    user: {
      id: '1',
      name: 'Super Admin',
      email: 'admin@wywa.org.pk',
      role: 'SUPER_ADMIN',
    }
  })
})

// ─── 404 ───
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `Cannot find ${req.originalUrl}`
  })
})

// ─── ERROR HANDLER ───
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`🚀 WYWA API running on http://localhost:${PORT}`)
})

module.exports = app
