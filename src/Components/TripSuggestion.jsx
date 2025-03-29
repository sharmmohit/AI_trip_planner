// src/components/TripSuggestion.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';

function TripSuggestion() {
    const location = useLocation();
    const { tripSummary } = location.state;

    return (
        <div className="p-8">
            <h2 className="text-3xl font-semibold mb-4">Trip Suggestion</h2>
            <p className="text-lg">{tripSummary}</p>
        </div>
    );
}

export default TripSuggestion;