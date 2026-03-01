import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllReviews, posterUrl, formatDate, ratingColor } from '../utils/api';

export default function MyReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAllReviews()
      .then(setReviews)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // Group reviews by movie
  const groupedByMovie = reviews.reduce((acc, review) => {
    const key = review.movie_id;
    if (!acc[key]) {
      acc[key] = {
        movie_id: review.movie_id,
        movie_title: review.movie_title,
        reviews: [],
      };
    }
    acc[key].reviews.push(review);
    return acc;
  }, {});

  const movies = Object.values(groupedByMovie);

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 pb-16">
      {/* Header */}
      <div className="mb-10 pb-8 border-b border-border">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">
          Your Thoughts
        </p>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-ink mb-3">
          My <em className="text-accent italic">Reviews</em>
        </h1>
        <p className="text-ink-light text-lg">
          All the movies you have reviewed, grouped by film.
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-16">
          <div className="w-9 h-9 border-[3px] border-border border-t-accent rounded-full animate-spin" />
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-center text-accent py-12">⚠️ {error}</p>
      )}

      {/* Empty State */}
      {!loading && !error && movies.length === 0 && (
        <div className="text-center py-24 border-2 border-dashed border-border rounded-xl">
          <p className="text-5xl mb-4">🎬</p>
          <p className="text-xl font-semibold text-ink mb-2">No reviews yet!</p>
          <p className="text-ink-muted mb-6">Start by browsing movies and sharing your thoughts.</p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-accent text-white rounded-lg font-semibold hover:opacity-85 transition-opacity"
          >
            Browse Movies
          </Link>
        </div>
      )}

      {/* Reviews grouped by movie */}
      {!loading && !error && movies.length > 0 && (
        <div className="flex flex-col gap-8">
          {movies.map((group) => (
            <div key={group.movie_id} className="bg-white border border-border rounded-xl overflow-hidden">
              {/* Movie Header */}
              <div className="flex items-center gap-4 p-5 border-b border-border bg-cream">
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/movie/${group.movie_id}`}
                    className="font-display text-xl font-bold text-ink hover:text-accent transition-colors duration-200"
                  >
                    {group.movie_title}
                  </Link>
                  <p className="text-sm text-ink-muted mt-0.5">
                    {group.reviews.length} {group.reviews.length === 1 ? 'review' : 'reviews'}
                  </p>
                </div>
                <Link
                  to={`/movie/${group.movie_id}`}
                  className="flex-shrink-0 px-4 py-2 border-[1.5px] border-border text-ink-light text-sm font-medium rounded-lg hover:border-ink hover:text-ink transition-all duration-200"
                >
                  View Movie →
                </Link>
              </div>

              {/* Reviews for this movie */}
              <div className="divide-y divide-border">
                {group.reviews.map((review) => (
                  <div key={review.id} className="p-5 flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-ink text-white flex items-center justify-center font-bold text-base flex-shrink-0">
                      {review.reviewer_name.charAt(0).toUpperCase()}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <span className="font-semibold text-[15px] text-ink">
                          {review.reviewer_name}
                        </span>
                        <div
                          className="flex items-baseline gap-0.5 flex-shrink-0"
                          style={{ color: ratingColor(review.rating) }}
                        >
                          <span className="text-base">★</span>
                          <span className="font-bold text-lg font-display">{review.rating}</span>
                          <span className="text-xs text-ink-muted font-normal">/10</span>
                        </div>
                      </div>
                      <p className="text-[15px] leading-relaxed text-ink-light mb-2">
                        {review.review_text}
                      </p>
                      <p className="text-xs text-ink-muted">{formatDate(review.created_at)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary footer */}
      {!loading && !error && movies.length > 0 && (
        <div className="mt-10 p-5 bg-white border border-border rounded-xl flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="font-semibold text-ink">
              {reviews.length} total {reviews.length === 1 ? 'review' : 'reviews'}
            </p>
            <p className="text-sm text-ink-muted">across {movies.length} {movies.length === 1 ? 'movie' : 'movies'}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-ink">
              Avg Rating:{' '}
              <span style={{ color: ratingColor(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) }}>
                {(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)}/10
              </span>
            </p>
            <p className="text-sm text-ink-muted">across all reviews</p>
          </div>
        </div>
      )}
    </main>
  );
}