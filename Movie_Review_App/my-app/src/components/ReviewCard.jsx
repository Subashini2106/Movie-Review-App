import React, { useState } from 'react';
import { formatDate, ratingColor } from '../utils/api';

export default function ReviewCard({ review, onEdit, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="bg-white border border-border rounded-xl px-6 py-5 hover:shadow-md transition-shadow duration-200 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-ink text-white flex items-center justify-center font-bold text-base flex-shrink-0">
          {review.reviewer_name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[15px] text-ink">{review.reviewer_name}</p>
          <p className="text-xs text-ink-muted mt-0.5">{formatDate(review.created_at)}</p>
        </div>
        <div className="flex items-baseline gap-0.5 flex-shrink-0" style={{ color: ratingColor(review.rating) }}>
          <span className="text-lg">★</span>
          <span className="font-bold text-xl font-display">{review.rating}</span>
          <span className="text-xs text-ink-muted font-normal font-body">/10</span>
        </div>
      </div>
      <p className="text-[15px] leading-relaxed text-ink-light mb-4">{review.review_text}</p>
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => onEdit(review)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border-[1.5px] border-border text-ink-light text-sm font-medium hover:border-ink hover:text-ink transition-all duration-200"
        >
          Edit
        </button>
        {!confirmDelete ? (
          <button
            onClick={() => setConfirmDelete(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border-[1.5px] border-border text-accent text-sm font-medium hover:border-accent hover:bg-accent-light transition-all duration-200"
          >
            Delete
          </button>
        ) : (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-ink-light font-medium">Are you sure?</span>
            <button onClick={() => onDelete(review.id)} className="px-3 py-1.5 bg-accent text-white rounded-lg text-sm font-semibold hover:opacity-85 transition-opacity">Yes</button>
            <button onClick={() => setConfirmDelete(false)} className="px-3 py-1.5 bg-border text-ink rounded-lg text-sm font-semibold transition-colors">No</button>
          </div>
        )}
      </div>
    </div>
  );
}