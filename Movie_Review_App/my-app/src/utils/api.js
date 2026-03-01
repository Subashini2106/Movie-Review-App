const BASE = '/api';
export const IMG_BASE = 'https://image.tmdb.org/t/p';

// ─── Movies (TMDB Proxy) ──────────────────────────────────────────────────────
export const searchMovies = async (query, page = 1) => {
  const res = await fetch(`${BASE}/movies/search?query=${encodeURIComponent(query)}&page=${page}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
};

export const getMovieDetails = async (id) => {
  const res = await fetch(`${BASE}/movies/movie/${id}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
};

export const getTrending = async () => {
  const res = await fetch(`${BASE}/movies/trending`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data.results;
};

export const getPopular = async () => {
  const res = await fetch(`${BASE}/movies/popular`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data.results;
};

export const getTopRated = async () => {
  const res = await fetch(`${BASE}/movies/top-rated`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data.results;
};

// ─── Reviews (SQLite) ─────────────────────────────────────────────────────────
export const getReviews = async (movieId) => {
  const res = await fetch(`${BASE}/reviews/${movieId}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
};

export const getAllReviews = async () => {
  const res = await fetch(`${BASE}/reviews`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
};

export const createReview = async (reviewData) => {
  const res = await fetch(`${BASE}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reviewData),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
};

export const updateReview = async (id, reviewData) => {
  const res = await fetch(`${BASE}/reviews/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reviewData),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
};

export const deleteReview = async (id) => {
  const res = await fetch(`${BASE}/reviews/${id}`, { method: 'DELETE' });
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
export const posterUrl = (path, size = 'w500') =>
  path ? `${IMG_BASE}/${size}${path}` : '/placeholder-poster.png';

export const backdropUrl = (path, size = 'w1280') =>
  path ? `${IMG_BASE}/${size}${path}` : null;

export const formatDate = (dateStr) => {
  if (!dateStr) return 'Unknown';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
};

export const formatYear = (dateStr) => dateStr ? dateStr.slice(0, 4) : '—';

export const ratingColor = (rating) => {
  if (rating >= 8) return '#1a7a4a';
  if (rating >= 6) return '#D4A843';
  return '#C8102E';
};