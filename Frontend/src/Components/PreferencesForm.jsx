import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaSpinner } from 'react-icons/fa';
import Autosuggest from 'react-autosuggest';

const PreferencesForm = () => {
    const navigate = useNavigate();
    const [destination, setDestination] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [days, setDays] = useState('');
    const [budget, setBudget] = useState('');
    const [travelWith, setTravelWith] = useState('');
    const [loading, setLoading] = useState(false);

    // API configuration
    const GEODB_API_KEY = 'your-api-key-here';
    const GEODB_HOST = 'wft-geo-db.p.rapidapi.com';

    // Form options
    const budgetOptions = [
        { value: 'Cheap', label: 'Cheap', emoji: '💰', description: 'Stay conscious of costs' },
        { value: 'Moderate', label: 'Moderate', emoji: '🪙', description: 'Keep cost on the average side' },
        { value: 'Luxury', label: 'Luxury', emoji: '💸', description: 'Don\'t worry about cost' }
    ];

    const travelWithOptions = [
        { value: 'Just Me', label: 'Just Me', emoji: '✈️', description: 'A solo travels in exploration' },
        { value: 'A Couple', label: 'A Couple', emoji: '🥂', description: 'Two travelers in tandem' },
        { value: 'Family', label: 'Family', emoji: '🏠', description: 'A group of fun loving ady' },
        { value: 'Friends', label: 'Friends', emoji: '⛵', description: 'A bunch of all thrill-seekers' }
    ];

    // Fetch city suggestions from GeoDB API
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
                name: `${city.city}, ${city.country}`
            }));
        } catch (error) {
            console.error("GeoDB API Error:", error);
            return [];
        }
    };

    // Autosuggest callbacks
    const onSuggestionsFetchRequested = async ({ value }) => {
        const results = await getSuggestions(value);
        setSuggestions(results);
    };

    const onSuggestionsClearRequested = () => setSuggestions([]);
    const getSuggestionValue = suggestion => suggestion.name;
    const renderSuggestion = suggestion => (
        <div className="p-2 hover:bg-gray-100 cursor-pointer text-gray-800">
            {suggestion.name}
        </div>
    );

    const inputProps = {
        placeholder: 'Enter destination...',
        value: destination,
        onChange: (_, { newValue }) => setDestination(newValue),
        className: 'w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800'
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!destination || !days || !budget || !travelWith) {
            alert('Please fill all fields');
            return;
        }
        
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/generate-trip', {
                destination,
                days,
                budget,
                travelWith,
            });
            
            navigate('/trip-suggestion', { 
                state: { 
                    destination,
                    days,
                    budget,
                    travelWith,
                    details: res.data 
                } 
            });
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Failed to generate trip. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">Tell us your travel preferences 🏕️</h1>
                <p className="text-lg text-gray-600">
                    Just provide some basic information, and our trip planner will generate a customized itinerary.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Destination Field */}
                <div>
                    <label htmlFor="destination" className="block text-xl font-semibold text-gray-700 mb-3">
                        What is your destination of choice?
                    </label>
                    <Autosuggest
                        suggestions={suggestions}
                        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                        onSuggestionsClearRequested={onSuggestionsClearRequested}
                        getSuggestionValue={getSuggestionValue}
                        renderSuggestion={renderSuggestion}
                        inputProps={inputProps}
                        onSuggestionSelected={(e, { suggestion }) => setDestination(suggestion.name)}
                        theme={{
                            container: 'relative',
                            input: inputProps.className,
                            suggestionsContainer: 'absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg',
                            suggestionsList: 'list-none p-0 m-0',
                            suggestion: 'p-2 hover:bg-gray-100 cursor-pointer',
                            suggestionHighlighted: 'bg-gray-100'
                        }}
                    />
                </div>

                {/* Days Field */}
                <div>
                    <label htmlFor="days" className="block text-xl font-semibold text-gray-700 mb-3">
                        How many days are you planning your trip?
                    </label>
                    <input
                        type="number"
                        id="days"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
                        value={days}
                        onChange={e => setDays(e.target.value)}
                        placeholder="Ex: 3"
                        min="1"
                        required
                    />
                </div>

                {/* Budget Selection */}
                <div>
                    <label className="block text-xl font-semibold text-gray-700 mb-3">
                        What is Your Budget?
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {budgetOptions.map(option => (
                            <button
                                type="button"
                                key={option.value}
                                onClick={() => setBudget(option.value)}
                                className={`flex flex-col items-start p-5 rounded-xl border-2 transition-all duration-200
                                    ${budget === option.value
                                        ? 'border-blue-500 bg-blue-50 shadow-md'
                                        : 'border-gray-200 bg-white hover:border-gray-300'
                                    }`}
                            >
                                <span className="text-4xl mb-2">{option.emoji}</span>
                                <span className="text-lg font-semibold text-gray-800">{option.label}</span>
                                <span className="text-sm text-gray-500 text-left">{option.description}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Travel With Selection */}
                <div>
                    <label className="block text-xl font-semibold text-gray-700 mb-3">
                        Who do you plan on traveling with?
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {travelWithOptions.map(option => (
                            <button
                                type="button"
                                key={option.value}
                                onClick={() => setTravelWith(option.value)}
                                className={`flex flex-col items-start p-5 rounded-xl border-2 transition-all duration-200
                                    ${travelWith === option.value
                                        ? 'border-green-500 bg-green-50 shadow-md'
                                        : 'border-gray-200 bg-white hover:border-gray-300'
                                    }`}
                            >
                                <span className="text-4xl mb-2">{option.emoji}</span>
                                <span className="text-lg font-semibold text-gray-800">{option.label}</span>
                                <span className="text-sm text-gray-500 text-left">{option.description}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        className={`px-8 py-3 rounded-full text-white font-bold text-lg transition-all duration-300 flex items-center justify-center
                            ${loading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gray-800 hover:bg-gray-900 shadow-lg hover:shadow-xl'
                            }`}
                        disabled={loading || !destination || !days || !budget || !travelWith}
                    >
                        {loading ? (
                            <>
                                <FaSpinner className="animate-spin mr-2" />
                                Creating Your Trip...
                            </>
                        ) : (
                            'Generate Trip'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PreferencesForm;