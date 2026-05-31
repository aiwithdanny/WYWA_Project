const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const dotenv = require('dotenv')
const path = require('path')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const { uploadToCloudinary } = require('./utils/cloudinary')

dotenv.config({ path: path.resolve(__dirname, '.env') })

const app = express()
const PORT = process.env.PORT || 8000
const JWT_SECRET = process.env.JWT_SECRET || 'wywa-local-secret-key-minimum-32-chars'

// ─── PRISMA ───
let prisma = null
try {
  const { PrismaClient } = require('@prisma/client')
  prisma = new PrismaClient({ log: ['error'] })
  console.log('📦 Prisma client initialized')
} catch (e) {
  console.log('⚠️ Prisma not available')
  process.exit(1)
}

// Test connection on startup
prisma.$connect()
  .then(() => console.log('✅ Database connected successfully'))
  .catch((err) => console.error('❌ Database connection failed:', err))

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})

// ─── HELPERS ───
const generateId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

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
  origin: function(origin, callback) {
    const allowed = [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://wywa.vercel.app',
      process.env.FRONTEND_URL,
      process.env.CORS_ORIGIN,
      process.env.NEXTAUTH_URL,
    ].filter(Boolean)
    if (!origin || allowed.includes(origin) || allowed.some(a => origin?.startsWith(a))) {
      callback(null, true)
    } else {
      callback(null, true) // Allow all for development
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))
app.use(morgan('dev'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// ─── MULTER CONFIG ───
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } })

// ─── HEALTH CHECK ───
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: '\uD83D\uDE80 WYWA API is running!',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    prisma: !!prisma,
  })
})

