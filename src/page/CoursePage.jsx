import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  User,
  Clock,
  Star,
  BookOpen,
  FileText,
  Paperclip,
  ArrowLeft,
  Download,
  CheckCircle,
  Play,
} from "lucide-react";
import Header from "../components/header";

// ✅ Use environment variable instead of localhost
const API_URL = import.meta.env.VITE_BACKEND_URL + "/api";

export default function CoursePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCourse();
  }, [id]);

  const loadCourse = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // ✅ use deployed API URL
      const res = await fetch(`${API_URL}/course/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) {
        if (res.status === 404) throw new Error("Course not found");
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      setCourse(data);
    } catch (err) {
      console.error("LoadCourse Error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePdfDownload = (url) => {
    if (url) window.open(url, "_blank");
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
            <div
              className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-green-900 animate-spin"
              style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
            ></div>
          </div>
          <p className="mt-6 text-lg font-medium text-gray-700 animate-pulse">
            Loading your course...
          </p>
        </div>
      </div>
    );

  if (error || !course)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50 px-4">
        <div className="text-center max-w-md">
          <div className="mb-6 inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full">
            <span className="text-4xl">⚠️</span>
          </div>
          <h1 className="text-3xl font-bold mb-4 text-gray-900">
            {error === "Course not found"
              ? "Course Not Found"
              : "Oops! Something Went Wrong"}
          </h1>
          <p className="mb-8 text-gray-600">{error}</p>
          <button
            onClick={() => navigate("/course")}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Courses
          </button>
        </div>
      </div>
    );

  const materialCount = course.materials?.length || 0;
  const assignmentCount = course.assignment ? 1 : 0;
  const totalItems = materialCount + assignmentCount;

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate("/course")}
          className="group flex items-center text-gray-600 hover:text-blue-600 mb-8 font-medium transition-all duration-200"
        >
          <div className="mr-2 p-1 rounded-lg group-hover:bg-blue-50 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </div>
          <span>Back to Courses</span>
        </button>

        <div className="bg-gray-200 rounded-3xl shadow-xl overflow-hidden mb-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
          <div className="relative">
            {course.imageUrl ? (
              <img
                src={course.imageUrl}
                alt={course.title}
                className="w-full h-72 md:h-96 object-cover"
              />
            ) : (
              <div className="w-full h-72 md:h-96 bg-gradient-to-br from-blue-900 via-teal-800 to-green-700 flex items-center justify-center">
                <BookOpen className="h-24 w-24 text-white opacity-50" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
            
            {course.level && (
              <div className="absolute top-6 right-6">
                <span className="inline-flex items-center px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-sm font-semibold text-gray-800 shadow-lg">
                  <Star className="h-4 w-4 text-yellow-500 mr-2" />
                  {course.level}
                </span>
              </div>
            )}
          </div>

          <div className="p-8 md:p-12 grid md:grid-cols-3 gap-10">
            <div className="md:col-span-2 space-y-8">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent leading-tight">
                  {course.title}
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {course.description}
                </p>
              </div>

              {course.instructor && (
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl border border-blue-100">
                  <div className="p-3 bg-white rounded-full shadow-sm">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Instructor</p>
                    <p className="text-lg font-semibold text-gray-900">{course.instructor}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {course.duration && (
                  <div className="group bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl text-center hover:shadow-lg transition-all duration-200 border border-blue-200">
                    <Clock className="h-7 w-7 text-blue-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                    <p className="text-xs text-gray-500 mb-1">Duration</p>
                    <p className="text-sm font-bold text-gray-900">{course.duration}</p>
                  </div>
                )}
                
                {course.category && (
                  <div className="group bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl text-center hover:shadow-lg transition-all duration-200 border border-purple-200">
                    <BookOpen className="h-7 w-7 text-green-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                    <p className="text-xs text-gray-500 mb-1">Category</p>
                    <p className="text-sm font-bold text-gray-900">{course.category}</p>
                  </div>
                )}
                
                <div className="group bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl text-center hover:shadow-lg transition-all duration-200 border border-green-200">
                  <div className="mb-3">
                    <p className="text-3xl font-bold text-green-600 group-hover:scale-110 transition-transform inline-block">
                      {course.price > 0 ? `$${course.price}` : "Free"}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500">
                    {course.price > 0 ? "Course Fee" : "No Cost"}
                  </p>
                </div>
                
                <div className="group bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl text-center hover:shadow-lg transition-all duration-200 border border-orange-200">
                  <FileText className="h-7 w-7 text-orange-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <p className="text-xs text-gray-500 mb-1">Materials</p>
                  <p className="text-sm font-bold text-gray-900">
                    {totalItems} {totalItems === 1 ? "Item" : "Items"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="md:col-span-1 px-4 sm:px-6 lg:px-8 mb-16 max-w-7xl mx-auto">
              <div className=" bg-gray-200 rounded-2xl shadow-xl overflow-hidden mb-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-center justify-start gap-3 mb-8">
                  <h3 className="text-xl m-3 font-bold text-gray-900">Course Content</h3>
                  <span className="px-5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                    {totalItems} items
                    </span>
                </div>
                
                <div className="space-y-3 m-2 mb-6 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                  {course.materials &&
                    course.materials.length > 0 &&
                    course.materials.map((material, index) => (
                      <button
                        key={index}
                        onClick={() => handlePdfDownload(material.pdfUrl)}
                        className="group w-full bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 p-4 rounded-xl border-2 border-gray-200 hover:border-blue-300 flex items-center justify-between text-left transition-all duration-200 hover:shadow-md"
                      >
                        <div className="flex items-center gap-3 overflow-hidden flex-1">
                          <div className="p-2 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors">
                            <FileText className="h-5 w-5 text-red-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate">
                              {material.topic || `Material ${index + 1}`}
                            </p>
                            <p className="text-xs text-gray-500">PDF Document</p>
                          </div>
                        </div>
                        <Download className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0 ml-2" />
                      </button>
                    ))}

                  {course.assignment && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border-2 border-green-200">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Paperclip className="h-5 w-5 text-green-600" />
                        </div>
                        <h4 className="font-bold text-gray-900">Assignment</h4>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed pl-11">
                        {course.assignment}
                      </p>
                    </div>
                  )}

                  {totalItems === 0 && (
                    <div className="text-center py-8">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-3">
                        <FileText className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-500">
                        No materials available yet
                      </p>
                    </div>
                  )}
                </div>

                <button className="group w-full bg-gradient-to-r from-blue-900 to-teal-800 hover:from-blue-700 hover:to-green-600 text-white py-4 rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2">
                  <Play className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  Enroll Now
                </button>
                
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Full lifetime access</span>
                </div>
              </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}