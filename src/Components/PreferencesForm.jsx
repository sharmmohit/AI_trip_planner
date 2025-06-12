import '../index.css';
import { useState } from 'react';
import Select from 'react-select';
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

    const GEODB_API_KEY = 'bc4914961fmsh2906570d84a8ee3p1b1782jsn42832c37a4ba'; // Replace with your GeoDB Cities API Key
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
    const renderSuggestion = suggestion => <div>{suggestion.name}</div>;

    const inputProps = {
        placeholder: 'Enter Destination City',
        value: destination,
        onChange: (_, { newValue }) => setDestination(newValue),
        className: 'w-full border border-gray-300 p-2 rounded'
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

    return (
        <form onSubmit={handleSubmit} className="p-8 w-full max-w-2xl mx-auto bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">🌍 Plan Your Adventure</h2>
            <p className="mb-6 text-gray-600">Fill out the form to get a custom travel plan based on your interests.</p>

            <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1">Destination</label>
                <Autosuggest
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={() => setSuggestions([])}
                    getSuggestionValue={getSuggestionValue}
                    renderSuggestion={renderSuggestion}
                    inputProps={inputProps}
                    onSuggestionSelected={(e, { suggestion }) => setDestination(suggestion.name)}
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1">Trip Duration (Days)</label>
                <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={days}
                    onChange={e => setDays(e.target.value)}
                    placeholder="e.g. 5"
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1">Budget</label>
                <div className="grid grid-cols-3 gap-2">
                    {['Cheap', 'Moderate', 'Luxury'].map(option => (
                        <button
                            type="button"
                            key={option}
                            onClick={() => setBudget(option)}
                            className={`p-3 border rounded ${budget === option ? 'bg-blue-100 border-blue-500' : 'border-gray-300'} hover:border-blue-400`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-1">Traveling With</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {['Just Me', 'A Couple', 'Family', 'Friends'].map(option => (
                        <button
                            type="button"
                            key={option}
                            onClick={() => setTravelWith(option)}
                            className={`p-3 border rounded ${travelWith === option ? 'bg-green-100 border-green-500' : 'border-gray-300'} hover:border-green-400`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>

            <div className="text-center">
                <button
                    type="submit"
                    className={`px-6 py-2 rounded-full text-white font-semibold transition ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                    disabled={loading}
                >
                    {loading ? 'Generating Trip...' : 'Generate Trip'}
                </button>
            </div>
        </form>
    );
}

export default PreferencesForm;