// ═══════════════════════════════════════════════════════════════
// UPLOAD
// ═══════════════════════════════════════════════════════════════
app.post('/api/upload', protect, restrictTo('SUPER_ADMIN', 'EDITOR'), upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ status: 'fail', message: 'No image file provided' })
    const folder = req.body.folder || 'wywa/general'
    const result = await uploadToCloudinary(req.file.buffer, folder)
    res.json({ status: 'success', url: result.secure_url, publicId: result.public_id })
  } catch (err) {
    console.error('Cloudinary upload error:', err)
    res.status(500).json({ status: 'error', message: 'Image upload failed' })
  }
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
  try {
    console.log('POST /api/programs body:', req.body)
    const { title, slug, description, category, status, beneficiaries, location, startDate, isFeatured, imageUrl } = req.body
    
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' })
    }
    
    const finalSlug = slug?.trim() || title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now()
    
    const program = await prisma.program.create({
      data: {
        title: title.trim(),
        slug: finalSlug,
        description: description?.trim() || '',
        category: category || 'OTHER',
        status: status || 'PUBLISHED',
        beneficiaries: beneficiaries ? parseInt(beneficiaries) : null,
        location: location?.trim() || null,
        startDate: startDate ? new Date(startDate) : null,
        imageUrl: imageUrl?.trim() || null,
        isFeatured: !!isFeatured,
      }
    })
    
    res.status(201).json({ program, message: 'Program created successfully' })
  } catch (error) {
    console.error('POST /api/programs error:', error)
    res.status(500).json({ 
      error: 'Failed to create program',
      details: error.message 
    })
  }
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
  try {
    console.log('POST /api/events body:', req.body)
    const { title, slug, description, date, location, isPublished, imageUrl } = req.body
    
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' })
    }
    if (!date) {
      return res.status(400).json({ error: 'Date is required' })
    }
    
    const finalSlug = slug?.trim() || title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now()
    
    const event = await prisma.event.create({
      data: {
        title: title.trim(),
        slug: finalSlug,
        description: description?.trim() || '',
        date: new Date(date),
        location: location?.trim() || '',
        imageUrl: imageUrl?.trim() || null,
        isPublished: isPublished !== undefined ? isPublished : true,
      }
    })
    
    res.status(201).json({ event, message: 'Event created successfully' })
  } catch (error) {
    console.error('POST /api/events error:', error)
    res.status(500).json({ 
      error: 'Failed to create event',
      details: error.message 
    })
  }
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
  try {
    console.log('POST /api/news body:', req.body)
    const { title, slug, excerpt, body, category, status, isFeatured, publishedAt, imageUrl } = req.body
    
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' })
    }
    
    const finalSlug = slug?.trim() || title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now()
    
    const article = await prisma.news.create({
      data: {
        title: title.trim(),
        slug: finalSlug,
        excerpt: excerpt?.trim() || '',
        body: body?.trim() || '',
        category: category || 'GENERAL',
        status: status || 'PUBLISHED',
        isFeatured: !!isFeatured,
        imageUrl: imageUrl?.trim() || null,
        publishedAt: publishedAt ? new Date(publishedAt) : (status === 'PUBLISHED' ? new Date() : null),
      }
    })
    
    res.status(201).json({ article, message: 'Article created successfully' })
  } catch (error) {
    console.error('POST /api/news error:', error)
    res.status(500).json({ 
      error: 'Failed to create article',
      details: error.message 
    })
  }
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
  try {
    console.log('POST /api/team body:', req.body)
    const { name, role, bio, email, phone, orderIndex, imageUrl } = req.body
    
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' })
    }
    if (!role || !role.trim()) {
      return res.status(400).json({ error: 'Role is required' })
    }
    
    const member = await prisma.teamMember.create({
      data: {
        name: name.trim(),
        role: role.trim(),
        bio: bio?.trim() || '',
        email: email?.trim() || null,
        phone: phone?.trim() || null,
        orderIndex: orderIndex || 0,
        imageUrl: imageUrl?.trim() || null,
        isActive: true,
      }
    })
    
    console.log('Created member:', member)
    res.status(201).json({ member, message: 'Team member added successfully' })
  } catch (error) {
    console.error('POST /api/team error:', error)
    res.status(500).json({ 
      error: 'Failed to create team member',
      details: error.message 
    })
  }
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
  try {
    console.log('POST /api/gallery body:', req.body)
    const { albumName, imageUrl, caption, year, isFeatured } = req.body
    
    if (!albumName || !albumName.trim()) {
      return res.status(400).json({ error: 'Album name is required' })
    }
    
    const item = await prisma.gallery.create({
      data: {
        albumName: albumName.trim(),
        imageUrl: imageUrl?.trim() || '',
        caption: caption?.trim() || null,
        year: year ? parseInt(year) : new Date().getFullYear(),
        isFeatured: !!isFeatured,
      }
    })
    
    res.status(201).json({ item, message: 'Gallery item added successfully' })
  } catch (error) {
    console.error('POST /api/gallery error:', error)
    res.status(500).json({ 
      error: 'Failed to add gallery item',
      details: error.message 
    })
  }
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
      paymentRef: `WYWA-${Date.now()}`,
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
  try {
    const settings = await prisma.siteSetting.findMany()
    const formatted = {}
    settings.forEach(s => {
      try {
        formatted[s.key] = JSON.parse(s.value)
      } catch {
        formatted[s.key] = s.value
      }
    })
    res.json({ settings: formatted })
  } catch (error) {
    console.error('Settings fetch error:', error)
    res.status(500).json({ error: 'Failed to fetch settings' })
  }
})

app.put('/api/settings', protect, restrictTo('SUPER_ADMIN'), async (req, res) => {
  try {
    const updates = req.body
    const promises = Object.entries(updates).map(([key, value]) =>
      prisma.siteSetting.upsert({
        where: { key },
        update: { value: JSON.stringify(value) },
        create: { key, value: JSON.stringify(value), group: 'general' }
      })
    )
    await Promise.all(promises)
    res.json({ status: 'success', message: 'Settings saved successfully!' })
  } catch (error) {
    console.error('Settings save error:', error)
    res.status(500).json({ error: 'Failed to save settings' })
  }
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
app.get('/api/stats', async (req, res) => {
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
  res.status(404).json({ status: 'fail', message: `Cannot find ${req.originalUrl}` })
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.statusCode || 500).json({
    status: err.status || 'error',
    message: err.message || 'Internal server error',
  })
})

app.listen(PORT, () => {
  console.log(`\uD83D\uDE80 WYWA API running on http://localhost:${PORT}`)
  console.log(`\uD83D\uDCE6 Prisma: connected`)
})

module.exports = app


