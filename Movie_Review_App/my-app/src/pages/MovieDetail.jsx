import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  getMovieDetails, getReviews, createReview, updateReview, deleteReview,
  posterUrl, backdropUrl, formatYear, ratingColor
} from '../utils/api';
import ReviewCard from '../components/ReviewCard';
import ReviewForm from '../components/ReviewForm';
import { useToast } from '../hooks/useToast';

export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loadingMovie, setLoadingMovie] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editReview, setEditReview] = useState(null);
  const [error, setError] = useState(null);
  const { toast, showToast } = useToast();

  const fetchReviews = useCallback(() => {
    return getReviews(id)
      .then((data) => setReviews(Array.isArray(data) ? data : []))
      .catch(() => setReviews([]));
}, [id]);

  useEffect(() => {
    setLoadingMovie(true);
    getMovieDetails(id)
      .then(setMovie)
      .catch((e) => setError(e.message))
      .finally(() => setLoadingMovie(false));
  }, [id]);

  useEffect(() => {
    setLoadingReviews(true);
    fetchReviews().finally(() => setLoadingReviews(false));
    const interval = setInterval(fetchReviews, 15000);
    return () => clearInterval(interval);
  }, [fetchReviews]);

  const handleCreate = async (formData) => {
    setFormLoading(true);
    try {
      await createReview({ ...formData, movie_id: id, movie_title: movie.title });
      await fetchReviews();
      setShowForm(false);
      showToast('Review posted!', 'success');
    } catch (e) { showToast(e.message, 'error'); }
    finally { setFormLoading(false); }
  };

  const handleUpdate = async (formData) => {
    setFormLoading(true);
    try {
      await updateReview(editReview.id, formData);
      await fetchReviews();
      setEditReview(null);
      showToast('Review updated!', 'success');
    } catch (e) { showToast(e.message, 'error'); }
    finally { setFormLoading(false); }
  };

  const handleDelete = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      await fetchReviews();
      showToast('Review deleted.', 'success');
    } catch (e) { showToast(e.message, 'error'); }
  };

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  if (loadingMovie) return (
    <div className="flex justify-center py-24">
      <div className="w-9 h-9 border-[3px] border-border border-t-accent rounded-full animate-spin" />
    </div>
  );
  if (error) return <p className="text-center text-accent py-16 text-lg">⚠️ {error}</p>;
  if (!movie) return null;

  const backdrop = backdropUrl(movie.backdrop_path);
  const cast = movie.credits?.cast?.slice(0, 6) || [];
  const director = movie.credits?.crew?.find((c) => c.job === 'Director');
  const trailer = movie.videos?.results?.find((v) => v.type === 'Trailer' && v.site === 'YouTube');

  return (
    <div className="min-h-screen">
      {backdrop && (
        <div className="relative h-80 bg-cover bg-top" style={{ backgroundImage: `url(${backdrop})` }}>
          <div className="absolute inset-0 bg-gradient-to-b from-cream/20 to-cream" />
        </div>
      )}
      <div className="max-w-5xl mx-auto px-6 pb-20" style={{ marginTop: backdrop ? '-160px' : '40px' }}>
        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-10 items-start relative z-10 mb-12">
          <div className="rounded-xl overflow-hidden shadow-lg border border-border max-w-[220px] md:max-w-none">
            <img
              src={posterUrl(movie.poster_path)}
              alt={movie.title}
              className="w-full block"
              onError={(e) => { e.target.src = 'https://placehold.co/300x450/E8E4DD/999999?text=No+Image'; }}
            />
          </div>
          <div className="animate-fade-in-up">
            <div className="flex flex-wrap gap-2 mb-3">
              {movie.genres?.map((g) => (
                <span key={g.id} className="px-3 py-1 bg-accent-light text-accent text-xs font-semibold rounded-full">
                  {g.name}
                </span>
              ))}
            </div>
            <h1 className="font-display text-3xl sm:text-5xl font-bold leading-tight text-ink mb-2">{movie.title}</h1>
            {movie.tagline && <p className="font-display italic text-ink-muted text-base mb-4">"{movie.tagline}"</p>}
            <div className="flex flex-wrap items-center gap-2 text-sm text-ink-light mb-3">
              <span>{formatYear(movie.release_date)}</span>
              {movie.runtime > 0 && <><span className="text-ink-muted">·</span><span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span></>}
              {movie.vote_average > 0 && <><span className="text-ink-muted">·</span><span className="font-bold" style={{ color: ratingColor(movie.vote_average) }}>★ {movie.vote_average.toFixed(1)} TMDB</span></>}
              {avgRating && <><span className="text-ink-muted">·</span><span className="font-bold" style={{ color: ratingColor(parseFloat(avgRating)) }}>♥ {avgRating} Users</span></>}
            </div>
            {director && <p className="text-sm text-ink-light mb-4">Directed by <strong className="text-ink">{director.name}</strong></p>}
            <p className="text-base leading-relaxed text-ink-light mb-7 max-w-xl">{movie.overview}</p>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => { setShowForm(true); setEditReview(null); }} className="px-6 py-3 bg-accent text-white rounded-lg text-[15px] font-semibold hover:opacity-85 transition-opacity">
                + Write a Review
              </button>
              {trailer && (
                <a href={`https://youtube.com/watch?v=${trailer.key}`} target="_blank" rel="noreferrer" className="px-6 py-3 border-[1.5px] border-ink text-ink rounded-lg text-[15px] font-semibold hover:bg-ink hover:text-white transition-all duration-200">
                  ▶ Watch Trailer
                </a>
              )}
            </div>
          </div>
        </div>

        {cast.length > 0 && (
          <section className="mb-12">
            <h2 className="font-display text-2xl font-bold text-ink mb-5">Cast</h2>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {cast.map((actor) => (
                <div key={actor.cast_id} className="flex-shrink-0 w-24 text-center">
                  <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-2 bg-border flex items-center justify-center text-3xl font-bold text-ink-light">
                    {actor.profile_path
                      ? <img src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`} alt={actor.name} className="w-full h-full object-cover" />
                      : <span>{actor.name.charAt(0)}</span>}
                  </div>
                  <p className="text-xs font-semibold text-ink leading-tight">{actor.name}</p>
                  <p className="text-[11px] text-ink-muted mt-0.5 leading-tight">{actor.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-bold text-ink">
              Reviews <span className="text-lg text-ink-muted font-body font-normal">({reviews.length})</span>
            </h2>
            <button onClick={() => { setShowForm(!showForm); setEditReview(null); }} className="px-4 py-2 border-[1.5px] border-border text-ink-light text-sm font-semibold rounded-lg hover:border-ink hover:text-ink transition-all duration-200">
              {showForm ? '✕ Cancel' : '+ Write Review'}
            </button>
          </div>
          {showForm && !editReview && (
            <div className="mb-6">
              <ReviewForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} loading={formLoading} />
            </div>
          )}
          {editReview && (
            <div className="mb-6">
              <ReviewForm editReview={editReview} onSubmit={handleUpdate} onCancel={() => setEditReview(null)} loading={formLoading} />
            </div>
          )}
          {loadingReviews ? (
            <div className="flex justify-center py-10">
              <div className="w-8 h-8 border-[3px] border-border border-t-accent rounded-full animate-spin" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-14 border-2 border-dashed border-border rounded-xl text-ink-muted">
              <p className="text-lg font-semibold mb-1">No reviews yet.</p>
              <p className="text-sm">Be the first to share your thoughts!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {reviews.map((r) => (
                <ReviewCard key={r.id} review={r} onEdit={(rev) => { setEditReview(rev); setShowForm(false); }} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </section>
      </div>

      {toast && (
        <div className={`fixed bottom-7 right-7 px-5 py-3.5 rounded-lg text-white text-sm font-medium shadow-lg animate-fade-in-up z-50 ${toast.type === 'success' ? 'bg-green-700' : 'bg-accent'}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}