import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { LogOut, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, BookOpen, Users, Award, TrendingUp } from 'lucide-react';
import Header from "../components/header";

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

    console.log("Fetching courses from backend:", import.meta.env.VITE_BACKEND_URL);

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/course`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Courses received:", data);

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
      <div className="flex justify-center items-center py-20">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <BookOpen className="text-blue-500" size={24} />
          </div>
        </div>
        <span className="ml-4 text-gray-700 text-lg font-medium">Loading amazing courses...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 px-4">
        <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-300 rounded-2xl p-8 max-w-lg mx-auto shadow-xl">
          <div className="bg-red-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-3xl">⚠️</span>
          </div>
          <h3 className="text-red-900 font-bold text-2xl mb-3">Unable to Load Courses</h3>
          <p className="text-red-700 mb-6">{error}</p>
          <button 
            onClick={loadCourses}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-300 rounded-2xl p-8 max-w-lg mx-auto shadow-xl">
          <div className="bg-gray-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="text-white" size={32} />
          </div>
          <h3 className="text-gray-900 font-bold text-2xl mb-3">No Courses Available</h3>
          <p className="text-gray-600 mb-6">
            We're adding new courses soon. Check back later!
          </p>
          <button 
            onClick={loadCourses}
            className="bg-gradient-to-r from-blue-900 to-teal-800 hover:from-blue-600 hover:to-teal-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return null;
}

function BeautifulFooter() {
  return (
    <div className="w-full">
      <div className="w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
          <div className="mb-10">
            <div className="mb-8">
              <h3 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-900 via-teal-800 to-green-700 bg-clip-text text-transparent">
                EduPlatform
              </h3>
              <p className="text-slate-400 text-sm mb-4">Empowering learners worldwide with quality education</p>
              
              <div className="flex items-center gap-2 text-sm mb-4">
                <span className="text-slate-400">Logged in</span>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <Link 
                  to="/login" 
                  className="text-blue-400 hover:text-blue-300 underline underline-offset-4 transition-colors ml-2"
                >
                  Log Out
                </Link>
              </div>
              <div className="border-b border-slate-700/50"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
              <div className="group">
                <h4 className="font-bold mb-5 text-slate-200 text-lg flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-teal-700 rounded-lg flex items-center justify-center">
                    <BookOpen size={16} />
                  </div>
                  Quick Links
                </h4>
                <ul className="space-y-3">
                  {['Course', 'Resources', 'Community', 'Support'].map((link) => (
                    <li key={link}>
                      <Link 
                        to={link === 'Course' ? '/course' : '#'} 
                        className="text-slate-400 hover:text-white text-sm transition-all duration-200 hover:translate-x-2 inline-flex items-center gap-2 group"
                      >
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="group">
                <h4 className="font-bold mb-5 text-slate-200 text-lg flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-teal-700 to-green-800 rounded-lg flex items-center justify-center">
                    <Award size={16} />
                  </div>
                  Legal
                </h4>
                <ul className="space-y-3">
                  {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Accessibility'].map((link) => (
                    <li key={link}>
                      <a 
                        href="#" 
                        className="text-slate-400 hover:text-white text-sm transition-all duration-200 hover:translate-x-2 inline-flex items-center gap-2 group"
                      >
                        <span className="w-1.5 h-1.5 bg-teal-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="group">
                <h4 className="font-bold mb-5 text-slate-200 text-lg flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-red-500 rounded-lg flex items-center justify-center">
                    <Mail size={16} />
                  </div>
                  Contact Us
                </h4>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-slate-400 text-sm hover:text-white transition-colors group">
                    <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                      <Mail size={14} className="text-blue-400 group-hover:text-white" />
                    </div>
                    <span>support@eduplatform.com</span>
                  </li>
                  <li className="flex items-center gap-3 text-slate-400 text-sm hover:text-white transition-colors group">
                    <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center group-hover:bg-green-500 transition-colors">
                      <Phone size={14} className="text-green-400 group-hover:text-white" />
                    </div>
                    <span>+94 763454546</span>
                  </li>
                  <li className="flex items-center gap-3 text-slate-400 text-sm hover:text-white transition-colors group">
                    <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center group-hover:bg-red-500 transition-colors">
                      <MapPin size={14} className="text-red-400 group-hover:text-white" />
                    </div>
                    <span>Colombo, Sri Lanka</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="flex justify-center gap-4 mb-8 py-6">
            {[
              { Icon: Facebook, color: 'hover:bg-blue-600', label: 'Facebook' },
              { Icon: Twitter, color: 'hover:bg-sky-500', label: 'Twitter' },
              { Icon: Linkedin, color: 'hover:bg-blue-700', label: 'LinkedIn' },
              { Icon: Instagram, color: 'hover:bg-pink-600', label: 'Instagram' }
            ].map(({ Icon, color, label }, idx) => (
              <a
                key={idx}
                href="#"
                aria-label={label}
                className={`w-12 h-12 bg-slate-700/50 backdrop-blur-sm rounded-xl flex items-center justify-center ${color} transition-all duration-300 hover:scale-120 hover:rotate-360 hover:shadow-lg`}
              >
                <Icon size={20} />
              </a>
            ))}
          </div>

          {/* Copyright */}
          <div className="pt-6 border-t border-slate-700/50 text-center">
            <p className="text-slate-400 text-sm">
              © 2025 <span className="text-blue-400 font-semibold">EduPlatform</span>. All rights reserved. 
              Designed by <span className="text-blue-400 font-semibold">Prasath Thilina</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="w-full min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">      
      <Header />
      <div className="w-full flex-1 flex flex-col items-center">
        <div className="w-full bg-gradient-to-r from-blue-900 via-teal-800 to-green-700 text-white py-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
          <div className="relative z-10 max-w-5xl mx-auto px-2">
            <h1 className="text-5xl md:text-5xl font-extrabold mb-4 animate-fade-in">
              Welcome to Our <span className="bg-white text-transparent bg-clip-text">Learning Platform</span>
            </h1>
            <p className="text-xl md:text-2xl mb-3 text-blue-100 max-w-2xl mx-auto">
              Discover amazing courses and enhance your skills with expert-led content
            </p>
            <Link 
              to="/course" 
              className="inline-flex items-center gap-3 bg-white text-blue-600 font-bold px-6 py-4 rounded-full hover:bg-blue-50 hover:scale-105 shadow-2xl hover:shadow-3xl transition-all duration-300 group"
            >
              <BookOpen className="group-hover:rotate-12 transition-transform" size={24} />
              Browse Courses
              <TrendingUp className="group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mt-10">
              {[
                { icon: Users, value: '10K+', label: 'Students' },
                { icon: BookOpen, value: '100+', label: 'Courses' },
                { icon: Award, value: '95%', label: 'Success Rate' }
              ].map(({ icon: Icon, value, label }) => (
                <div key={label} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
                  <Icon className="mx-auto mb-2" size={32} />
                  <div className="text-3xl font-bold">{value}</div>
                  <div className="text-blue-100 text-sm">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div> 
      </div>
      
      {/* Why Choose Us Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/60 backdrop-blur-xl backdrop-saturate-150 border border-white/50 rounded-3xl shadow-2xl p-12 cursor-pointer">
            <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 text-5xl font-extrabold mb-6 text-center">
              Why Choose Us?
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto text-center leading-relaxed">
              We provide top-notch courses designed by industry experts to help you
              achieve your learning goals. Our platform offers a seamless learning
              experience with interactive content and real-world projects.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto px-6 pb-24">
        {[
          {
            icon: "🎓",
            title: "Expert Instructors",
            desc: "Learn from industry professionals with years of experience in their respective fields.",
            gradient: "from-blue-500 to-cyan-500"
          },
          {
            icon: "📚",
            title: "Comprehensive Courses",
            desc: "Access a wide range of courses covering various topics and skill levels.",
            gradient: "from-teal-500 to-green-500"
          },
          {
            icon: "💼",
            title: "Career Support",
            desc: "Get guidance and resources to help you advance your career after completing your courses.",
            gradient: "from-orange-500 to-red-500"
          },
        ].map(({ icon, title, desc, gradient }) => (
          <div
            key={title}
            className="group bg-white/70 backdrop-blur-md border-2 border-white/50 rounded-3xl p-10 text-center shadow-xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 cursor-pointer relative overflow-hidden"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
            <div className="relative z-10">
              <div className="text-7xl mb-6 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 inline-block">
                {icon}
              </div>
              <h3 className={`text-3xl font-extrabold mb-4 bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
                {title}
              </h3>
              <p className="text-gray-700 text-base leading-relaxed">
                {desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      <BeautifulFooter />
    </div>
  );
}