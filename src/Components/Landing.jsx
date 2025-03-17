import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navbar */}
      <nav className="w-full flex justify-between items-center px-6 py-4 bg-white shadow-md fixed top-0 left-0 right-0 z-10">
        <div className="text-xl font-bold flex items-center space-x-2">
          <span className="bg-blue-600 text-white px-2 py-1 rounded">AI</span>
          <span className="text-gray-700">Travel Partner</span>
        </div>
        <Link to="/signin" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Sign In
        </Link>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center flex-1 text-center mt-24 px-4">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
          Plan Your Trip with AI
        </h1>
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-700 mt-2">
          Smart Travel Made Simple
        </h2>
        <p className="text-gray-600 mt-4 max-w-xl">
          Let AI create your perfect travel itinerary based on your interests and budget.
        </p>
        {/* Start Planning Button with Navigation */}
        <button 
          onClick={() => navigate("/preferences")} 
          className="mt-6 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
        >
          Start Planning
        </button>
      </div>
    </div>
  );
};

export default Landing;
