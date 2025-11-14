import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/header";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // Correct backend URL
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const axiosInstance = axios.create({
    baseURL: `${BACKEND_URL}/api/reviews`,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  // Fetch reviews
  const fetchReviews = async () => {
    if (!token) {
      setError("Please log in to view reviews");
      return;
    }

    try {
      setLoading(true);
      const res = await axiosInstance.get("/");
      setReviews(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("You must be logged in to submit a review");
      return;
    }

    try {
      if (editId) {
        await axiosInstance.put(`/${editId}`, { rating, comment });
      } else {
        await axiosInstance.post("/", { rating, comment });
      }

      setRating(0);
      setComment("");
      setEditId(null);
      fetchReviews();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Error submitting review");
    }
  };

  const handleEdit = (review) => {
    setEditId(review._id);
    setRating(review.rating);
    setComment(review.comment);
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/${id}`);
      fetchReviews();
    } catch (err) {
      console.error(err);
      setError("Failed to delete review");
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-gradient-to-br from-blue-900 via-teal-800 to-green-700">
      <Header />

      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-900 via-teal-800 to-green-700 p-6 gap-8">
        <div className="max-w-5xl mx-auto px-2">
          <h1 className="text-5xl text-white font-extrabold mb-4 text-center">
            You Can Share Your Reviews Here ✍️
          </h1>
        </div>

        <div className="bg-white/20 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 p-10 max-w-3xl w-full">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">
            Student Reviews
          </h1>

          {!token && (
            <div className="bg-red-500/80 text-white p-4 rounded-xl mb-4 text-center">
              Please log in to use this feature
            </div>
          )}

          {/* Review Form */}
          <form onSubmit={handleSubmit} className="mb-8 space-y-4">
            <input
              type="number"
              placeholder="Rating (1-5)"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full p-3 rounded-xl bg-white/30 text-white placeholder-white/70 outline-none"
              min="1"
              max="5"
              required
            />
            <textarea
              placeholder="Write your review..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-3 rounded-xl bg-white/30 text-white placeholder-white/70 outline-none"
              required
            ></textarea>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition"
              disabled={loading || !token}
            >
              {editId ? "Update Review" : "Submit Review"}
            </button>
          </form>

          {error && <p className="text-red-300 text-center mb-4">{error}</p>}
        </div>
      </div>
    </div>
  );
}
