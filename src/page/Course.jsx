import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/header";

function CourseCard({ course }) {
  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };


  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:scale-105 border border-gray-100">
      <div className="relative">
        <img 
          src={course.imageUrl || course.image || defaultImage} 
          alt={course.title || 'Course'}
          className="w-full h-48 object-cover"
          onError={(e) => { e.target.src = defaultImage; }}
        />
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 text-xs rounded-full font-medium ${getLevelColor(course.level)}`}>
            {course.level || 'Beginner'}
          </span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
          {course.title || 'Untitled Course'}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {course.description || 'No description available'}
        </p>
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
          {course.duration && (
            <div className="flex items-center gap-1">🕐 {course.duration}</div>
          )}
          {course.category && (
            <div className="flex items-center gap-1">📚 {course.category}</div>
          )}
          {course.instructor && (
            <div className="flex items-center gap-1">👨‍🏫 {course.instructor}</div>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-800">
            {course.price ? `$${course.price}` : 'Free'}
          </span>
          <Link 
            to={`/course/${course._id || course.id}`} 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

function CoursesSection() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('Fetching courses from MongoDB...');
      
      const response = await fetch("http://localhost:5000/api/course");
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Courses received:', data);
      
      // Handle different response formats
      const coursesArray = Array.isArray(data) ? data : data.courses || [];
      setCourses(coursesArray);
      
    } catch (err) {
      console.error("Error loading courses:", err);
      setError(`Failed to load courses: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading courses from database...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-red-800 font-semibold mb-2">Unable to Load Courses</h3>
          <p className="text-red-600 text-sm mb-4">{error}</p>
          <button 
            onClick={loadCourses}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full transition-colors duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-gray-800 font-semibold mb-2">No Courses Found</h3>
          <p className="text-gray-600 text-sm mb-4">
            No courses are currently available in the database.
          </p>
          <button 
            onClick={loadCourses}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition-colors duration-300"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-gray-600">
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course, index) => (
          <CourseCard key={course._id || course.id || index} course={course} />
        ))}
      </div>
    </div>
  );
}

export default function MainCoursePage() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-gray-50">
      <Header />
      <div className="w-full flex-1 flex flex-col items-center ">
        <div className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white py-20 text-center">
          <h1 className="text-5xl font-bold mb-6">Welcome to Our Learning Platform</h1>
          <p className="text-xl mb-8">Discover amazing courses and enhance your skills</p>
        </div>
        <div className="w-full max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-4 text-center">
            Available Courses
          </h2>
          <CoursesSection />
        </div>
      </div>
    </div>
  );
}