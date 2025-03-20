// src/components/Landing.jsx
// src/components/Landing.jsx
import '../index.css';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import PreferencesForm from './PreferencesForm';
import logo from './logo.png';
import { auth } from '../firebase'; // Import auth from firebase
import { signOut } from 'firebase/auth'; // Import signOut

function Landing() {
    const [showPreferencesForm, setShowPreferencesForm] = useState(false);
    const [generatedPlan, setGeneratedPlan] = useState(null);
    const [user, setUser] = useState(null); // State to store user info

    useEffect(() => {
        // Listen for authentication state changes
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if (authUser) {
                setUser(authUser); // User is signed in
            } else {
                setUser(null); // User is signed out
            }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    const handleStartPlanningClick = () => {
        setShowPreferencesForm(true);
    };

    const handleGenerateTrip = (preferences) => {
        console.log('User preferences:', preferences);
        const simulatedPlan = `Generated trip plan for ${preferences.destination} for ${preferences.days} days with a ${preferences.budget} budget, traveling with ${preferences.travelWith}.`;
        setGeneratedPlan(simulatedPlan);
        setShowPreferencesForm(false);
    };

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                console.log('User signed out');
            })
            .catch((error) => {
                console.error('Error signing out:', error);
            });
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 to-blue-50">
            <header className="flex justify-between items-center p-4 w-full">
                <div className="flex items-center">
                    <img src={logo} alt="Plan Trip Logo" className="h-20 mr-4" />
                </div>
                {user ? (
                    <button
                        className="bg-black hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                ) : (
                    <Link to="/signin" className="bg-black hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300">
                        Sign In
                    </Link>
                )}
            </header>

            <main className="flex-grow flex flex-col justify-center items-center text-center px-4 md:px-8 lg:px-16">
                {showPreferencesForm ? (
                    <div className="w-full max-w-2xl">
                        <PreferencesForm onGenerate={handleGenerateTrip} />
                    </div>
                ) : generatedPlan ? (
                    <div className="p-8">
                        <h2 className="text-3xl font-semibold mb-4 text-gray-800">Your Trip Plan</h2>
                        <p className="text-lg text-gray-700">{generatedPlan}</p>
                    </div>
                ) : (
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900 leading-tight">
                            Plan Your Trip with AI
                            <br />
                            Smart Travel Made Simple
                        </h1>
                        <p className="text-lg md:text-xl mb-10 text-gray-700">
                            Let AI create your perfect travel itinerary based on your interests and budget.
                        </p>
                        <button
                            className="bg-black hover:bg-gray-800 text-white font-semibold py-3 px-8 rounded-full text-lg transition-colors duration-300"
                            onClick={handleStartPlanningClick}
                        >
                            Start Planning
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}

export default Landing;