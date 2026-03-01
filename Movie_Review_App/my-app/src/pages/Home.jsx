import React, { useEffect, useState } from 'react';
import { getTrending, getPopular } from '../utils/api';
import MovieCard from '../components/MovieCard';

const TABS = ['Trending', 'Popular'];

export default function Home() {
  const [tab, setTab] = useState('Trending');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const fetcher = tab === 'Trending' ? getTrending : getPopular;
    fetcher()
      .then(setMovies)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [tab]);

  return (
    <main className="max-w-6xl mx-auto px-6 pb-16">
      <section className="flex items-center justify-between py-14 border-b border-border mb-12">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">Discover & Review</p>
          <h1 className="font-display text-5xl sm:text-6xl font-bold leading-[1.05] text-ink mb-4">
            My personal<br />
            <em className="text-accent italic">Cinema journal</em>
          </h1>
          <p className="text-lg text-ink-light max-w-md">
            Search any film, read what others think, and share your own take.
          </p>
        </div>
        <div className="hidden md:flex gap-4 text-6xl flex-shrink-0 ml-8">
          <span>🎭</span><span>🍿</span><span>🎞️</span>
        </div>
      </section>
      <section>
        <div className="flex items-center justify-between mb-7 flex-wrap gap-4">
          <h2 className="font-display text-2xl font-bold text-ink">Browse Movies</h2>
          <div className="flex gap-1">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-5 py-2 rounded-full text-sm font-medium border-[1.5px] transition-all duration-200 ${
                  tab === t
                    ? 'bg-ink text-white border-ink'
                    : 'bg-transparent text-ink-light border-border hover:bg-ink hover:text-white hover:border-ink'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        {loading && (
          <div className="flex justify-center py-16">
            <div className="w-9 h-9 border-[3px] border-border border-t-accent rounded-full animate-spin" />
          </div>
        )}
        {error && <p className="text-center text-accent py-12">⚠️ {error}</p>}
        {!loading && !error && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {movies.map((m, i) => <MovieCard key={m.id} movie={m} index={i} />)}
          </div>
        )}
      </section>
    </main>
  );
}