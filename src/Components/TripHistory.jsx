import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { getUserTrips } from '../firebase';
import { FaTrash, FaEye, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function TripHistory() {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                if (auth.currentUser) {
                    const userTrips = await getUserTrips(auth.currentUser.uid);
                    setTrips(userTrips);
                }
            } catch (err) {
                setError('Failed to load trips');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTrips();
    }, []);

    const viewTrip = (trip) => {
        navigate('/trip-suggestion', { state: trip });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <div className="text-red-500 mb-4">{error}</div>
                <button
                    onClick={() => window.location.reload()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (trips.length === 0) {
        return (
            <div className="text-center py-12">
                <h2 className="text-xl font-semibold mb-2">No trips found</h2>
                <p className="text-gray-600 mb-4">You haven't planned any trips yet</p>
                <button
                    onClick={() => navigate('/')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                    Plan a New Trip
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold">Your Trip History</h1>
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center text-blue-600 hover:text-blue-800"
                >
                    <FaArrowLeft className="mr-2" />
                    Back
                </button>
            </div>

            <div className="space-y-4">
                {trips.map(trip => (
                    <div key={trip.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-semibold">{trip.destination}</h3>
                                <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                                    <span>📅 {trip.days} days</span>
                                    <span>💰 {trip.budget}</span>
                                    <span>👥 {trip.travelWith}</span>
                                    <span>🕒 {new Date(trip.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => viewTrip(trip)}
                                    className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
                                    title="View trip"
                                >
                                    <FaEye />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TripHistory;