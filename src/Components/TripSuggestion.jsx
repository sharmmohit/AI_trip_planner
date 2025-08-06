import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function TripSuggestion() {
    const location = useLocation();
    const navigate = useNavigate();
    const tripData = location.state;

    if (!tripData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold mb-4">No trip data found</h2>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full"
                    >
                        Plan a New Trip
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Personalized Trip Itinerary</h1>
                    <p className="text-xl text-gray-600">Here's your customized travel plan based on your preferences</p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {tripData.map((day) => (
                        <div key={day.day} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                            {day.imageUrl && (
                                <div className="h-48 overflow-hidden">
                                    <img
                                        src={day.imageUrl}
                                        alt={day.location}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                    Day {day.day}: {day.location}
                                </h2>
                                
                                <div className="space-y-4 mt-4">
                                    <div>
                                        <h3 className="font-semibold text-lg text-gray-700 mb-2">Morning</h3>
                                        <ul className="space-y-2">
                                            {day.activities.morning?.map((activity, index) => (
                                                <li key={`morning-${index}`} className="text-gray-600">
                                                    {activity.time && <span className="font-medium">{activity.time}: </span>}
                                                    {activity.description}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-lg text-gray-700 mb-2">Afternoon</h3>
                                        <ul className="space-y-2">
                                            {day.activities.afternoon?.map((activity, index) => (
                                                <li key={`afternoon-${index}`} className="text-gray-600">
                                                    {activity.time && <span className="font-medium">{activity.time}: </span>}
                                                    {activity.description}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-lg text-gray-700 mb-2">Evening</h3>
                                        <ul className="space-y-2">
                                            {day.activities.evening?.map((activity, index) => (
                                                <li key={`evening-${index}`} className="text-gray-600">
                                                    {activity.time && <span className="font-medium">{activity.time}: </span>}
                                                    {activity.description}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <button
                        onClick={() => navigate('/')}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full text-lg shadow-md hover:shadow-xl transition-all duration-300"
                    >
                        Plan Another Trip
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TripSuggestion;