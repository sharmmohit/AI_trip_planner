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

    try {
        const prompt = `Generate a trip summary for ${days} days in ${destination} with a ${budget} budget, traveling with ${travelWith}. Include some popular attractions and activities for each day.`;

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
                    'x-goog-api-key': process.env.GEMINI_API_KEY, // Use x-goog-api-key for Gemini
                },
            }
        );

        const tripSummary = response.data.candidates[0].content.parts[0].text;
        res.json({ tripSummary });

    } catch (error) {
        console.error('Error generating trip:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to generate trip.' });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});