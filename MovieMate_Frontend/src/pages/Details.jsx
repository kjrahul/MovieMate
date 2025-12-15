import { useEffect, useState } from "react";

import { useParams, Link, useNavigate } from "react-router-dom";

import { getContentById, updateContent, deleteContent } from "../api/contentApi";
import { addReview, getReviews, deleteReview, updateReview } from "../api/reviewApi";

import { getTimeEstimate } from "../api/aiApi";

export default function Details() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [timeEstimate, setTimeEstimate] = useState(null);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = () => {
    fetchContent();
    fetchReviews();
    fetchTimeEstimate();
  };

  const fetchContent = () => {
    getContentById(id)
      .then((res) => setContent(res.data))
      .catch((err) => console.error(err));
  };

  const fetchReviews = () => {
    getReviews(id)
      .then((res) => setReviews(res.data))
      .catch((err) => console.error(err));
  };

  const fetchTimeEstimate = () => {
    getTimeEstimate(id)
      .then((res) => setTimeEstimate(res.data))
      .catch(() => setTimeEstimate(null));
  };

  const handleProgressUpdate = () => {
    updateContent(id, {
      episodes_watched: content.episodes_watched + 1,
    })
      .then((res) => {
        setContent(res.data);
        fetchTimeEstimate();
      })
      .catch((err) => console.error(err));
  };

  const handleAddReview = () => {
    if (!reviewText.trim()) return;

    addReview(id, {
      rating,
      review_text: reviewText,
    })
      .then(() => {
        setReviewText("");
        fetchReviews();
      })
      .catch((err) => console.error(err));
  };

  if (!content) {
    return (
      <div className="min-h-screen bg-[#0a0000] flex items-center justify-center text-red-400 font-bold">
        Loading details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0000] text-white px-[5%] pb-20 pt-32">

      {/* Back */}
      <Link
        to="/"
        className="inline-block mb-8 text-sm font-bold text-red-400 hover:text-red-500 transition"
      >
        ← Back to Watchlist
      </Link>

      {/* MAIN CARD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* Poster */}
        <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl aspect-[2/3]">
          <img
            src={content.poster_url}
            alt={content.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://placehold.co/300x450/1a1a1a/e50914?text=No+Image";
            }}
          />
        </div>

        {/* Details */}
        <div className="lg:col-span-2 space-y-8">

          {/* Title */}
          <div>
            <span className="inline-block mb-3 px-4 py-1 rounded-full bg-red-600/10 border border-red-600/40 text-red-400 text-xs font-bold uppercase">
              {content.status}
            </span>

            <h1 className="text-5xl font-black leading-tight">
              {content.title}
            </h1>

            <p className="mt-4 text-red-100/70 text-lg">
              {content.overview}
            </p>
          </div>
            
            {/* Content Actions */}
<div className="flex flex-wrap gap-4 mt-6">
  {/* Status Change */}
  <select
    value={content.status}
    onChange={(e) =>
      updateContent(id, { status: e.target.value })
        .then((res) => setContent(res.data))
        .catch(console.error)
    }
    className="bg-black/60 border border-white/20 rounded-lg px-4 py-2 text-sm"
  >
    <option value="watching">Watching</option>
    <option value="completed">Completed</option>
    <option value="wishlist">Wishlist</option>
  </select>

  {/* Delete Content */}
  <button
    onClick={() => {
      if (!window.confirm("Delete this content permanently?")) return;
      deleteContent(id)
  .then(() => {
    // Navigate only after the delete API call is confirmed successful
    navigate("/");
  })
  .catch(console.error);
    }}
    className="px-4 py-2 bg-red-800 hover:bg-red-900 text-xs font-bold uppercase rounded-lg"
  >
    Delete Content
  </button>
</div>


          {/* Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm">
            <Info label="Type" value={content.content_type} />
            <Info label="Genre" value={content.genre} />
            <Info label="Platform" value={content.platform} />
            {content.director && <Info label="Director" value={content.director} />}
          </div>

          {/* TV Progress */}
          {content.content_type === "tv" && (
            <div className="bg-[#120505] border border-white/10 rounded-xl p-6 space-y-4">
              <p className="text-sm font-bold">
                Progress:{" "}
                <span className="text-red-400">
                  {content.episodes_watched}/{content.total_episodes}
                </span>
              </p>

              {content.episodes_watched < content.total_episodes && (
                <button
                  onClick={handleProgressUpdate}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-xs font-extrabold uppercase tracking-widest transition"
                >
                  + Watched Episode
                </button>
              )}
            </div>
          )}

          {/* Time Estimate */}
          <div className="bg-[#120505] border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-2">Time Estimate</h3>

            {timeEstimate?.estimated_minutes_remaining ? (
              <p className="text-red-300 font-medium">
                Remaining Time:{" "}
                <span className="font-black text-white">
                  {timeEstimate.estimated_minutes_remaining} minutes
                </span>
              </p>
            ) : (
              <p className="text-gray-400 text-sm">
                Not enough data to estimate.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* REVIEWS */}
      <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* Add Review */}
        <div className="bg-[#120505] border border-white/10 rounded-xl p-8">
          <h3 className="text-xl font-bold mb-6">Add Review</h3>

          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full mb-4 bg-black/60 border border-white/20 rounded-lg px-4 py-2 text-sm"
          >
            {[1, 2, 3, 4, 5].map((r) => (
              <option key={r} value={r}>
                {r} / 5
              </option>
            ))}
          </select>

          <textarea
            placeholder="Write your review..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="w-full min-h-[120px] bg-black/60 border border-white/20 rounded-lg p-4 text-sm mb-4"
          />

          <button
            onClick={handleAddReview}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-xs font-extrabold uppercase tracking-widest rounded-lg transition"
          >
            Submit Review
          </button>
        </div>

        {/* Reviews List */}
        <div>
          <h3 className="text-xl font-bold mb-6">Reviews</h3>

          {reviews.length === 0 && (
            <p className="text-gray-400 text-sm">No reviews yet.</p>
          )}

          <div className="space-y-4">
            {reviews.map((r) => (
  <div
    key={r.id}
    className="bg-[#120505] border border-white/10 rounded-xl p-5 space-y-3"
  >
    <div className="flex justify-between items-center">
      <p className="text-sm font-bold text-red-400">
        Rating: {r.rating}/5
      </p>

      <div className="flex gap-4">
        {/* Edit Rating */}
        <button
          onClick={() => {
            const newRating = prompt("Enter new rating (1–5):", r.rating);
            if (!newRating) return;

            updateReview(r.id, { rating: Number(newRating) })
              .then(fetchReviews)
              .catch(console.error);
          }}
          className="text-xs text-yellow-400 hover:text-yellow-300"
        >
          Edit
        </button>

        {/* Delete Rating */}
        <button
          onClick={() => {
            if (!window.confirm("Delete this review?")) return;

            deleteReview(r.id)
              .then(fetchReviews)
              .catch(console.error);
          }}
          className="text-xs text-red-400 hover:text-red-300"
        >
          Delete
        </button>
      </div>
    </div>

    <p className="text-sm text-gray-300">{r.review_text}</p>
  </div>
))}

          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Helper ---------- */

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-400 uppercase font-bold mb-1">
        {label}
      </p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}
