// src/components/ReviewAdminPanel.jsx (NEW FILE)

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Star,
  MessageSquare,
  Mail,
  User,
  Trash2,
  ArrowLeft,
} from "lucide-react";

// Backend URL
const API_URL = "http://localhost:5000/api";

const ReviewAdminPanel = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    // 1. Role check
    if (role !== "admin") {
      navigate("/"); // Redirect if not admin
      return;
    }
    // 2. Token check
    if (!token) {
      setError("No token found. Please log in.");
      return;
    }
    // 3. Fetch all reviews
    fetchAllReviews(token);
  }, [navigate]);

  // Function to fetch ALL reviews (admin endpoint)
  const fetchAllReviews = async (token) => {
    setIsLoading(true);
    setError(null);
    try {
      // This is your admin-only endpoint to get ALL reviews
      const res = await fetch(`${API_URL}/reviews/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          throw new Error(
            "Unauthorized: You do not have permission to view this page."
          );
        }
        throw new Error(`Failed to fetch reviews: ${res.status}`);
      }

      const data = await res.json();
      setReviews(data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a review
  const deleteReview = async (reviewId) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      const res = await fetch(`${API_URL}/reviews/${reviewId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!res.ok) throw new Error("Failed to delete review");

      // Reload ALL reviews
      fetchAllReviews(localStorage.getItem("token"));
      alert("Review deleted successfully!");
    } catch (error) {
      console.error("Delete review error:", error);
      alert("Error: " + error.message);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow mb-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <MessageSquare className="text-purple-600 h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">Review Management</h1>
              <p className="text-gray-500">Manage all student reviews</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/admin")} // Assumes this is your courses panel route
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Courses
          </button>
        </div>

        {/* Loading and Error States */}
        {isLoading && (
          <div className="text-center p-10">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading all reviews...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {/* Review List */}
        {!isLoading && !error && (
          <div className="bg-white rounded-lg shadow">
            <div className="flex-1 overflow-y-auto p-6">
              {reviews.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    No reviews have been submitted yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div
                      key={review._id}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="bg-blue-100 rounded-full p-2">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-gray-900">
                                {/* Using review.name as fixed before */}
                                {review.name || "Anonymous"}
                              </span>
                              {renderStars(review.rating)}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Mail className="h-4 w-4" />
                              {/* Using review.email as fixed before */}
                              <span>{review.email || "No email"}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(review.createdAt).toLocaleString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteReview(review._id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition-colors"
                          title="Delete review"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="ml-12">
                        <p className="text-gray-700 leading-relaxed">
                          {review.comment}
                        </p>
                        {/* You can add the course name here if you saved it */}
                        {/* <p className="text-xs text-blue-600 mt-2">Course: {review.courseId?.title || 'Unknown'}</p> */}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewAdminPanel;