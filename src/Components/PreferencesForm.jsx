// src/components/PreferencesForm.jsx
import '../index.css';
import { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';

function PreferencesForm({ onGenerate }) {
    const [destination, setDestination] = useState(null);
    const [days, setDays] = useState('');
    const [budget, setBudget] = useState('');
    const [travelWith, setTravelWith] = useState('');
    const [destinationOptions, setDestinationOptions] = useState([]);

    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const response = await axios.get('https://restcountries.com/v3.1/all');
                const options = response.data.map(country => ({
                    value: country.name.common,
                    label: country.name.common,
                }));
                setDestinationOptions(options);
            } catch (error) {
                console.error('Error fetching destinations:', error);
            }
        };

        fetchDestinations();
    }, []);

    const handleDestinationChange = (selectedOption) => {
        setDestination(selectedOption);
    };

    const handleDaysChange = (e) => {
        setDays(e.target.value);
    };

    const handleBudgetChange = (value) => {
        setBudget(value);
    };

    const handleTravelWithChange = (value) => {
        setTravelWith(value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onGenerate({
            destination: destination?.value,
            days,
            budget,
            travelWith,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="p-8 w-full max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4 text-left">Tell us your travel preferences <span role="img" aria-label="palm-tree">🌴</span> <span role="img" aria-label="airplane">✈️</span></h2>
            <p className="mb-6 text-left">Just provide some basic information, and our trip planner will generate a customized itinerary based on your preferences.</p>

            <div className="mb-4 text-left">
                <label className="block text-sm font-medium text-gray-700">What is your destination of choice?</label>
                <Select
                    value={destination}
                    onChange={handleDestinationChange}
                    options={destinationOptions}
                    placeholder="Select..."
                    className="mt-1"
                />
            </div>

            <div className="mb-4 text-left">
                <label className="block text-sm font-medium text-gray-700">How many days are you planning your trip?</label>
                <input
                    type="text"
                    value={days}
                    onChange={handleDaysChange}
                    placeholder="Ex. 3"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
            </div>

            <div className="mb-4 text-left">
                <label className="block text-sm font-medium text-gray-700">What is Your Budget?</label>
                <div className="flex justify-between mt-2">
                    <button
                        type="button"
                        onClick={() => handleBudgetChange('Cheap')}
                        className={`p-4 rounded-md border ${budget === 'Cheap' ? 'border-blue-500 bg-blue-100' : 'border-gray-300'} flex flex-col items-center`}
                    >
                        <span role="img" aria-label="money-bag">💵</span>
                        <span className="text-xs">Cheap</span>
                        <span className="text-xs">Few or no frills</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => handleBudgetChange('Moderate')}
                        className={`p-4 rounded-md border ${budget === 'Moderate' ? 'border-blue-500 bg-blue-100' : 'border-gray-300'} flex flex-col items-center`}
                    >
                        <span role="img" aria-label="money-with-wings">💸</span>
                        <span className="text-xs">Moderate</span>
                        <span className="text-xs">Keep cost in the average side</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => handleBudgetChange('Luxury')}
                        className={`p-4 rounded-md border ${budget === 'Luxury' ? 'border-blue-500 bg-blue-100' : 'border-gray-300'} flex flex-col items-center`}
                    >
                        <span role="img" aria-label="money-bag">💰</span>
                        <span className="text-xs">Luxury</span>
                        <span className="text-xs">Don't worry about cost</span>
                    </button>
                </div>
            </div>

            <div className="mb-4 text-left">
                <label className="block text-sm font-medium text-gray-700">Who do you plan on traveling with on your next adventure?</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                    <button
                        type="button"
                        onClick={() => handleTravelWithChange('Just Me')}
                        className={`p-4 rounded-md border ${travelWith === 'Just Me' ? 'border-blue-500 bg-blue-100' : 'border-gray-300'} flex flex-col items-center`}
                    >
                        <span role="img" aria-label="person">👤👤</span>
                        <span className="text-xs">Just Me</span>
                        <span className="text-xs">Solo travels in exploration</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => handleTravelWithChange('A Couple')}
                        className={`p-4 rounded-md border ${travelWith === 'A Couple' ? 'border-blue-500 bg-blue-100' : 'border-gray-300'} flex flex-col items-center`}
                    >
                        <span role="img" aria-label="couple">👩‍❤️‍👨</span>
                        <span className="text-xs">A Couple</span>
                        <span className="text-xs">Romantic getaway</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => handleTravelWithChange('Family')}
                        className={`p-4 rounded-md border ${travelWith === 'Family' ? 'border-blue-500 bg-blue-100' : 'border-gray-300'} flex flex-col items-center`}
                    >
                        <span role="img" aria-label="family">👪</span>
                        <span className="text-xs">Family</span>
                        <span className="text-xs">A week of fun feeling ady</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => handleTravelWithChange('Friends')}
                        className={`p-4 rounded-md border ${travelWith === 'Friends' ? 'border-blue-500 bg-blue-100' : 'border-gray-300'} flex flex-col items-center`}
                    >
                        <span role="img" aria-label="friends">👯‍♂️</span>
                        <span className="text-xs">Friends</span>
                        <span className="text-xs">A bunch of all thrill seekers</span>
                    </button>
                </div>
            </div>

            <div className="text-center">
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
                    Generate Trip
                </button>
            </div>
        </form>
    );
}

export default PreferencesForm;