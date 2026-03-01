import React, { useEffect, useState } from 'react';
import { getTopRated } from '../utils/api';
import MovieCard from '../components/MovieCard';

export default function TopRated() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getTopRated()
      .then(setMovies)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 pb-16">
      <div className="mb-9">
        <h1 className="font-display text-3xl font-bold text-ink">
          Top <em className="text-accent italic">Rated</em> Movies
        </h1>
        <p className="text-sm text-ink-muted mt-1.5">The highest-rated films of all time</p>
      </div>

      {loading && (
        <div className="flex justify-center py-16">
          <div className="w-9 h-9 border-[3px] border-border border-t-accent rounded-full animate-spin" />
        </div>
      )}
      {error && <p className="text-center text-accent py-12">⚠️ {error}</p>}
      {!loading && !error && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {movies.map((m, i) => (
            <MovieCard key={m.id} movie={m} index={i} />
          ))}
        </div>
      )}
    </main>
  );
}