const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const TMDB_BASE = 'https://api.themoviedb.org/3';

const tmdbFetch = async (endpoint, params = {}) => {
  const url = new URL(`${TMDB_BASE}${endpoint}`);
  url.searchParams.append('api_key', process.env.TMDB_API_KEY);
  Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`TMDB error: ${res.status}`);
  return res.json();
};

// Search movies
router.get('/search', async (req, res) => {
  try {
    const { query, page = 1 } = req.query;
    if (!query) return res.status(400).json({ success: false, message: 'Query is required.' });
    const data = await tmdbFetch('/search/movie', { query, page });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get movie details
router.get('/movie/:id', async (req, res) => {
  try {
    const data = await tmdbFetch(`/movie/${req.params.id}`, { append_to_response: 'credits,videos' });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get trending movies
router.get('/trending', async (req, res) => {
  try {
    const data = await tmdbFetch('/trending/movie/week');
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get popular movies
router.get('/popular', async (req, res) => {
  try {
    const data = await tmdbFetch('/movie/popular');
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get top rated movies
router.get('/top-rated', async (req, res) => {
  try {
    const data = await tmdbFetch('/movie/top_rated');
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;