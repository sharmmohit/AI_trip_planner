import React from 'react';
import { useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function TripSuggestion() {
    const location = useLocation();
    const tripData = location.state;

    return (
        <div className="p-8">
            <h2 className="text-3xl font-semibold mb-6">Trip Suggestion</h2>
            {tripData ? (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {tripData.map((day) => (
                        <div key={day.day} className="bg-white rounded-lg shadow-md overflow-hidden">
                            {day.imageUrl && (
                                <div className="relative h-48">
                                    <img
                                        src={day.imageUrl}
                                        alt={day.location}
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            <div className="p-4">
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                    Day {day.day}: {day.location}
                                </h3>
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        p: ({ node, ...props }) => <p className="text-gray-700" {...props} />,
                                        ul: ({ node, ...props }) => <ul className="list-disc pl-5 text-gray-700" {...props} />,
                                        li: ({ node, ...props }) => <li className="mb-2" {...props} />,
                                        // Add more overrides for other elements as needed (h1, h2, etc.)
                                    }}
                                >
                                    {`**${day.location}**\n\n${day.activities.map(act => `- ${act.description}`).join('\n')}`}
                                </ReactMarkdown>
                            </div>
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