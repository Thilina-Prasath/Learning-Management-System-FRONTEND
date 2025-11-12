import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/header';
import { IoIosLogOut } from "react-icons/io";

const API_URL = "http://localhost:5000/api";

// --- ProfileHeader Component (Simplified) ---
function ProfileHeader({ student, onEditToggle, isEditing }) {
  return (
    <div className="min-h-[300px] bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative overflow-hidden flex items-center">
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-48 h-48 bg-purple-400/20 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="relative z-10 py-8 w-full">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 animate-slide-in-up">
            <div className="flex justify-between items-center gap-8">
              
              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-5xl font-bold text-white mb-3 animate-fade-in">
                  {student.firstName} {student.lastName}
                  <span className="block text-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mt-2">
                    Learning Enthusiast
                  </span>
                </h1>
                
                <div className="flex justify-center md:justify-start items-center gap-4 mt-4">
                  <div className="flex items-center gap-3 text-white/80 bg-white/10 rounded-xl p-3 backdrop-blur-sm animate-slide-in-left">
                    <span className="text-xl">✉️</span>
                    <span className="text-sm font-semibold">{student.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/80 bg-white/10 rounded-xl p-3 backdrop-blur-sm animate-slide-in-left" style={{animationDelay: `0.2s`}}>
                    <span className="text-xl">📅</span>
                    <span className="text-sm font-semibold">Joined {new Date(student.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>
              
              {/* Edit Button */}
              <div className="flex flex-col gap-3">
                <button 
                  onClick={onEditToggle}
                  className={`px-8 py-3 rounded-2xl font-bold text-white transition-all duration-300 transform ${
                    isEditing
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700'
                  } hover:scale-105 hover:shadow-2xl active:scale-95`}
                >
                  {isEditing ? 'Save Profile' : 'Edit Profile'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- TabButton (Simplified for Settings Only) ---
function TabButton({ tab, activeTab, onClick, icon }) {
  return (
    <button
      onClick={() => onClick(tab)}
      className={`relative px-6 py-3 rounded-2xl font-medium transition-all duration-300 transform ${
        activeTab === tab
          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg scale-105'
          : 'bg-white/10 backdrop-blur-xl text-white/70 hover:text-white hover:bg-white/20 border border-white/20'
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        <span className="capitalize">{tab}</span>
      </div>
      {activeTab === tab && (
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full"></div>
      )}
    </button>
  );
}

// --- Main ProfilePage Component ---
export default function ProfilePage() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('settings'); 
  const [focusedField, setFocusedField] = useState('');
  const [loading, setLoading] = useState(true);
  
  // User data from database
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    createdAt: ''
  });

  // Form data for editing
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  // Password change data
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Load user data on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // No token - user not logged in
      navigate('/login', { replace: true });
      return;
    }
    loadUserData();
  }, [navigate]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const res = await fetch(`${API_URL}/student/profile`, {
        headers: { 
          'Authorization': `Bearer ${token}` 
        }
      });

      if (res.status === 401) {
        // Token is invalid or expired
        alert('Your session has expired. Please login again.');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to load profile');
      }
      
      const data = await res.json();
      setUserData(data);
      setFormData({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        email: data.email || '',
      });
    } catch (error) {
      console.error('Error loading user data:', error);
      alert('Failed to load profile data. Please login again.');
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = async () => {
    if (isEditing) {
      await handleSaveProfile();
    }
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const res = await fetch(`${API_URL}/student/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData) 
      });

      if (res.status === 401) {
        alert('Your session has expired. Please login again.');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
        return;
      }

      if (!res.ok) throw new Error('Failed to update profile');

      const updatedData = await res.json();
      setUserData(updatedData);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile: ' + error.message);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      const res = await fetch(`${API_URL}/student/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      if (res.status === 401) {
        alert('Your session has expired. Please login again.');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
        return;
      }

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to change password');
      }

      alert('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Failed to change password: ' + error.message);
    }
  };

  const handleLogout = () => {
  // Clear all authentication data
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  
  // Trigger storage event to update header
  window.dispatchEvent(new Event('storage'));
  
  // Clear the user data from state
  setUserData({
    firstName: '',
    lastName: '',
    email: '',
    createdAt: ''
  });
  
  setFormData({
    firstName: '',
    lastName: '',
    email: '',
  });
  
  // Redirect to login
  navigate('/login', { replace: true });
};

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <Header/>
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-48 h-48 bg-purple-400/20 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-pink-400/20 rounded-full blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-cyan-400/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '3s'}}></div>
      </div>

      <ProfileHeader 
        student={userData} 
        isEditing={isEditing}
        onEditToggle={handleEditToggle}
        focusedField={focusedField}
        setFocusedField={setFocusedField}
      />

      <div className="relative z-10 py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-center mb-4">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-2 border border-white/20">
              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 px-4 py-2">
                {[ { key: 'settings', icon: '⚙️' } ]
                  .map((tab) => (
                    <TabButton 
                      key={tab.key}
                      tab={tab.key}
                      activeTab={activeTab}
                      onClick={setActiveTab}
                      icon={tab.icon}
                    />
                  ))
                }
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
            
            {activeTab === 'settings' && (
              <div className="animate-fade-in">
                <h3 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                  <span>⚙️</span>
                  Account Settings
                </h3>
                <div className="space-y-8">
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                      <span>👤</span>
                      Personal Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* First Name Input */}
                      <div className="relative">
                        <label className="block text-white/80 text-sm font-medium mb-2">First Name</label>
                        <div className={`absolute left-4 top-11 text-lg transition-colors duration-300 ${focusedField === 'firstName' ? 'text-cyan-400' : 'text-white/60'}`}>
                          👤
                        </div>
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                          onFocus={() => setFocusedField('firstName')}
                          onBlur={() => setFocusedField('')}
                          className="w-full h-14 pl-12 pr-4 bg-white/20 border border-white/30 rounded-2xl text-white placeholder-white/60 outline-none focus:border-cyan-400 focus:bg-white/25 transition-all duration-300 hover:bg-white/25"
                        />
                      </div>

                      {/* Last Name Input */}
                      <div className="relative">
                        <label className="block text-white/80 text-sm font-medium mb-2">Last Name</label>
                        <div className={`absolute left-4 top-11 text-lg transition-colors duration-300 ${focusedField === 'lastName' ? 'text-cyan-400' : 'text-white/60'}`}>
                          👤
                        </div>
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                          onFocus={() => setFocusedField('lastName')}
                          onBlur={() => setFocusedField('')}
                          className="w-full h-14 pl-12 pr-4 bg-white/20 border border-white/30 rounded-2xl text-white placeholder-white/60 outline-none focus:border-cyan-400 focus:bg-white/25 transition-all duration-300 hover:bg-white/25"
                        />
                      </div>

                      {/* Email Input */}
                      <div className="relative md:col-span-2">
                        <label className="block text-white/80 text-sm font-medium mb-2">Email Address</label>
                        <div className={`absolute left-4 top-11 text-lg transition-colors duration-300 ${focusedField === 'email' ? 'text-cyan-400' : 'text-white/60'}`}>
                          ✉️
                        </div>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          onFocus={() => setFocusedField('email')}
                          onBlur={() => setFocusedField('')}
                          className="w-full h-14 pl-12 pr-4 bg-white/20 border border-white/30 rounded-2xl text-white placeholder-white/60 outline-none focus:border-cyan-400 focus:bg-white/25 transition-all duration-300 hover:bg-white/25"
                        />
                      </div>

                    </div>
                  </div>

                  {/* Password Change Section */}
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                      <span>🔒</span>
                      Change Password
                    </h4>
                    <div className="grid grid-cols-1 gap-6">
                      
                      {/* Current Password Input */}
                      <div className="relative">
                        <label className="block text-white/80 text-sm font-medium mb-2">Current Password</label>
                        <div className={`absolute left-4 top-11 text-lg transition-colors duration-300 ${focusedField === 'currentPassword' ? 'text-cyan-400' : 'text-white/60'}`}>
                          🔒
                        </div>
                        <input
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                          onFocus={() => setFocusedField('currentPassword')}
                          onBlur={() => setFocusedField('')}
                          placeholder="Enter current password"
                          className="w-full h-14 pl-12 pr-4 bg-white/20 border border-white/30 rounded-2xl text-white placeholder-white/60 outline-none focus:border-cyan-400 focus:bg-white/25 transition-all duration-300 hover:bg-white/25"
                        />
                      </div>

                      {/* New Password Input */}
                      <div className="relative">
                        <label className="block text-white/80 text-sm font-medium mb-2">New Password</label>
                        <div className={`absolute left-4 top-11 text-lg transition-colors duration-300 ${focusedField === 'newPassword' ? 'text-cyan-400' : 'text-white/60'}`}>
                          🔑
                        </div>
                        <input
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                          onFocus={() => setFocusedField('newPassword')}
                          onBlur={() => setFocusedField('')}
                          placeholder="Enter new password"
                          className="w-full h-14 pl-12 pr-4 bg-white/20 border border-white/30 rounded-2xl text-white placeholder-white/60 outline-none focus:border-cyan-400 focus:bg-white/25 transition-all duration-300 hover:bg-white/25"
                        />
                      </div>

                      {/* Confirm New Password Input */}
                      <div className="relative">
                        <label className="block text-white/80 text-sm font-medium mb-2">Confirm New Password</label>
                        <div className={`absolute left-4 top-11 text-lg transition-colors duration-300 ${focusedField === 'confirmPassword' ? 'text-cyan-400' : 'text-white/60'}`}>
                          🔑
                        </div>
                        <input
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                          onFocus={() => setFocusedField('confirmPassword')}
                          onBlur={() => setFocusedField('')}
                          placeholder="Confirm new password"
                          className="w-full h-14 pl-12 pr-4 bg-white/20 border border-white/30 rounded-2xl text-white placeholder-white/60 outline-none focus:border-cyan-400 focus:bg-white/25 transition-all duration-300 hover:bg-white/25"
                        />
                      </div>

                      {/* Password Change Button */}
                      <button 
                        onClick={handlePasswordChange}
                        className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                      >
                        <span>🔒</span>
                        Change Password
                      </button>
                    </div>
                  </div>

                  <div className="pt-6 flex gap-4 flex-wrap">
                    {/* Save Changes Button */}
                    <button 
                      onClick={handleSaveProfile}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 hover:scale-105 shadow-lg flex items-center gap-2"
                    >
                      <span>💾</span>
                      Save Changes
                    </button>
                    
                    {/* Cancel Button */}
                    <button 
                      onClick={() => setFormData({
                        firstName: userData.firstName || '',
                        lastName: userData.lastName || '',
                        email: userData.email || '',
                      })}
                      className="bg-white/20 backdrop-blur-xl border border-white/30 text-white px-8 py-4 rounded-2xl font-medium hover:bg-white/30 transition-all duration-300 flex items-center gap-2 hover:scale-105"
                    >
                      <span>❌</span>
                      Cancel
                    </button>

                    {/* Logout Button */}
                    <button 
                      onClick={handleLogout}
                      className="bg-white/20 backdrop-blur-xl border border-white/30 text-white px-8 py-4 rounded-2xl font-medium hover:bg-red-600 transition-all duration-300 flex items-center gap-2 hover:scale-105"
                    >
                      <IoIosLogOut />
                      Log out
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fade-in-delay { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slide-in-left { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slide-in-up { from { opacity: 0; transform: translateY(50px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounce-in { 0% { opacity: 0; transform: scale(0.3); } 50% { opacity: 1; transform: scale(1.05); } 70% { transform: scale(0.9); } 100% { opacity: 1; transform: scale(1); } }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        @keyframes twinkle { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.8s ease-out; }
        .animate-fade-in-delay { animation: fade-in-delay 1s ease-out 0.3s both; }
        .animate-slide-in-left { animation: slide-in-left 0.6s ease-out both; }
        .animate-slide-in-up { animation: slide-in-up 0.8s ease-out; }
        .animate-bounce-in { animation: bounce-in 0.6s ease-out both; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-twinkle { animation: twinkle 2s ease-in-out infinite; }
      `}</style>
    </div>
  </div>
    
  );
}