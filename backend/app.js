const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Body Parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data Sanitization
app.use(hpp());

// Compression
app.use(compression());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'WYWA API is running' });
});

// API Routes will be imported here
// app.use('/api/v1/auth', require('./routes/authRoutes'));
// app.use('/api/v1/users', require('./routes/userRoutes'));
// app.use('/api/v1/programs', require('./routes/programRoutes'));
// app.use('/api/v1/events', require('./routes/eventRoutes'));
// app.use('/api/v1/news', require('./routes/newsRoutes'));
// app.use('/api/v1/team', require('./routes/teamRoutes'));
// app.use('/api/v1/gallery', require('./routes/galleryRoutes'));
// app.use('/api/v1/donations', require('./routes/donationRoutes'));
// app.use('/api/v1/volunteers', require('./routes/volunteerRoutes'));
// app.use('/api/v1/messages', require('./routes/messageRoutes'));
// app.use('/api/v1/reports', require('./routes/reportRoutes'));
// app.use('/api/v1/settings', require('./routes/settingsRoutes'));
// app.use('/api/v1/newsletter', require('./routes/newsletterRoutes'));

// 404 Handler
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

module.exports = app;
