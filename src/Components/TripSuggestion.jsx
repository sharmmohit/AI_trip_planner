import React from 'react';
import { useLocation } from 'react-router-dom';

function TripSuggestion() {
    const location = useLocation();
    const tripData = location.state;

    console.log('TripSuggestion received location.state:', location.state);

    return (
        <div className="p-8">
            <h2 className="text-3xl font-semibold mb-6 text-gray-800">Trip Suggestion</h2>
            {tripData ? (
                <div>
                    {tripData.map((day) => (
                        <div key={day.day} className="mb-6 bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="bg-gray-100 p-4">
                                <h3 className="text-xl font-semibold text-gray-700">Day {day.day}: {day.location}</h3>
                            </div>
                            <ul className="p-4">
                                {day.activities.map((activity) => {
                                    return (
                                        <li key={activity.name} className="mb-4">
                                            <div>
                                                <h4 className="text-lg font-semibold text-gray-600">{activity.name}</h4>
                                                <p className="text-gray-500">{activity.description}</p>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-600">Loading trip summary...</p>
            )}
        </div>
    );
}

export default TripSuggestion;