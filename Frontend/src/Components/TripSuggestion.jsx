import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaHotel, FaUtensils, FaCamera, FaMoneyBillWave, FaUsers, FaArrowLeft } from 'react-icons/fa';

function TripSuggestion() {
    const location = useLocation();
    const navigate = useNavigate();
    const { destination, days, budget, travelWith, details } = location.state || {};

    if (!location.state) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center p-6 bg-white rounded-xl shadow-lg">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">No trip data found</h2>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full transition-colors"
                    >
                        Plan a New Trip
                    </button>
                </div>
            </div>
        );
    }

    const renderActivities = (activities) => {
        return activities?.map((activity, index) => (
            <div key={index} className="mb-4 pl-4 border-l-2 border-blue-200">
                <div className="flex items-start">
                    <span className="bg-blue-100 text-blue-800 rounded-full p-1 mr-3 mt-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                        </svg>
                    </span>
                    <div>
                        <p className="font-medium text-gray-700">{activity.time}</p>
                        <p className="text-gray-600">{activity.description}</p>
                        {activity.note && <p className="text-sm text-gray-500 mt-1">Note: {activity.note}</p>}
                    </div>
                </div>
            </div>
        ));
    };

    const getHotelRecommendation = () => {
        if (budget === 'Luxury') {
            return {
                name: 'The Oberoi Rajvilas',
                address: 'Goner Rd, Jaipur, Rajasthan 302031, India',
                price: '$300-$500/night'
            };
        } else if (budget === 'Moderate') {
            return {
                name: 'Hotel Rajmahal Palace',
                address: 'Jacob Rd, Civil Lines, Jaipur, Rajasthan 302006, India',
                price: '$100-$200/night'
            };
        } else {
            return {
                name: 'Zostel Jaipur',
                address: 'Plot No. 5, Hari Marg, Jaipur, Rajasthan 302020, India',
                price: '$20-$50/night'
            };
        }
    };

    const hotel = getHotelRecommendation();

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
                >
                    <FaArrowLeft className="mr-2" /> Back to Planner
                </button>

                {/* Trip Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">{destination}</h1>
                    <div className="flex justify-center items-center space-x-6 text-gray-600 mb-4">
                        <span className="flex items-center">
                            <FaMapMarkerAlt className="mr-1" /> {days} Days
                        </span>
                        <span className="flex items-center">
                            <FaMoneyBillWave className="mr-1" /> {budget} Budget
                        </span>
                        <span className="flex items-center">
                            <FaUsers className="mr-1" /> {travelWith}
                        </span>
                    </div>
                </div>

                {/* Trip Summary Card */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-12">
                    <div className="md:flex">
                        <div className="md:w-1/2">
                            <img 
                                src={details[0]?.imageUrl || `https://source.unsplash.com/random/800x600/?${destination},city`} 
                                alt={destination}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="p-8 md:w-1/2">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Trip Overview</h2>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-gray-700">Destination Highlights</h3>
                                    <p className="text-gray-600">{details[0]?.overview || 'Explore the best this destination has to offer'}</p>
                                </div>
                                
                                <div>
                                    <h3 className="font-semibold text-gray-700">Hotel Recommendation</h3>
                                    <div className="bg-blue-50 p-4 rounded-lg mt-2">
                                        <div className="flex items-start">
                                            <FaHotel className="text-blue-600 mt-1 mr-2" />
                                            <div>
                                                <p className="font-medium text-gray-800">{hotel.name}</p>
                                                <p className="text-sm text-gray-600">{hotel.address}</p>
                                                <p className="text-sm text-gray-700 mt-1">{hotel.price}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Daily Itinerary */}
                <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Daily Itinerary</h2>
                <div className="space-y-12">
                    {details.map((day) => (
                        <div key={day.day} className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="md:flex">
                                <div className="md:w-1/3">
                                    <img 
                                        src={day.imageUrl || `https://source.unsplash.com/random/800x600/?${day.location},travel`} 
                                        alt={day.location}
                                        className="w-full h-full object-cover min-h-64"
                                    />
                                </div>
                                <div className="p-6 md:w-2/3">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                        Day {day.day}: {day.location}
                                    </h2>
                                    {day.overview && (
                                        <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                                            <h3 className="font-semibold text-gray-700 mb-1">Day Overview</h3>
                                            <p className="text-gray-600">{day.overview}</p>
                                        </div>
                                    )}

                                    <div className="space-y-6">
                                        {day.activities.morning?.length > 0 && (
                                            <div>
                                                <h3 className="text-xl font-semibold text-gray-700 mb-3 flex items-center">
                                                    <FaCamera className="mr-2 text-yellow-500" /> Morning
                                                </h3>
                                                {renderActivities(day.activities.morning)}
                                            </div>
                                        )}

                                        {day.activities.afternoon?.length > 0 && (
                                            <div>
                                                <h3 className="text-xl font-semibold text-gray-700 mb-3 flex items-center">
                                                    <FaUtensils className="mr-2 text-orange-500" /> Afternoon
                                                </h3>
                                                {renderActivities(day.activities.afternoon)}
                                            </div>
                                        )}

                                        {day.activities.evening?.length > 0 && (
                                            <div>
                                                <h3 className="text-xl font-semibold text-gray-700 mb-3 flex items-center">
                                                    <FaHotel className="mr-2 text-indigo-500" /> Evening
                                                </h3>
                                                {renderActivities(day.activities.evening)}
                                            </div>
                                        )}
                                    </div>

                                    {day.notes && (
                                        <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                                            <h3 className="font-semibold text-blue-700 mb-1">Additional Notes</h3>
                                            <p className="text-blue-600">{day.notes}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="mt-12 flex justify-center space-x-4">
                    <button
                        onClick={() => navigate('/')}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full text-lg shadow-md hover:shadow-xl transition-all"
                    >
                        Plan Another Trip
                    </button>
                    <button
                        onClick={() => window.print()}
                        className="bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3 px-8 rounded-full text-lg shadow-md hover:shadow-xl transition-all"
                    >
                        Print Itinerary
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TripSuggestion;