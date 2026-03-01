import React from 'react';
import { Link } from 'react-router-dom';
import { posterUrl, formatYear, ratingColor } from '../utils/api';

export default function MovieCard({ movie, index = 0 }) {
  const { id, title, poster_path, vote_average, release_date } = movie;

  return (
    <Link
      to={`/movie/${id}`}
      className="block bg-white rounded-xl overflow-hidden border border-border hover:-translate-y-1 hover:shadow-lg transition-all duration-250 animate-fade-in-up"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-border group">
        <img
          src={posterUrl(poster_path)}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
          onError={(e) => {
            e.target.src = `https://placehold.co/300x450/E8E4DD/999999?text=${encodeURIComponent(title)}`;
          }}
        />
        <div className="absolute inset-0 bg-ink/55 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-250">
          <span className="bg-white text-ink text-xs font-semibold tracking-wide px-4 py-2 rounded-full">
            View Details
          </span>
        </div>
      </div>
      <div className="px-4 pt-3 pb-4">
        <h3 className="font-display text-[15px] font-bold leading-snug text-ink line-clamp-2 mb-1.5">
          {title}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-xs text-ink-muted">{formatYear(release_date)}</span>
          {vote_average > 0 && (
            <span className="text-xs font-semibold" style={{ color: ratingColor(vote_average) }}>
              ★ {vote_average.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}