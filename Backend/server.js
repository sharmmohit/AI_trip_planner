const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
const port = 5000;

app.use(express.json());

app.post('/generate-trip', async (req, res) => {
    const { destination, days, budget, travelWith } = req.body;

    console.log('Backend received request with:', req.body);

    try {
        const prompt = `Generate a detailed trip itinerary for ${days} days in ${destination} with a ${budget} budget, traveling with ${travelWith}. Include popular attractions and activities for each day. Format the output in Markdown with headings for each day and bullet points for activities.`;

        console.log('Sending prompt to Gemini:', prompt);

        const response = await axios.post(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
            {
                contents: [
                    {
                        parts: [
                            {
                                text: prompt,
                            },
                        ],
                    },
                ],
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': process.env.GEMINI_API_KEY,
                },
            }
        );

        console.log('Gemini API Response:', response.data);

        const tripSummaryText = response.data.candidates[0].content.parts[0].text;
        console.log('Parsed tripSummaryText:', tripSummaryText);

        const tripData = parseTripSummary(tripSummaryText);
        console.log('Parsed tripData:', tripData);

        console.log('Final tripData sent to frontend:', tripData);
        res.json(tripData);

    } catch (error) {
        console.error('Error generating trip:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to generate trip.' });
    }
});

function parseTripSummary(markdownText) {
    const days = [];
    const dayRegex = /^# Day (\d+): (.+)$/gm;
    const activityRegex = /^- \*\*([^:]+):\*\* ([^.]+)/gm; // Removed image keyword part
    let dayMatch;
    while ((dayMatch = dayRegex.exec(markdownText)) !== null) {
        const dayNumber = parseInt(dayMatch[1]);
        const location = dayMatch[2];
        const activities = [];
        let activityMatch;
        while ((activityMatch = activityRegex.exec(markdownText)) !== null) {
            activities.push({
                name: activityMatch[1],
                description: activityMatch[2],
            });
        }
        days.push({ day: dayNumber, location, activities });
    }
    return days;
}

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});