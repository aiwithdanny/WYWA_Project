const fs = require('fs')

const code = `const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const dotenv = require('dotenv')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

dotenv.config()

const app = express()
const PORT = process.env.PORT || 8000
const JWT_SECRET = process.env.JWT_SECRET || 'wywa-local-secret-key-minimum-32-chars'

// ─── PRISMA ───
let prisma = null
try {
  const { PrismaClient } = require('@prisma/client')
  prisma = new PrismaClient({ log: ['error'] })
  console.log('\\uD83D\\uDCE6 Prisma client initialized')
} catch (e) {
  console.log('\\u26A0\\uFE0F Prisma not available')
  process.exit(1)
}

// ─── HELPERS ───
const generateId = (prefix) => \`\${prefix}-\${Date.now()}-\${Math.random().toString(36).slice(2, 7)}\`

const protect = async (req, res, next) => {
  try {
    const auth = req.headers.authorization
    let token = null
    if (auth && auth.startsWith('Bearer ')) token = auth.split(' ')[1]
    if (!token) return res.status(401).json({ status: 'fail', message: 'Not authorized' })
    const decoded = jwt.verify(token, JWT_SECRET)
    const user = await prisma.user.findUnique({ where: { id: decoded.id } })
    if (!user) return res.status(401).json({ status: 'fail', message: 'User not found' })
    req.user = user
    next()
  } catch (err) {
    return res.status(401).json({ status: 'fail', message: 'Token invalid' })
  }
}

const restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ status: 'fail', message: 'Permission denied' })
  }
  next()
}

// ─── MIDDLEWARE ───
app.use(helmet())
app.use(cors({
  origin: process.env.CORS_ORIGIN || process.env.NEXTAUTH_URL || 'http://localhost:3000',
  credentials: true,
}))
app.use(morgan('dev'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// ─── HEALTH CHECK ───
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: '\\uD83D\\uDE80 WYWA API is running!',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    prisma: !!prisma,
  })
})

// ═══════════════════════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════════════════════
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return res.status(401).json({ status: 'fail', message: 'Invalid credentials' })
  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) return res.status(401).json({ status: 'fail', message: 'Invalid credentials' })
  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' })
  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role }
  })
})

app.get('/api/auth/me', protect, (req, res) => {
  res.json({ user: { id: req.user.id, name: req.user.name, email: req.user.email, role: req.user.role } })
})

// ═══════════════════════════════════════════════════════════════
// PROGRAMS
// ═══════════════════════════════════════════════════════════════
app.get('/api/programs', async (req, res) => {
  const { category, status, search } = req.query
  const where = {}
  if (category) where.category = category
  if (status) where.status = status
  if (search) where.title = { contains: search, mode: 'insensitive' }
  const programs = await prisma.program.findMany({ where, orderBy: { createdAt: 'desc' } })
  res.json({ programs, count: programs.length })
})

app.get('/api/programs/:id', async (req, res) => {
  const program = await prisma.program.findFirst({
    where: { OR: [{ id: req.params.id }, { slug: req.params.id }] }
  })
  if (!program) return res.status(404).json({ status: 'fail', message: 'Program not found' })
  res.json({ program })
})

app.post('/api/programs', protect, restrictTo('SUPER_ADMIN', 'EDITOR'), async (req, res) => {
  const { title, slug, description, category, status, beneficiaries, location, startDate, isFeatured } = req.body
  if (!title || !slug) return res.status(400).json({ status: 'fail', message: 'Title and slug required' })
  const program = await prisma.program.create({
    data: { title, slug, description: description || '', category: category || 'OTHER', status: status || 'DRAFT', beneficiaries: beneficiaries || 0, location: location || '', startDate: startDate ? new Date(startDate) : null, isFeatured: !!isFeatured }
  })
  res.status(201).json({ status: 'success', program })
})

app.put('/api/programs/:id', protect, restrictTo('SUPER_ADMIN', 'EDITOR'), async (req, res) => {
  try {
    const program = await prisma.program.update({ where: { id: req.params.id }, data: req.body })
    res.json({ status: 'success', program })
  } catch {
    res.status(404).json({ status: 'fail', message: 'Program not found' })
  }
})

app.delete('/api/programs/:id', protect, restrictTo('SUPER_ADMIN', 'EDITOR'), async (req, res) => {
  try {
    await prisma.program.delete({ where: { id: req.params.id } })
    res.json({ status: 'success', message: 'Program deleted' })
  } catch {
    res.status(404).json({ status: 'fail', message: 'Program not found' })
  }
})

// ═══════════════════════════════════════════════════════════════
// EVENTS
// ═══════════════════════════════════════════════════════════════
app.get('/api/events', async (req, res) => {
  const where = {}
  if (req.query.type) where.type = req.query.type
  if (req.query.upcoming === 'true') where.date = { gte: new Date() }
  if (req.query.isPublished === 'true') where.isPublished = true
  const events = await prisma.event.findMany({ where, orderBy: { date: 'asc' } })
  res.json({ events, count: events.length })
})

app.get('/api/events/:id', async (req, res) => {
  const event = await prisma.event.findFirst({
    where: { OR: [{ id: req.params.id }, { slug: req.params.id }] },
    include: { registrations: true }
  })
  if (!event) return res.status(404).json({ status: 'fail', message: 'Event not found' })
  res.json({ event })
})

app.post('/api/events', protect, restrictTo('SUPER_ADMIN', 'EDITOR'), async (req, res) => {
  const { title, slug, description, date, location, type, isPublished } = req.body
  if (!title || !date) return res.status(400).json({ status: 'fail', message: 'Title and date required' })
  const event = await prisma.event.create({
    data: {
      title,
      slug: slug || title.toLowerCase().replace(/\\s+/g, '-'),
      description: description || '',
      date: new Date(date),
      location: location || '',
      type: type || 'Other',
      isPublished: isPublished !== undefined ? isPublished : true,
    }
  })
  res.status(201).json({ status: 'success', event })
})

app.put('/api/events/:id', protect, restrictTo('SUPER_ADMIN', 'EDITOR'), async (req, res) => {
  try {
    const data = { ...req.body }
    if (data.date) data.date = new Date(data.date)
    const event = await prisma.event.update({ where: { id: req.params.id }, data })
    res.json({ status: 'success', event })
  } catch {
    res.status(404).json({ status: 'fail', message: 'Event not found' })
  }
})

app.delete('/api/events/:id', protect, restrictTo('SUPER_ADMIN', 'EDITOR'), async (req, res) => {
  try {
    await prisma.event.delete({ where: { id: req.params.id } })
    res.json({ status: 'success', message: 'Event deleted' })
  } catch {
    res.status(404).json({ status: 'fail', message: 'Event not found' })
  }
})

// Event registrations
app.post('/api/events/:id/register', async (req, res) => {
  const event = await prisma.event.findUnique({ where: { id: req.params.id } })
  if (!event) return res.status(404).json({ status: 'fail', message: 'Event not found' })
  const { name, email, phone, message } = req.body
  if (!name || !email || !phone) return res.status(400).json({ status: 'fail', message: 'Name, email and phone required' })
  const reg = await prisma.eventRegistration.create({
    data: { eventId: event.id, name, email, phone, message: message || '', status: 'PENDING' }
  })
  res.status(201).json({ status: 'success', message: 'Registered successfully', registration: reg })
})

// ═══════════════════════════════════════════════════════════════
// NEWS
// ═══════════════════════════════════════════════════════════════
app.get('/api/news', async (req, res) => {
  const where = {}
  if (req.query.category) where.category = req.query.category
  if (req.query.status) where.status = req.query.status
  if (req.query.featured === 'true') where.isFeatured = true
  const news = await prisma.news.findMany({ where, orderBy: { publishedAt: 'desc' } })
  res.json({ news, count: news.length })
})

app.get('/api/news/:id', async (req, res) => {
  const article = await prisma.news.findFirst({
    where: { OR: [{ id: req.params.id }, { slug: req.params.id }] }
  })
  if (!article) return res.status(404).json({ status: 'fail', message: 'Article not found' })
  res.json({ news: article })
})

app.post('/api/news', protect, restrictTo('SUPER_ADMIN', 'EDITOR'), async (req, res) => {
  const { title, slug, excerpt, body, category, status, isFeatured, publishedAt } = req.body
  if (!title || !body) return res.status(400).json({ status: 'fail', message: 'Title and body required' })
  const article = await prisma.news.create({
    data: {
      title,
      slug: slug || title.toLowerCase().replace(/\\s+/g, '-'),
      excerpt: excerpt || '',
      body,
      category: category || 'GENERAL',
      status: status || 'DRAFT',
      isFeatured: !!isFeatured,
      publishedAt: publishedAt ? new Date(publishedAt) : (status === 'PUBLISHED' ? new Date() : null),
    }
  })
  res.status(201).json({ status: 'success', news: article })
})

app.put('/api/news/:id', protect, restrictTo('SUPER_ADMIN', 'EDITOR'), async (req, res) => {
  try {
    const data = { ...req.body }
    if (data.publishedAt) data.publishedAt = new Date(data.publishedAt)
    const article = await prisma.news.update({ where: { id: req.params.id }, data })
    res.json({ status: 'success', news: article })
  } catch {
    res.status(404).json({ status: 'fail', message: 'Article not found' })
  }
})

app.delete('/api/news/:id', protect, restrictTo('SUPER_ADMIN', 'EDITOR'), async (req, res) => {
  try {
    await prisma.news.delete({ where: { id: req.params.id } })
    res.json({ status: 'success', message: 'Article deleted' })
  } catch {
    res.status(404).json({ status: 'fail', message: 'Article not found' })
  }
})

// ═══════════════════════════════════════════════════════════════
// TEAM
// ═══════════════════════════════════════════════════════════════
app.get('/api/team', async (req, res) => {
  const team = await prisma.teamMember.findMany({ where: { isActive: true }, orderBy: { orderIndex: 'asc' } })
  res.json({ team, count: team.length })
})

app.get('/api/team/:id', async (req, res) => {
  const member = await prisma.teamMember.findUnique({ where: { id: req.params.id } })
  if (!member) return res.status(404).json({ status: 'fail', message: 'Member not found' })
  res.json({ team: member })
})

app.post('/api/team', protect, restrictTo('SUPER_ADMIN', 'EDITOR'), async (req, res) => {
  const { name, role, bio, email, phone, orderIndex, imageUrl } = req.body
  if (!name || !role) return res.status(400).json({ status: 'fail', message: 'Name and role required' })
  const member = await prisma.teamMember.create({
    data: { name, role, bio: bio || '', email: email || '', phone: phone || '', orderIndex: orderIndex || 0, imageUrl: imageUrl || '', isActive: true }
  })
  res.status(201).json({ status: 'success', team: member })
})

app.put('/api/team/:id', protect, restrictTo('SUPER_ADMIN', 'EDITOR'), async (req, res) => {
  try {
    const member = await prisma.teamMember.update({ where: { id: req.params.id }, data: req.body })
    res.json({ status: 'success', team: member })
  } catch {
    res.status(404).json({ status: 'fail', message: 'Member not found' })
  }
})

app.delete('/api/team/:id', protect, restrictTo('SUPER_ADMIN', 'EDITOR'), async (req, res) => {
  try {
    await prisma.teamMember.update({ where: { id: req.params.id }, data: { isActive: false } })
    res.json({ status: 'success', message: 'Member deactivated' })
  } catch {
    res.status(404).json({ status: 'fail', message: 'Member not found' })
  }
})

// ═══════════════════════════════════════════════════════════════
// GALLERY
// ═══════════════════════════════════════════════════════════════
app.get('/api/gallery', async (req, res) => {
  const where = {}
  if (req.query.album) where.albumName = req.query.album
  if (req.query.featured === 'true') where.isFeatured = true
  const gallery = await prisma.gallery.findMany({ where, orderBy: { uploadedAt: 'desc' } })
  res.json({ gallery, count: gallery.length })
})

app.get('/api/gallery/:id', async (req, res) => {
  const item = await prisma.gallery.findUnique({ where: { id: req.params.id } })
  if (!item) return res.status(404).json({ status: 'fail', message: 'Image not found' })
  res.json({ gallery: item })
})

app.post('/api/gallery', protect, restrictTo('SUPER_ADMIN', 'EDITOR'), async (req, res) => {
  const { albumName, imageUrl, caption, year, isFeatured } = req.body
  if (!albumName) return res.status(400).json({ status: 'fail', message: 'Album name required' })
  const item = await prisma.gallery.create({
    data: { albumName, imageUrl: imageUrl || '', caption: caption || '', year: year || new Date().getFullYear(), isFeatured: !!isFeatured }
  })
  res.status(201).json({ status: 'success', gallery: item })
})

app.put('/api/gallery/:id', protect, restrictTo('SUPER_ADMIN', 'EDITOR'), async (req, res) => {
  try {
    const item = await prisma.gallery.update({ where: { id: req.params.id }, data: req.body })
    res.json({ status: 'success', gallery: item })
  } catch {
    res.status(404).json({ status: 'fail', message: 'Image not found' })
  }
})

app.delete('/api/gallery/:id', protect, restrictTo('SUPER_ADMIN', 'EDITOR'), async (req, res) => {
  try {
    await prisma.gallery.delete({ where: { id: req.params.id } })
    res.json({ status: 'success', message: 'Image deleted' })
  } catch {
    res.status(404).json({ status: 'fail', message: 'Image not found' })
  }
})

// ═══════════════════════════════════════════════════════════════
// CONTACT / MESSAGES
// ═══════════════════════════════════════════════════════════════
app.post('/api/contact', async (req, res) => {
  const { name, email, phone, subject, message } = req.body
  if (!name || !email || !message) {
    return res.status(400).json({ status: 'fail', message: 'Name, email and message are required' })
  }
  const msg = await prisma.message.create({
    data: { name, email, phone: phone || '', subject: subject || 'General', message, status: 'NEW', isRead: false, isReplied: false }
  })
  res.status(201).json({ status: 'success', message: 'Message sent successfully!', id: msg.id })
})

app.get('/api/contact', protect, restrictTo('SUPER_ADMIN', 'EDITOR'), async (req, res) => {
  const where = {}
  if (req.query.status) where.status = req.query.status
  if (req.query.unread === 'true') where.isRead = false
  const messages = await prisma.message.findMany({ where, orderBy: { createdAt: 'desc' } })
  res.json({ messages, count: messages.length })
})

app.get('/api/contact/:id', protect, restrictTo('SUPER_ADMIN', 'EDITOR'), async (req, res) => {
  const msg = await prisma.message.update({
    where: { id: req.params.id },
    data: { isRead: true, status: 'READ' }
  })
  if (!msg) return res.status(404).json({ status: 'fail', message: 'Message not found' })
  res.json({ message: msg })
})

app.put('/api/contact/:id', protect, restrictTo('SUPER_ADMIN', 'EDITOR'), async (req, res) => {
  try {
    const msg = await prisma.message.update({ where: { id: req.params.id }, data: req.body })
    res.json({ status: 'success', message: msg })
  } catch {
    res.status(404).json({ status: 'fail', message: 'Message not found' })
  }
})

app.delete('/api/contact/:id', protect, restrictTo('SUPER_ADMIN', 'EDITOR'), async (req, res) => {
  try {
    await prisma.message.delete({ where: { id: req.params.id } })
    res.json({ status: 'success', message: 'Message deleted' })
  } catch {
    res.status(404).json({ status: 'fail', message: 'Message not found' })
  }
})

// ═══════════════════════════════════════════════════════════════
// VOLUNTEERS
// ═══════════════════════════════════════════════════════════════
app.post('/api/volunteers/apply', async (req, res) => {
  const { name, email, phone, skills, availability, area, experience, motivation } = req.body
  if (!name || !email || !phone) {
    return res.status(400).json({ status: 'fail', message: 'Name, email and phone are required' })
  }
  const vol = await prisma.volunteer.create({
    data: {
      name, email, phone,
      skills: skills || [],
      availability: availability || 'Flexible',
      area: area || 'OTHER',
      experience: experience || '',
      motivation: motivation || '',
      status: 'PENDING',
    }
  })
  res.status(201).json({ status: 'success', message: 'Application submitted successfully!', volunteer: vol })
})

app.get('/api/volunteers', protect, restrictTo('SUPER_ADMIN', 'EDITOR'), async (req, res) => {
  const where = {}
  if (req.query.status) where.status = req.query.status
  const volunteers = await prisma.volunteer.findMany({ where, orderBy: { createdAt: 'desc' } })
  res.json({ volunteers, count: volunteers.length })
})

app.get('/api/volunteers/:id', protect, restrictTo('SUPER_ADMIN', 'EDITOR'), async (req, res) => {
  const vol = await prisma.volunteer.findUnique({ where: { id: req.params.id } })
  if (!vol) return res.status(404).json({ status: 'fail', message: 'Volunteer not found' })
  res.json({ volunteer: vol })
})

app.put('/api/volunteers/:id', protect, restrictTo('SUPER_ADMIN', 'EDITOR'), async (req, res) => {
  try {
    const vol = await prisma.volunteer.update({ where: { id: req.params.id }, data: req.body })
    res.json({ status: 'success', volunteer: vol })
  } catch {
    res.status(404).json({ status: 'fail', message: 'Volunteer not found' })
  }
})

app.delete('/api/volunteers/:id', protect, restrictTo('SUPER_ADMIN', 'EDITOR'), async (req, res) => {
  try {
    await prisma.volunteer.delete({ where: { id: req.params.id } })
    res.json({ status: 'success', message: 'Volunteer deleted' })
  } catch {
    res.status(404).json({ status: 'fail', message: 'Volunteer not found' })
  }
})

// ═══════════════════════════════════════════════════════════════
// DONATIONS
// ═══════════════════════════════════════════════════════════════
app.post('/api/donations/initiate', async (req, res) => {
  const { donorName, email, amount, campaign, currency, paymentMethod, message, isAnonymous } = req.body
  if (!donorName || !email || !amount) {
    return res.status(400).json({ status: 'fail', message: 'Donor name, email and amount are required' })
  }
  const donation = await prisma.donation.create({
    data: {
      donorName, email,
      phone: req.body.phone || '',
      amount: parseFloat(amount),
      currency: currency || 'PKR',
      campaign: campaign || 'General Fund',
      paymentMethod: paymentMethod || 'BANK_TRANSFER',
      status: 'PENDING',
      paymentRef: \`WYWA-\${Date.now()}\`,
      message: message || '',
      isAnonymous: !!isAnonymous,
      receiptSent: false,
    }
  })
  res.status(201).json({ status: 'success', message: 'Donation initiated successfully!', donation })
})

app.get('/api/donations', protect, restrictTo('SUPER_ADMIN', 'EDITOR'), async (req, res) => {
  const where = {}
  if (req.query.status) where.status = req.query.status
  const donations = await prisma.donation.findMany({ where, orderBy: { createdAt: 'desc' } })
  const total = donations.reduce((sum, d) => sum + d.amount, 0)
  res.json({ donations, count: donations.length, total })
})

app.get('/api/donations/:id', protect, restrictTo('SUPER_ADMIN', 'EDITOR'), async (req, res) => {
  const donation = await prisma.donation.findUnique({ where: { id: req.params.id } })
  if (!donation) return res.status(404).json({ status: 'fail', message: 'Donation not found' })
  res.json({ donation })
})

app.put('/api/donations/:id', protect, restrictTo('SUPER_ADMIN', 'EDITOR'), async (req, res) => {
  try {
    const donation = await prisma.donation.update({ where: { id: req.params.id }, data: req.body })
    res.json({ status: 'success', donation })
  } catch {
    res.status(404).json({ status: 'fail', message: 'Donation not found' })
  }
})

app.delete('/api/donations/:id', protect, restrictTo('SUPER_ADMIN'), async (req, res) => {
  try {
    await prisma.donation.delete({ where: { id: req.params.id } })
    res.json({ status: 'success', message: 'Donation deleted' })
  } catch {
    res.status(404).json({ status: 'fail', message: 'Donation not found' })
  }
})

// ═══════════════════════════════════════════════════════════════
// NEWSLETTER
// ═══════════════════════════════════════════════════════════════
app.post('/api/newsletter/subscribe', async (req, res) => {
  const { email, name } = req.body
  if (!email) return res.status(400).json({ status: 'fail', message: 'Email is required' })
  const existing = await prisma.newsletter.findUnique({ where: { email } })
  if (existing) return res.status(200).json({ status: 'success', message: 'Already subscribed' })
  const sub = await prisma.newsletter.create({
    data: { email, name: name || '', isConfirmed: false }
  })
  res.status(201).json({ status: 'success', message: 'Subscribed successfully!' })
})

app.get('/api/newsletter', protect, restrictTo('SUPER_ADMIN', 'EDITOR'), async (req, res) => {
  const subscribers = await prisma.newsletter.findMany({ orderBy: { subscribedAt: 'desc' } })
  res.json({ subscribers, count: subscribers.length })
})

app.delete('/api/newsletter/:id', protect, restrictTo('SUPER_ADMIN', 'EDITOR'), async (req, res) => {
  try {
    await prisma.newsletter.delete({ where: { id: req.params.id } })
    res.json({ status: 'success', message: 'Subscriber removed' })
  } catch {
    res.status(404).json({ status: 'fail', message: 'Subscriber not found' })
  }
})

// ═══════════════════════════════════════════════════════════════
// REPORTS
// ═══════════════════════════════════════════════════════════════
app.get('/api/reports', async (req, res) => {
  const reports = await prisma.report.findMany({ orderBy: { year: 'desc' } })
  res.json({ reports, count: reports.length })
})

app.post('/api/reports', protect, restrictTo('SUPER_ADMIN', 'EDITOR'), async (req, res) => {
  const { title, year, category, fileUrl } = req.body
  if (!title || !year) return res.status(400).json({ status: 'fail', message: 'Title and year required' })
  const report = await prisma.report.create({
    data: { title, year: parseInt(year), category: category || 'OTHER', fileUrl: fileUrl || '', isPublic: true, downloads: 0 }
  })
  res.status(201).json({ status: 'success', report })
})

app.delete('/api/reports/:id', protect, restrictTo('SUPER_ADMIN', 'EDITOR'), async (req, res) => {
  try {
    await prisma.report.delete({ where: { id: req.params.id } })
    res.json({ status: 'success', message: 'Report deleted' })
  } catch {
    res.status(404).json({ status: 'fail', message: 'Report not found' })
  }
})

// ═══════════════════════════════════════════════════════════════
// SETTINGS
// ═══════════════════════════════════════════════════════════════
app.get('/api/settings', async (req, res) => {
  const settings = await prisma.siteSetting.findMany()
  const result = {}
  settings.forEach(s => { result[s.key] = s.value })
  res.json({ settings: result })
})

app.put('/api/settings', protect, restrictTo('SUPER_ADMIN'), async (req, res) => {
  const data = req.body
  for (const key of Object.keys(data)) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value: data[key] },
      create: { key, value: data[key], group: 'general' }
    })
  }
  const settings = await prisma.siteSetting.findMany()
  const result = {}
  settings.forEach(s => { result[s.key] = s.value })
  res.json({ status: 'success', settings: result })
})

// ═══════════════════════════════════════════════════════════════
// USERS
// ═══════════════════════════════════════════════════════════════
app.get('/api/users', protect, restrictTo('SUPER_ADMIN'), async (req, res) => {
  const users = await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true } })
  res.json({ users, count: users.length })
})

app.post('/api/users', protect, restrictTo('SUPER_ADMIN'), async (req, res) => {
  const { name, email, password, role } = req.body
  if (!name || !email || !password) return res.status(400).json({ status: 'fail', message: 'Name, email and password required' })
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return res.status(409).json({ status: 'fail', message: 'Email already exists' })
  const user = await prisma.user.create({
    data: { name, email, passwordHash: await bcrypt.hash(password, 10), role: role || 'VIEWER', isActive: true }
  })
  res.status(201).json({ status: 'success', user: { id: user.id, name: user.name, email: user.email, role: user.role } })
})

app.put('/api/users/:id', protect, restrictTo('SUPER_ADMIN'), async (req, res) => {
  try {
    const data = { ...req.body }
    delete data.passwordHash
    if (data.password) {
      data.passwordHash = await bcrypt.hash(data.password, 10)
      delete data.password
    }
    const user = await prisma.user.update({ where: { id: req.params.id }, data })
    res.json({ status: 'success', user: { id: user.id, name: user.name, email: user.email, role: user.role } })
  } catch {
    res.status(404).json({ status: 'fail', message: 'User not found' })
  }
})

app.delete('/api/users/:id', protect, restrictTo('SUPER_ADMIN'), async (req, res) => {
  if (req.params.id === req.user.id) return res.status(400).json({ status: 'fail', message: 'Cannot delete yourself' })
  try {
    await prisma.user.update({ where: { id: req.params.id }, data: { isActive: false } })
    res.json({ status: 'success', message: 'User deactivated' })
  } catch {
    res.status(404).json({ status: 'fail', message: 'User not found' })
  }
})

// ═══════════════════════════════════════════════════════════════
// STATS / DASHBOARD
// ═══════════════════════════════════════════════════════════════
app.get('/api/stats', protect, restrictTo('SUPER_ADMIN', 'EDITOR'), async (req, res) => {
  const [programStats, donationAgg, volunteerStats, messageStats, eventStats, newsCount, teamCount, galleryCount, newsletterCount] = await Promise.all([
    prisma.program.findMany({ select: { beneficiaries: true, status: true } }),
    prisma.donation.aggregate({ _sum: { amount: true }, _count: true }),
    prisma.volunteer.findMany({ select: { status: true } }),
    prisma.message.findMany({ select: { isRead: true } }),
    prisma.event.findMany({ select: { date: true } }),
    prisma.news.count(),
    prisma.teamMember.count({ where: { isActive: true } }),
    prisma.gallery.count(),
    prisma.newsletter.count(),
  ])
  const stats = {
    beneficiaries: programStats.reduce((sum, p) => sum + (p.beneficiaries || 0), 0),
    activePrograms: programStats.filter(p => p.status === 'PUBLISHED').length,
    totalDonations: donationAgg._sum.amount || 0,
    donationCount: donationAgg._count,
    volunteers: volunteerStats.length,
    activeVolunteers: volunteerStats.filter(v => v.status === 'ACTIVE').length,
    messagesUnread: messageStats.filter(m => !m.isRead).length,
    messagesTotal: messageStats.length,
    upcomingEvents: eventStats.filter(e => new Date(e.date) >= new Date()).length,
    totalEvents: eventStats.length,
    newsArticles: newsCount,
    teamMembers: teamCount,
    galleryItems: galleryCount,
    newsletterSubscribers: newsletterCount,
  }
  res.json({ status: 'success', stats })
})

// ═══════════════════════════════════════════════════════════════
// 404 & ERROR HANDLERS
// ═══════════════════════════════════════════════════════════════
app.use('*', (req, res) => {
  res.status(404).json({ status: 'fail', message: \`Cannot find \${req.originalUrl}\` })
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.statusCode || 500).json({
    status: err.status || 'error',
    message: err.message || 'Internal server error',
  })
})

app.listen(PORT, () => {
  console.log(\`\\uD83D\\uDE80 WYWA API running on http://localhost:\${PORT}\`)
  console.log(\`\\uD83D\\uDCE6 Prisma: connected\`)
})

module.exports = app
`

fs.writeFileSync('backend/server.js', code)
console.log('backend/server.js updated successfully')
