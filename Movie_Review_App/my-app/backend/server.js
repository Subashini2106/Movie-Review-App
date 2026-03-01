require('dotenv').config();
const express = require('express');
const cors = require('cors');

const reviewsRouter = require('./routes/reviews');
const moviesRouter = require('./routes/movies');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'https://my-movie-log.netlify.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Routes
app.use('/api/reviews', reviewsRouter);
app.use('/api/movies', moviesRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Movie Review API is running 🎬', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

app.listen(PORT, () => {
  console.log(`🎬 Movie Review API running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app; 