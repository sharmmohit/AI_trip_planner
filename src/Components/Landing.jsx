import '../index.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import PreferencesForm from './PreferencesForm';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { FaRobot, FaMapMarkedAlt, FaPlaneDeparture, FaUserCircle, FaPlus, FaHistory, FaSignOutAlt } from 'react-icons/fa';

function Landing() {
    const [showPreferencesForm, setShowPreferencesForm] = useState(false);
    const [generatedPlan, setGeneratedPlan] = useState(null);
    const [user, setUser] = useState(null);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            setUser(authUser || null);
        });
        return () => unsubscribe();
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowProfileDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleStartPlanningClick = () => {
        if (!user) {
            navigate('/signup');
        } else {
            setShowPreferencesForm(true);
        }
    };

    const handleGenerateTrip = (preferences) => {
        const simulatedPlan = `Generated trip plan for ${preferences.destination} for ${preferences.days} days with a ${preferences.budget} budget, traveling with ${preferences.travelWith}.`;
        setGeneratedPlan(simulatedPlan);
        setShowPreferencesForm(false);
    };

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                setShowProfileDropdown(false);
                navigate('/');
            })
            .catch((error) => console.error('Error signing out:', error));
    };

    const handleCreateTrip = () => {
        setShowProfileDropdown(false);
        setShowPreferencesForm(true);
    };

    const handleTripHistory = () => {
        setShowProfileDropdown(false);
        // Navigate to trip history page when implemented
        alert('Trip history feature coming soon!');
    };

    // Modern Minimalist Logo
    const PlanTripLogo = () => (
        <div className="flex items-center">
            <div className="bg-blue-600 text-white font-bold rounded-lg w-10 h-10 flex items-center justify-center">
                PT
            </div>
            <span className="mx-3 h-6 w-px bg-blue-400"></span>
            <span className="text-xl font-bold text-gray-800">PlanTrip</span>
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 to-blue-50">
            {/* Navbar */}
            <header className="fixed top-0 left-0 w-full z-10 h-16 backdrop-blur-sm border-b border-blue-200/50 bg-white/10">
                <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
                    <Link to="/" className="flex items-center space-x-2">
                        <PlanTripLogo />
                    </Link>

                    <div className="flex items-center space-x-4">
                        {user ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                                    className="flex items-center space-x-2 focus:outline-none"
                                >
                                    {user.photoURL ? (
                                        <img 
                                            src={user.photoURL} 
                                            alt="Profile" 
                                            className="w-8 h-8 rounded-full object-cover border-2 border-blue-200"
                                        />
                                    ) : (
                                        <FaUserCircle className="text-2xl text-blue-600" />
                                    )}
                                </button>

                                {showProfileDropdown && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 z-20 border border-gray-200"
                                    >
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="text-sm font-medium text-gray-900">{user.displayName || 'User'}</p>
                                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                        </div>
                                        <button
                                            onClick={handleCreateTrip}
                                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                                        >
                                            <FaPlus className="mr-3 text-blue-500" />
                                            Create Trip
                                        </button>
                                        <button
                                            onClick={handleTripHistory}
                                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                                        >
                                            <FaHistory className="mr-3 text-blue-500" />
                                            Trip History
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 border-t border-gray-100"
                                        >
                                            <FaSignOutAlt className="mr-3 text-red-500" />
                                            Logout
                                        </button>
                                    </motion.div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link
                                    to="/signin"
                                    className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/signup"
                                    className="text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-full shadow-sm transition-all"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow pt-16">
                {/* Hero Section */}
                <section className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center text-center px-4 md:px-8 lg:px-16 py-20">
                    {showPreferencesForm ? (
                        <div className="w-full max-w-2xl bg-white/80 rounded-xl shadow-lg p-8 backdrop-blur-sm">
                            <PreferencesForm onGenerate={handleGenerateTrip} />
                        </div>
                    ) : generatedPlan ? (
                        <div className="w-full max-w-3xl bg-white/80 rounded-xl shadow-lg p-8 backdrop-blur-sm">
                            <h2 className="text-3xl font-semibold mb-4 text-gray-800">Your Trip Plan</h2>
                            <p className="text-lg text-gray-700">{generatedPlan}</p>
                        </div>
                    ) : (
                        <div className="max-w-3xl animate-fadeIn">
                            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900 leading-tight">
                                Plan Your Perfect Journey
                                <br />
                                <span className="text-blue-600">Smart Travel Made Simple</span>
                            </h1>
                            <p className="text-lg md:text-xl mb-10 text-gray-700">
                                Get personalized travel recommendations tailored just for you.
                            </p>
                            <button
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-10 rounded-full text-lg shadow-md hover:shadow-xl transition-all duration-300"
                                onClick={handleStartPlanningClick}
                            >
                                Start Planning
                            </button>
                        </div>
                    )}
                </section>

                {/* Services Section */}
                <section className="py-16 bg-gradient-to-b from-white/30 to-transparent">
                    <div className="max-w-7xl mx-auto px-6">
                        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">How It Works</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white/90 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100/30">
                                <div className="flex justify-center mb-4">
                                    <FaRobot className="text-4xl text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3 text-gray-800">AI-Powered Suggestions</h3>
                                <p className="text-gray-600">
                                    Our AI suggests ideal destinations and experiences based on your preferences.
                                </p>
                            </div>
                            <div className="bg-white/90 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100/30">
                                <div className="flex justify-center mb-4">
                                    <FaMapMarkedAlt className="text-4xl text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3 text-gray-800">You Decide</h3>
                                <p className="text-gray-600">
                                    Pick and personalize your trip plan to match your vibe and budget.
                                </p>
                            </div>
                            <div className="bg-white/90 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100/30">
                                <div className="flex justify-center mb-4">
                                    <FaPlaneDeparture className="text-4xl text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3 text-gray-800">Seamless Experience</h3>
                                <p className="text-gray-600">
                                    We guide you from planning to booking for a hassle-free travel experience.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default Landing;