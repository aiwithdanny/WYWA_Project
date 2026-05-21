import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'

// Routes
import authRoutes from './routes/auth.routes'
import programRoutes from './routes/program.routes'
import eventRoutes from './routes/event.routes'
import newsRoutes from './routes/news.routes'
import teamRoutes from './routes/team.routes'
import donationRoutes from './routes/donation.routes'
import volunteerRoutes from './routes/volunteer.routes'
import messageRoutes from './routes/message.routes'
import galleryRoutes from './routes/gallery.routes'
import reportRoutes from './routes/report.routes'
import settingsRoutes from './routes/settings.routes'
import newsletterRoutes from './routes/newsletter.routes'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// ─── MIDDLEWARE ───
app.use(helmet())

app.use(cors({
  origin: function(origin, callback) {
    const allowed = [
      'http://localhost:3000',
      'https://wywa-backend.onrender.com',
      process.env.FRONTEND_URL,
    ].filter(Boolean)
    
    if (!origin || allowed.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(null, true)
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))
app.use(morgan('dev'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// ─── RATE LIMITING ───
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' }
})
app.use('/api/', limiter)

const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { error: 'Too many attempts, please try again later.' }
})

// ─── ROUTES ───
app.use('/api/auth',       authRoutes)
app.use('/api/programs',   programRoutes)
app.use('/api/events',     eventRoutes)
app.use('/api/news',       newsRoutes)
app.use('/api/team',       teamRoutes)
app.use('/api/donations',  donationRoutes)
app.use('/api/volunteers', volunteerRoutes)
app.use('/api/contact',    messageRoutes)
app.use('/api/gallery',    galleryRoutes)
app.use('/api/reports',    reportRoutes)
app.use('/api/settings',   settingsRoutes)
app.use('/api/newsletter', newsletterRoutes)

// ─── HEALTH CHECK ───
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'WYWA API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  })
})

// ─── 404 HANDLER ───
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// ─── ERROR HANDLER ───
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  })
})

app.listen(PORT, () => {
  console.log(`🚀 WYWA API running on http://localhost:${PORT}`)
})

export default app
