import { Link, useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoIosLogOut } from "react-icons/io";
import { useState, useEffect } from "react";

export default function Header() {
    const [SideDrawerOpened, setSideDrawerOpened] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    // Check if user is logged in
    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    // Listen for storage changes (login/logout events)
    useEffect(() => {
        const handleStorageChange = () => {
            const token = localStorage.getItem('token');
            setIsLoggedIn(!!token);
        };

        window.addEventListener('storage', handleStorageChange);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (SideDrawerOpened) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [SideDrawerOpened]);

    const handleLogout = () => {
        // Clear all data
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        
        // Update header state
        setIsLoggedIn(false);
        
        // Trigger storage event
        window.dispatchEvent(new Event('storage'));
        
        // Redirect to login
        navigate('/login');
        
        // Close drawer if open
        setSideDrawerOpened(false);
    };

    return (
        <>
            <style>
                {`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes slideIn {
                    from { transform: translateX(-100%); }
                    to { transform: translateX(0); }
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
                
                .animate-slideIn {
                    animation: slideIn 0.3s ease-out;
                }
                `}
            </style>
            <header className="w-full h-[80px] bg-gradient-to-r from-blue-900 via-teal-800 to-green-700 shadow-2xl flex justify-center relative backdrop-blur-sm border-b border-white/20">
                <GiHamburgerMenu 
                    className="h-full text-3xl md:hidden absolute left-2 cursor-pointer text-white hover:text-yellow-300 transition-all duration-300 hover:scale-110 z-10" 
                    onClick={() => {
                        setSideDrawerOpened(true);
                    }}
                />
                
                <div className="flex items-center">
                    <img 
                        onClick={() => {
                            navigate("/");
                        }} 
                        src="/logo.png" 
                        alt="Logo" 
                        className="w-[60px] h-[60px] m-3 object-cover cursor-pointer rounded-full border-2 border-white/30 hover:border-yellow-300 transition-all duration-300 hover:scale-110 shadow-lg"
                    />
                    <span className="ml-3 text-white font-bold text-xl hidden sm:block">EduPlatform</span>
                </div>
                
                <div className="w-[calc(100%-160px)] h-full hidden md:flex place-self-center justify-center items-center">
                    <Link to="/home" className="text-white text-[18px] font-semibold mx-4 px-4 py-2 rounded-full hover:bg-white/20 hover:text-yellow-300 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
                         Home
                    </Link>
                    <Link to="/course" className="text-white text-[18px] font-semibold mx-4 px-4 py-2 rounded-full hover:bg-white/20 hover:text-yellow-300 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
                         Course
                    </Link>
                    <Link to="/review" className="text-white text-[18px] font-semibold mx-4 px-4 py-2 rounded-full hover:bg-white/20 hover:text-yellow-300 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
                        Reviews
                    </Link>
                    <Link to="/about" className="text-white text-[18px] font-semibold mx-4 px-4 py-2 rounded-full hover:bg-white/20 hover:text-yellow-300 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
                        About
                    </Link>
                </div>
                
                <div className="w-[100px] hidden md:flex justify-center items-center gap-2">
                    {isLoggedIn ? (
                        <>
                            <Link to="/user/profile" className="text-white text-[24px] p-3 rounded-full hover:bg-white/20 hover:text-yellow-300 transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-white/30">
                                <CgProfile />
                            </Link>
                        </>
                    ) : (
                        <Link to="/login" className="text-white text-[16px] font-semibold px-6 py-2 rounded-full bg-white/20 hover:bg-white/30 hover:text-yellow-300 transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-white/30">
                            Login
                        </Link>
                    )}
                </div>
                
                <div className="border-b border-white/50"></div>
            </header>

            {/* Mobile Side Drawer - Moved outside header */}
            {SideDrawerOpened && 
                <div 
                    className="fixed top-0 left-0 right-0 bottom-0 h-screen w-screen bg-black/70 backdrop-blur-sm flex md:hidden animate-fadeIn"
                    style={{ zIndex: 99999 }}
                    onClick={() => setSideDrawerOpened(false)}
                >
                    <div 
                        className="w-[350px] max-w-[85vw] bg-gradient-to-b from-white via-gray-50 to-gray-100 h-full shadow-2xl animate-slideIn"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="w-full h-[80px] bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 flex justify-center items-center relative">
                            <GiHamburgerMenu 
                                className="h-full text-3xl absolute left-2 cursor-pointer text-white hover:text-yellow-300 transition-all duration-300 hover:scale-110" 
                                onClick={() => {
                                    setSideDrawerOpened(false);
                                }} 
                            />
                            <img 
                                onClick={() => {
                                    navigate("/");
                                    setSideDrawerOpened(false);
                                }} 
                                src="/logo.png" 
                                alt="Logo" 
                                className="w-[60px] h-[60px] object-cover cursor-pointer rounded-full border-2 border-white/30 hover:border-yellow-300 transition-all duration-300 hover:scale-110"
                            />
                        </div>
                        <div className="w-full h-[calc(100%-80px)] flex flex-col items-center gap-2 pt-8 overflow-y-auto">
                            <Link 
                                to="/home" 
                                className="w-[80%] text-center text-gray-800 text-[18px] font-semibold py-4 px-6 my-2 rounded-2xl hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl border border-gray-200"
                                onClick={() => setSideDrawerOpened(false)}
                            >
                                 Home
                            </Link>
                            <Link 
                                to="/about" 
                                className="w-[80%] text-center text-gray-800 text-[18px] font-semibold py-4 px-6 my-2 rounded-2xl hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl border border-gray-200"
                                onClick={() => setSideDrawerOpened(false)}
                            >
                                 About
                            </Link>
                            <Link 
                                to="/course" 
                                className="w-[80%] text-center text-gray-800 text-[18px] font-semibold py-4 px-6 my-2 rounded-2xl hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl border border-gray-200"
                                onClick={() => setSideDrawerOpened(false)}
                            >
                                Course
                            </Link>
                            <Link 
                                to="/review" 
                                className="w-[80%] text-center text-gray-800 text-[18px] font-semibold py-4 px-6 my-2 rounded-2xl hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl border border-gray-200"
                                onClick={() => setSideDrawerOpened(false)}
                            >
                                Reviews
                            </Link>
                            
                            {isLoggedIn ? (
                                <>
                                    <Link 
                                        to="/user/profile" 
                                        className="w-[80%] text-center text-gray-800 text-[18px] font-semibold py-4 px-6 my-2 rounded-2xl hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl border border-gray-200 flex items-center justify-center"
                                        onClick={() => setSideDrawerOpened(false)}
                                    >
                                        <CgProfile className="mr-2 text-xl" /> Profile
                                    </Link>
                                    <button 
                                        onClick={handleLogout}
                                        className="w-[80%] text-center text-gray-800 text-[18px] font-semibold py-4 px-6 my-2 rounded-2xl hover:bg-gradient-to-r hover:from-red-500 hover:to-orange-500 hover:text-white transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl border border-gray-200 flex items-center justify-center"
                                    >
                                        <IoIosLogOut className="mr-2 text-xl" /> Logout
                                    </button>
                                </>
                            ) : (
                                <Link 
                                    to="/login" 
                                    className="w-[80%] text-center text-gray-800 text-[18px] font-semibold py-4 px-6 my-2 rounded-2xl hover:bg-gradient-to-r hover:from-green-500 hover:to-blue-500 hover:text-white transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl border border-gray-200"
                                    onClick={() => setSideDrawerOpened(false)}
                                >
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            }
        </>
    );
}