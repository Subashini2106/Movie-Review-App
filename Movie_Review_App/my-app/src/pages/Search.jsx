import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchMovies } from '../utils/api';
import MovieCard from '../components/MovieCard';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    setError(null);
    searchMovies(query, page)
      .then((data) => { setResults(data.results || []); setTotalPages(Math.min(data.total_pages, 10)); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [query, page]);

  useEffect(() => { setPage(1); }, [query]);

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 pb-16">
      <div className="mb-9">
        <h1 className="font-display text-3xl font-bold text-ink">
          Results for <em className="text-accent italic">"{query}"</em>
        </h1>
        {!loading && results.length > 0 && (
          <p className="text-sm text-ink-muted mt-1.5">{results.length} movies found</p>
        )}
      </div>
      {loading && (
        <div className="flex justify-center py-16">
          <div className="w-9 h-9 border-[3px] border-border border-t-accent rounded-full animate-spin" />
        </div>
      )}
      {error && <p className="text-center text-accent py-12">⚠️ {error}</p>}
      {!loading && !error && results.length === 0 && (
        <div className="text-center py-20 text-ink-muted">
          <p className="text-lg font-semibold mb-1">No movies found for "{query}"</p>
          <p className="text-sm">Try a different search term.</p>
        </div>
      )}
      {!loading && results.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 mb-10">
            {results.map((m, i) => <MovieCard key={m.id} movie={m} index={i} />)}
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-5">
              <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="px-5 py-2.5 border-[1.5px] border-border text-ink-light text-sm font-semibold rounded-lg hover:border-ink hover:text-ink disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200">← Prev</button>
              <span className="text-sm text-ink-muted">Page {page} of {totalPages}</span>
              <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} className="px-5 py-2.5 border-[1.5px] border-border text-ink-light text-sm font-semibold rounded-lg hover:border-ink hover:text-ink disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200">Next →</button>
            </div>
          )}
        </>
      )}
    </main>
  );
}