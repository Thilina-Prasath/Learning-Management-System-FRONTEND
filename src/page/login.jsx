import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focusedField, setFocusedField] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ use environment variable instead of localhost
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

  async function handleLogin() {
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      localStorage.clear();

      const res = await axios.post(`${API_BASE_URL}/api/student/login`, {
        email,
        password,
      });

      console.log("Login response:", res.data);

      // Store NEW token and role
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      // Trigger a storage event to update header
      window.dispatchEvent(new Event("storage"));

      // Navigate based on role
      if (res.data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert(
        error?.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-48 h-48 bg-purple-400/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-pink-400/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 flex items-center justify-center px-6 lg:px-10 p-20">
        <div className="w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl mx-auto">
                <div className="text-white text-2xl font-bold">🎓</div>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Welcome Back!</h2>
              <p className="text-white/70">Enter your credentials to access your account</p>
            </div>

            <div className="space-y-6">
              {/* Email */}
              <div className="relative">
                <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 text-lg ${focusedField === 'email' ? 'text-cyan-400' : 'text-white/60'}`}>
                  ✉️
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Email Address"
                  disabled={isLoading}
                  className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white/20 border border-white/30 placeholder-white/60 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300 hover:bg-white/25 disabled:opacity-50"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 text-lg ${focusedField === 'password' ? 'text-cyan-400' : 'text-white/60'}`}>
                  🔒
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Password"
                  disabled={isLoading}
                  className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white/20 border border-white/30 placeholder-white/60 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300 hover:bg-white/25 disabled:opacity-50"
                />
              </div>
            </div>

            <button
              onClick={handleLogin}
              disabled={isLoading}
              className={`w-full h-14 rounded-2xl font-bold text-lg text-white mt-8 transition-all duration-300 transform ${isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 hover:scale-105 hover:shadow-2xl active:scale-95'}`}
            >
              <div className="flex items-center justify-center space-x-2">
                {isLoading && <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                <span>{isLoading ? "Signing In..." : "Sign In"}</span>
              </div>
            </button>

            <div className="text-center mt-6">
              <p className="text-white/70">
                Don't have an account?{" "}
                <span onClick={() => navigate("/signup")} className="text-white font-bold cursor-pointer hover:underline transition-colors duration-300">
                  Sign Up
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

