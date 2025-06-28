import '../index.css';
import { useState } from 'react';
import { FaCalendarAlt, FaMoneyBillWave, FaUsers, FaPlane, FaSpinner } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Autosuggest from 'react-autosuggest';

function PreferencesForm() {
    const [destination, setDestination] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [days, setDays] = useState('');
    const [budget, setBudget] = useState('');
    const [travelWith, setTravelWith] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const GEODB_API_KEY = 'bc4914961fmsh2906570d84a8ee3p1b1782jsn42832c37a4ba';
    const GEODB_HOST = 'wft-geo-db.p.rapidapi.com';

    const getSuggestions = async (value) => {
        if (value.length < 2) return [];

        try {
            const response = await axios.get(
                `https://${GEODB_HOST}/v1/geo/cities`,
                {
                    headers: {
                        'X-RapidAPI-Key': GEODB_API_KEY,
                        'X-RapidAPI-Host': GEODB_HOST
                    },
                    params: {
                        namePrefix: value,
                        sort: '-population',
                        limit: 5
                    }
                }
            );
            return response.data.data.map(city => ({
                name: `${city.city}, ${city.countryCode}`
            }));
        } catch (error) {
            console.error("GeoDB API Error:", error);
            return [];
        }
    };

    const onSuggestionsFetchRequested = async ({ value }) => {
        const results = await getSuggestions(value);
        setSuggestions(results);
    };

    const getSuggestionValue = suggestion => suggestion.name;
    const renderSuggestion = suggestion => <div className="p-2 hover:bg-blue-50">{suggestion.name}</div>;

    const inputProps = {
        placeholder: '🌍 Where are you going?',
        value: destination,
        onChange: (_, { newValue }) => setDestination(newValue),
        className: 'w-full p-3 pl-10 border-0 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-400 outline-none'
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/generate-trip', {
                destination,
                days,
                budget,
                travelWith,
            });
            navigate('/trip-suggestion', { state: res.data });
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setLoading(false);
        }
    };

    const budgetOptions = [
        { value: 'Cheap', label: '💰 Budget', emoji: '💰' },
        { value: 'Moderate', label: '💵 Moderate', emoji: '💵' },
        { value: 'Luxury', label: '💎 Luxury', emoji: '💎' }
    ];

    const travelWithOptions = [
        { value: 'Just Me', label: '👤 Solo', emoji: '👤' },
        { value: 'A Couple', label: '👫 Couple', emoji: '👫' },
        { value: 'Family', label: '👪 Family', emoji: '👪' },
        { value: 'Friends', label: '👬 Friends', emoji: '👬' }
    ];

    return (
        <div className="p-1 rounded-xl bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
            <form onSubmit={handleSubmit} className="p-8 w-full max-w-2xl mx-auto bg-white rounded-lg shadow-xl">
                <h2 className="text-3xl font-bold mb-2 text-gray-800">✈️ Plan Your Perfect Trip</h2>
                <p className="mb-6 text-gray-600 text-lg">Tell us about your dream vacation and we'll craft the perfect itinerary!</p>

                {/* Destination Field */}
                <div className="mb-6 relative">
                    <label className="block text-gray-700 font-medium mb-2 flex items-center">
                        <FaPlane className="mr-2 text-blue-500" />
                        Destination
                    </label>
                    <div className="relative">
                        <FaPlane className="absolute left-3 top-3.5 text-gray-400" />
                        <Autosuggest
                            suggestions={suggestions}
                            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                            onSuggestionsClearRequested={() => setSuggestions([])}
                            getSuggestionValue={getSuggestionValue}
                            renderSuggestion={renderSuggestion}
                            inputProps={inputProps}
                            onSuggestionSelected={(e, { suggestion }) => setDestination(suggestion.name)}
                            theme={{
                                container: 'w-full',
                                suggestionsContainer: 'absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg',
                                suggestionHighlighted: 'bg-blue-100'
                            }}
                        />
                    </div>
                </div>

                {/* Trip Duration */}
                <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2 flex items-center">
                        <FaCalendarAlt className="mr-2 text-blue-500" />
                        Trip Duration
                    </label>
                    <div className="relative">
                        <input
                            type="number"
                            className="w-full p-3 pl-10 border-0 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-400 outline-none"
                            value={days}
                            onChange={e => setDays(e.target.value)}
                            placeholder="⏳ How many days?"
                            min="1"
                        />
                        <FaCalendarAlt className="absolute left-3 top-3.5 text-gray-400" />
                    </div>
                </div>

                {/* Budget Selection */}
                <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2 flex items-center">
                        <FaMoneyBillWave className="mr-2 text-blue-500" />
                        Budget
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                        {budgetOptions.map(option => (
                            <button
                                type="button"
                                key={option.value}
                                onClick={() => setBudget(option.value)}
                                className={`flex flex-col items-center p-4 rounded-xl transition-all ${budget === option.value 
                                    ? 'bg-gradient-to-br from-blue-100 to-purple-100 border-2 border-blue-300 shadow-md' 
                                    : 'bg-gray-50 border border-gray-200 hover:border-blue-300'}`}
                            >
                                <span className="text-2xl mb-1">{option.emoji}</span>
                                <span>{option.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Traveling With */}
                <div className="mb-8">
                    <label className="block text-gray-700 font-medium mb-2 flex items-center">
                        <FaUsers className="mr-2 text-blue-500" />
                        Traveling With
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {travelWithOptions.map(option => (
                            <button
                                type="button"
                                key={option.value}
                                onClick={() => setTravelWith(option.value)}
                                className={`flex flex-col items-center p-4 rounded-xl transition-all ${travelWith === option.value 
                                    ? 'bg-gradient-to-br from-green-100 to-blue-100 border-2 border-green-300 shadow-md' 
                                    : 'bg-gray-50 border border-gray-200 hover:border-green-300'}`}
                            >
                                <span className="text-2xl mb-1">{option.emoji}</span>
                                <span>{option.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Submit Button */}
                <div className="text-center">
                    <button
                        type="submit"
                        className={`px-8 py-3 rounded-full text-white font-bold text-lg transition-all flex items-center justify-center mx-auto ${loading 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl'}`}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <FaSpinner className="animate-spin mr-2" />
                                Creating Your Trip...
                            </>
                        ) : (
                            '✨ Generate My Trip Plan'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default PreferencesForm;