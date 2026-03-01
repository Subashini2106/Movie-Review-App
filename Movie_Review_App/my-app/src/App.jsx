import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import SearchPage from './pages/Search';
import TopRated from './pages/TopRated';
import MyReviews from './pages/MyReviews';
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/top-rated" element={<TopRated />} />
        <Route path="/my-reviews" element={<MyReviews />} />
      </Routes>
      <footer className="border-t border-border py-7 text-center text-sm text-ink-muted font-body">
        © 2025 CineLog ·{' '}
        <a href="https://www.themoviedb.org" target="_blank" rel="noreferrer" className="text-accent font-medium hover:underline">
          Powered by TMDB
        </a>
      </footer>
    </BrowserRouter>
  );
}