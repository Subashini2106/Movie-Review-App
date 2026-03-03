import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [query, setQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
    }
  };

  const linkClass = (path) =>
    `text-sm font-medium transition-colors duration-200 pb-0.5 border-b-2 ${
      location.pathname === path
        ? 'text-ink border-accent'
        : 'text-ink-light border-transparent hover:text-ink hover:border-ink'
    }`;

  return (
    <header
      className={`sticky top-0 z-50 bg-cream/85 backdrop-blur-md transition-all duration-200 ${
        scrolled ? 'border-b border-border shadow-sm' : 'border-b border-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center gap-8">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-ink flex-shrink-0">
          <span>🎬</span>
          <span>MovieLog</span>
        </Link>
        <nav className="hidden sm:flex gap-6 flex-shrink-0">
          <Link to="/" className={linkClass('/')}>Home</Link>
          <Link to="/top-rated" className={linkClass('/top-rated')}>Top Rated</Link>
          <Link to="/my-reviews" className={linkClass('/my-reviews')}>Reviews</Link>
        </nav>
        <form
          onSubmit={handleSearch}
          className="ml-auto flex items-center bg-white border-[1.5px] border-border rounded-full overflow-hidden focus-within:border-ink focus-within:shadow-[0_0_0_3px_rgba(26,26,26,0.06)] transition-all duration-200"
        >
          <input
            type="text"
            placeholder="Search movies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-transparent outline-none px-4 py-2 text-sm text-ink w-40 sm:w-56 font-body placeholder-ink-muted"
          />
          <button type="submit" aria-label="Search" className="px-3 py-2 text-ink-muted hover:text-ink transition-colors duration-200 flex items-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>
        </form>
      </div>
    </header>
  );
}