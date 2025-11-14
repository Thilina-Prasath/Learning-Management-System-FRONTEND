import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BookOpen, Award, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import Header from "../components/header";

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
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-teal-700 rounded-lg flex items-center justify-center">
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
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="group">
                <h4 className="font-bold mb-5 text-slate-200 text-lg flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-teal-700 rounded-lg flex items-center justify-center">
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
                        <span className="w-1.5 h-1.5 bg-green-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="group">
                <h4 className="font-bold mb-5 text-slate-200 text-lg flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-red-500 rounded-lg flex items-center justify-center">
                    <Mail size={16} />
                  </div>
                  Contact Us
                </h4>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-slate-400 text-sm hover:text-white transition-colors group">
                    <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                      <Mail size={14} className="text-blue-500 group-hover:text-white" />
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

export default function About() {
  return (
    <div className="w-full min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">      
      <Header />
      
      <div className="flex-1 flex flex-col items-center px-4 py-16">
        {/* Hero Section */}
        <motion.div
          className="text-center max-w-3xl"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
            About <span className="text-purple-600">EduPlatform</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            EduPlatform is a modern learning space designed to connect students, 
            mentors, and resources in one place. We make education accessible, 
            interactive, and inspiring through technology.
          </p>
        </motion.div>

        {/* Mission + Vision Cards */}
        <div className="mt-12 grid md:grid-cols-2 gap-8 max-w-5xl w-full">
          <motion.div
            className="bg-white shadow-lg rounded-2xl p-8 border border-gray-200 hover:shadow-2xl transition-all duration-300"
            whileHover={{ scale: 1.03 }}
          >
            <h2 className="text-2xl font-bold text-blue-600 mb-3">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              To empower students by providing them with the right mentors, 
              tools, and resources that help them grow academically and personally.  
              We believe learning is most effective when it's engaging, 
              personalized, and collaborative.
            </p>
          </motion.div>

          <motion.div
            className="bg-white shadow-lg rounded-2xl p-8 border border-gray-200 hover:shadow-2xl transition-all duration-300"
            whileHover={{ scale: 1.03 }}
          >
            <h2 className="text-2xl font-bold text-purple-600 mb-3">Our Vision</h2>
            <p className="text-gray-600 leading-relaxed">
              To build a global community where students and mentors collaborate, 
              innovate, and achieve excellence. Our vision is to make EduPlatform 
              a hub of lifelong learning and inspiration.
            </p>
          </motion.div>
        </div>

        {/* Team / Values Section */}
        <motion.div
          className="mt-16 max-w-4xl text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Core Values</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { title: "Innovation", desc: "We embrace new ideas and creative problem solving." },
              { title: "Collaboration", desc: "We believe learning is better together." },
              { title: "Excellence", desc: "We strive for quality in everything we do." },
              { title: "Integrity", desc: "We act with honesty and fairness." },
              { title: "Growth", desc: "We help students and mentors achieve their potential." },
              { title: "Inclusivity", desc: "We create a learning space for everyone." },
            ].map((value, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-br from-blue-600 to-teal-700 text-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
                whileHover={{ scale: 1.05 }}
              >
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-sm opacity-90">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer message */}
        <motion.div
          className="mt-16 mb-8 text-center text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-sm">Thank you for being part of our learning community!</p>
        </motion.div>
      </div>

      <BeautifulFooter />
    </div>
  );
}