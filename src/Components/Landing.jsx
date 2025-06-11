import '../index.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import PreferencesForm from './PreferencesForm';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { FaRobot, FaMapMarkedAlt, FaPlaneDeparture } from 'react-icons/fa';

function Landing() {
    const [showPreferencesForm, setShowPreferencesForm] = useState(false);
    const [generatedPlan, setGeneratedPlan] = useState(null);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            setUser(authUser || null);
        });
        return () => unsubscribe();
    }, []);

    const handleStartPlanningClick = () => {
        if (!user) {
            navigate('/signup'); // Redirect to Sign Up if not signed in
        } else {
            setShowPreferencesForm(true); // Show planning form
        }
    };

    const handleGenerateTrip = (preferences) => {
        const simulatedPlan = `Generated trip plan for ${preferences.destination} for ${preferences.days} days with a ${preferences.budget} budget, traveling with ${preferences.travelWith}.`;
        setGeneratedPlan(simulatedPlan);
        setShowPreferencesForm(false);
    };

    const handleLogout = () => {
        signOut(auth)
            .then(() => console.log('User signed out'))
            .catch((error) => console.error('Error signing out:', error));
    };

    // Custom Logo
    const PlanTripLogo = () => (
        <svg className="h-12 w-auto" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 20V40H40V20H20Z" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2"/>
            <path d="M20 20L30 10L40 20" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2"/>
            <path d="M25 25V35" stroke="white" strokeWidth="2"/>
            <path d="M35 25V35" stroke="white" strokeWidth="2"/>
            <path d="M60 30L80 30" stroke="#1D4ED8" strokeWidth="3" strokeLinecap="round"/>
            <path d="M75 25L80 30L75 35" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2"/>
            <path d="M65 25L60 30L65 35" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2"/>
            <path d="M70 20L80 30L70 40" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2"/>
            <text x="90" y="35" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" fill="#1E3A8A">PlanTrip</text>
        </svg>
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
                            <>
                                <button
                                    className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                                <Link
                                    to="/dashboard"
                                    className="text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-full shadow-sm transition-all"
                                >
                                    Dashboard
                                </Link>
                            </>
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

            {/* Main */}
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
