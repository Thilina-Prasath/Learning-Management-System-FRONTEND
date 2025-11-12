import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function RegisterPage() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [course, setCourse] = useState('');
    const [role, setRole] = useState('student'); // Add role selection
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [focusedField, setFocusedField] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // API Base URL - Update this to match your backend
    const API_BASE_URL = 'http://localhost:5000';

    const validateForm = () => {
        if (!firstName.trim()) {
            setError('First name is required');
            return false;
        }
        if (!lastName.trim()) {
            setError('Last name is required');
            return false;
        }
        if (!email.trim()) {
            setError('Email is required');
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email address');
            return false;
        }
        if (!password) {
            setError('Password is required');
            return false;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        return true;
    };

    const handleRegister = async () => {
        // Clear previous errors
        setError('');

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        
        try {
            // Fixed: Changed from /signup to /register and added missing fields
            const response = await axios.post(`${API_BASE_URL}/api/student/signup`, {
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.trim(),
                password,
                course: course.trim() || "", // Include course field
                role // Include role field
            });

            console.log("Registration Successful");
            console.log(response.data);
            
            alert("Registration Successful! You can now login.");
            
            // Redirect to login page
            navigate('/login');
            
        } catch (error) {
            console.error('Registration failed:', error);
            const errorMessage = error?.response?.data?.message || 'Registration failed. Please try again.';
            setError(errorMessage);
            alert(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative overflow-hidden">
            <div className="absolute inset-0">
                <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400/20 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute top-1/3 right-20 w-48 h-48 bg-purple-400/20 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-pink-400/20 rounded-full blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
            </div>

            <div className="relative z-10 flex min-h-screen">
                <div className="flex-1 flex flex-col justify-center px-12 lg:px-20">
                    <div className="max-w-lg">
                        <div className="mb-8 animate-bounce">
                            <div className="w-20 h-20 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl">
                                <div className="w-10 h-10 text-white text-2xl font-bold">🎓</div>
                            </div>
                        </div>

                        <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-in">
                            Welcome to
                            <span className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                                EduPlatform
                            </span>
                        </h1>
                        
                        <p className="text-xl text-white/80 mb-8 leading-relaxed animate-fade-in-delay">
                            Join thousands of learners in their journey to excellence. 
                            Start your educational adventure today!
                        </p>

                        <div className="space-y-4">
                            {[
                                { icon: "📚", text: "Interactive Learning Materials", delay: '0.4s' },
                                { icon: "👥", text: "Collaborative Study Groups", delay: '0.6s' },
                                { icon: "🏆", text: "Achievement Tracking", delay: '0.8s' }
                            ].map((feature, index) => (
                                <div 
                                    key={index}
                                    className="flex items-center space-x-3 text-white/70 animate-slide-in-left"
                                    style={{animationDelay: feature.delay}}
                                >
                                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-lg">
                                        {feature.icon}
                                    </div>
                                    <span className="text-sm">{feature.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex items-center justify-center px-6 lg:px-12">
                    <div className="w-full max-w-md">
                        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 animate-slide-in-right">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                                <p className="text-white/70">Start your learning journey</p>
                                <div className="flex justify-center">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className="text-yellow-400 text-lg animate-twinkle" style={{animationDelay: `${i * 0.2}s`}}>⭐</span>
                                    ))}
                                </div>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="mb-6 p-4 bg-red-500/20 border border-red-400/50 rounded-2xl">
                                    <p className="text-red-300 text-sm text-center">{error}</p>
                                </div>
                            )}

                            <div className="space-y-4">
                                {/* First Name */}
                                <div className="relative">
                                    <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 text-lg ${focusedField === 'firstName' ? 'text-cyan-400' : 'text-white/60'}`}>
                                        👤
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="First Name"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        onFocus={() => setFocusedField('firstName')}
                                        onBlur={() => setFocusedField('')}
                                        disabled={isLoading}
                                        className="w-full h-14 pl-12 pr-4 bg-white/20 border border-white/30 rounded-2xl text-white placeholder-white/60 outline-none focus:border-cyan-400 focus:bg-white/25 transition-all duration-300 hover:bg-white/25 disabled:opacity-50"
                                    />
                                </div>

                                {/* Last Name */}
                                <div className="relative">
                                    <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 text-lg ${focusedField === 'lastName' ? 'text-cyan-400' : 'text-white/60'}`}>
                                        👤
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Last Name"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        onFocus={() => setFocusedField('lastName')}
                                        onBlur={() => setFocusedField('')}
                                        disabled={isLoading}
                                        className="w-full h-14 pl-12 pr-4 bg-white/20 border border-white/30 rounded-2xl text-white placeholder-white/60 outline-none focus:border-cyan-400 focus:bg-white/25 transition-all duration-300 hover:bg-white/25 disabled:opacity-50"
                                    />
                                </div>

                                {/* Email */}
                                <div className="relative">
                                    <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 text-lg ${focusedField === 'email' ? 'text-cyan-400' : 'text-white/60'}`}>
                                        ✉️
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="Email Address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onFocus={() => setFocusedField('email')}
                                        onBlur={() => setFocusedField('')}
                                        disabled={isLoading}
                                        className="w-full h-14 pl-12 pr-4 bg-white/20 border border-white/30 rounded-2xl text-white placeholder-white/60 outline-none focus:border-cyan-400 focus:bg-white/25 transition-all duration-300 hover:bg-white/25 disabled:opacity-50"
                                    />
                                </div>


                                {/* Password */}
                                <div className="relative">
                                    <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 text-lg ${focusedField === 'password' ? 'text-cyan-400' : 'text-white/60'}`}>
                                        🔒
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onFocus={() => setFocusedField('password')}
                                        onBlur={() => setFocusedField('')}
                                        disabled={isLoading}
                                        className="w-full h-14 pl-12 pr-12 bg-white/20 border border-white/30 rounded-2xl text-white placeholder-white/60 outline-none focus:border-cyan-400 focus:bg-white/25 transition-all duration-300 hover:bg-white/25 disabled:opacity-50"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        disabled={isLoading}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors duration-300 text-lg disabled:opacity-50"
                                    >
                                        {showPassword ? '🙈' : '👁️'}
                                    </button>
                                </div>

                                {/* Confirm Password */}
                                <div className="relative">
                                    <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 text-lg ${focusedField === 'confirmPassword' ? 'text-cyan-400' : 'text-white/60'}`}>
                                        🔒
                                    </div>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm Password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        onFocus={() => setFocusedField('confirmPassword')}
                                        onBlur={() => setFocusedField('')}
                                        disabled={isLoading}
                                        className="w-full h-14 pl-12 pr-12 bg-white/20 border border-white/30 rounded-2xl text-white placeholder-white/60 outline-none focus:border-cyan-400 focus:bg-white/25 transition-all duration-300 hover:bg-white/25 disabled:opacity-50"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        disabled={isLoading}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors duration-300 text-lg disabled:opacity-50"
                                    >
                                        {showConfirmPassword ? '🙈' : '👁️'}
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={handleRegister}
                                disabled={isLoading}
                                className={`w-full h-14 rounded-2xl font-bold text-lg text-white mt-8 transition-all duration-300 transform ${
                                    isLoading
                                        ? 'bg-gray-500 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 hover:scale-105 hover:shadow-2xl active:scale-95'
                                }`}
                            >
                                <div className="flex items-center justify-center space-x-2">
                                    {isLoading && (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    )}
                                    <span>{isLoading ? 'Creating Account...' : 'Create Account'}</span>
                                </div>
                            </button>

                            <div className="text-center mt-6">
                                <p className="text-white/70">
                                    Already have an account?{' '}
                                    <span 
                                        onClick={() => navigate('/login')}
                                        className="text-white font-bold cursor-pointer hover:underline"
                                    >
                                        Sign In
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes fade-in-delay {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes slide-in-left {
                    from { opacity: 0; transform: translateX(-30px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                
                @keyframes slide-in-right {
                    from { opacity: 0; transform: translateX(30px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                
                @keyframes twinkle {
                    0%, 100% { opacity: 0.5; }
                    50% { opacity: 1; }
                }
                
                .animate-fade-in {
                    animation: fade-in 1s ease-out;
                }
                
                .animate-fade-in-delay {
                    animation: fade-in-delay 1s ease-out 0.3s both;
                }
                
                .animate-slide-in-left {
                    animation: slide-in-left 0.6s ease-out both;
                }
                
                .animate-slide-in-right {
                    animation: slide-in-right 0.8s ease-out;
                }
                
                .animate-twinkle {
                    animation: twinkle 2s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}