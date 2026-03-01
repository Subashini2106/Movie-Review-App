const express = require('express');
const router = express.Router();
const db = require('../db');

// GET reviews for a specific movie
router.get('/:movieId', (req, res) => {
  db.all(
    'SELECT * FROM reviews WHERE movie_id = ? ORDER BY created_at DESC',
    [req.params.movieId],
    (err, rows) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      res.json({ success: true, data: rows || [] });
    }
  );
});

// GET all reviews
router.get('/', (req, res) => {
  db.all(
    'SELECT * FROM reviews ORDER BY created_at DESC LIMIT 20',
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      res.json({ success: true, data: rows || [] });
    }
  );
});

// POST create review
router.post('/', (req, res) => {
  const { movie_id, movie_title, reviewer_name, rating, review_text } = req.body;
  if (!movie_id || !movie_title || !reviewer_name || !rating || !review_text)
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  if (rating < 1 || rating > 10)
    return res.status(400).json({ success: false, message: 'Rating must be between 1 and 10.' });

  db.run(
    'INSERT INTO reviews (movie_id, movie_title, reviewer_name, rating, review_text) VALUES (?, ?, ?, ?, ?)',
    [movie_id, movie_title, reviewer_name, rating, review_text],
    function (err) {
      if (err) return res.status(500).json({ success: false, message: err.message });
      db.get('SELECT * FROM reviews WHERE id = ?', [this.lastID], (err, row) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.status(201).json({ success: true, data: row });
      });
    }
  );
});

// PUT update review
router.put('/:id', (req, res) => {
  const { reviewer_name, rating, review_text } = req.body;
  db.get('SELECT * FROM reviews WHERE id = ?', [req.params.id], (err, existing) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!existing) return res.status(404).json({ success: false, message: 'Review not found.' });

    db.run(
      'UPDATE reviews SET reviewer_name = ?, rating = ?, review_text = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [reviewer_name || existing.reviewer_name, rating || existing.rating, review_text || existing.review_text, req.params.id],
      (err) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        db.get('SELECT * FROM reviews WHERE id = ?', [req.params.id], (err, row) => {
          res.json({ success: true, data: row });
        });
      }
    );
  });
});

// DELETE review
router.delete('/:id', (req, res) => {
  db.get('SELECT * FROM reviews WHERE id = ?', [req.params.id], (err, existing) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!existing) return res.status(404).json({ success: false, message: 'Review not found.' });

    db.run('DELETE FROM reviews WHERE id = ?', [req.params.id], (err) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      res.json({ success: true, message: 'Review deleted successfully.' });
    });
  });
});

module.exports = router;