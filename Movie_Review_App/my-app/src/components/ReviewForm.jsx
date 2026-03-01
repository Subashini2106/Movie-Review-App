import React, { useState, useEffect } from 'react';

export default function ReviewForm({ onSubmit, onCancel, editReview = null, loading }) {
  const [form, setForm] = useState({ reviewer_name: '', rating: 7, review_text: '' });

  useEffect(() => {
    if (editReview) {
      setForm({
        reviewer_name: editReview.reviewer_name,
        rating: editReview.rating,
        review_text: editReview.review_text,
      });
    }
  }, [editReview]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, rating: parseInt(form.rating, 10) });
  };

  const ratingPercent = ((form.rating - 1) / 9) * 100;

  return (
    <div className="bg-white border border-border rounded-xl p-7 animate-fade-in-up">
      <h3 className="font-display text-xl font-bold text-ink mb-5">
        {editReview ? 'Edit Review' : 'Write a Review'}
      </h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-ink-light uppercase tracking-wide">Your Name</label>
            <input
              name="reviewer_name"
              type="text"
              placeholder="e.g. John Doe"
              value={form.reviewer_name}
              onChange={handleChange}
              required
              minLength={2}
              maxLength={50}
              className="border-[1.5px] border-border rounded-lg px-4 py-3 text-[15px] text-ink bg-cream outline-none focus:border-ink focus:bg-white transition-all duration-200 font-body placeholder-ink-muted"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-ink-light uppercase tracking-wide">
              Rating: <span className="text-ink font-bold text-sm">{form.rating}/10</span>
            </label>
            <div className="flex items-center gap-3 pt-1">
              <span className="text-xs text-ink-muted font-semibold">1</span>
              <input
                name="rating"
                type="range"
                min="1" max="10" step="1"
                value={form.rating}
                onChange={handleChange}
                style={{
                  background: `linear-gradient(to right, #C8102E 0%, #C8102E ${ratingPercent}%, #E8E4DD ${ratingPercent}%, #E8E4DD 100%)`
                }}
                className="flex-1 h-1.5 rounded-full outline-none cursor-pointer appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-ink [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md"
              />
              <span className="text-xs text-ink-muted font-semibold">10</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1.5 relative">
          <label className="text-xs font-semibold text-ink-light uppercase tracking-wide">Your Review</label>
          <textarea
            name="review_text"
            placeholder="What did you think of this movie?"
            value={form.review_text}
            onChange={handleChange}
            required
            minLength={10}
            maxLength={1000}
            rows={4}
            className="border-[1.5px] border-border rounded-lg px-4 py-3 text-[15px] text-ink bg-cream outline-none focus:border-ink focus:bg-white transition-all duration-200 font-body resize-none placeholder-ink-muted pb-7"
          />
          <span className="absolute bottom-3 right-3 text-xs text-ink-muted pointer-events-none">
            {form.review_text.length}/1000
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button type="submit" disabled={loading} className="px-7 py-3 bg-ink text-white rounded-lg text-[15px] font-semibold hover:opacity-85 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity duration-200">
            {loading ? 'Saving...' : editReview ? 'Update Review' : 'Post Review'}
          </button>
          {onCancel && (
            <button type="button" onClick={onCancel} className="px-5 py-3 bg-transparent text-ink-light border-[1.5px] border-border rounded-lg text-[15px] font-medium hover:border-ink hover:text-ink transition-all duration-200">
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}