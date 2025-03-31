const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
const port = 5000;

app.use(express.json());

async function fetchImage(keyword) {
    const apiKey = process.env.UNSPLASH_API_KEY; // Use environment variable for API key
    if (!apiKey) {
        console.warn("Unsplash API key not found in environment variables. Images will not be fetched.");
        return null;
    }
    const apiUrl = `https://api.unsplash.com/search/photos?query=${keyword}&client_id=${apiKey}`;
    try {
        const response = await axios.get(apiUrl);
        const data = response.data;
        if (data.results && data.results.length > 0) {
            return data.results[0].urls.small; // Or 'regular', 'full', etc.
        }
        return null;
    } catch (error) {
        console.error('Error fetching image:', error);
        return null;
    }
}

async function parseTripSummaryWithImages(markdownText) {
    const days = [];
    const dayRegex = /### Day (\d+): (.+)\n([\s\S]*?)(?:\(Image Keyword: (.+)\))?/gm;
    const activityRegex = /^- \[.+?\] - \[.+?\]: (.+?)\. (.+?)\./gm;

    let dayMatch;
    while ((dayMatch = dayRegex.exec(markdownText)) !== null) {
        const dayNumber = parseInt(dayMatch[1]);
        const location = dayMatch[2];
        const dayContent = dayMatch[3];
        const imageKeyword = dayMatch[4] ? dayMatch[4].trim() : location; // Default to location if no keyword

        const activities = [];
        let activityMatch;
        while ((activityMatch = activityRegex.exec(dayContent)) !== null) {
            activities.push({
                description: activityMatch[1].trim(),
            });
        }

        const imageUrl = await fetchImage(imageKeyword); // Await the image fetch

        days.push({ day: dayNumber, location, activities, imageUrl });
    }
    return days;
}

app.post('/generate-trip', async (req, res) => {
    const { destination, days, budget, travelWith } = req.body;

    try {
        const prompt = `Generate a well-organized trip itinerary for ${days} days in ${destination} with a ${budget} budget, traveling with ${travelWith}.

**Overall Trip Summary:**
* Budget: ${budget}
* Travel Style: (Briefly describe the travel style based on the budget and travel companions)
* Transportation: (Suggest primary modes of transport suitable for the budget and destination)
* Accommodation: (Suggest types of accommodation suitable for the budget and travel companions)
* Starting Point: (Assume a logical starting point if not explicitly mentioned)
* Currency: (Mention the currency of the destination)
* Key Focus: (Highlight the main focus of the trip)

**Itinerary:**

${days} Days in ${destination}

For each day, please provide the following information formatted as Markdown:

### Day [Day Number]: [Location/Theme of the Day]

**Morning:**
- [Start Time] - [End Time]: [Activity 1]. [Brief Description of Activity 1].
- [Start Time] - [End Time]: [Activity 2]. [Brief Description of Activity 2].

**Afternoon:**
- [Start Time] - [End Time]: [Activity 1]. [Brief Description of Activity 1].
- [Start Time] - [End Time]: [Activity 2]. [Brief Description of Activity 2].

**Evening:**
- [Start Time] - [End Time]: [Activity/Dinner Plan]. [Brief Description of Activity/Dinner].

**Budget Notes for the Day:** (Mention any specific budget considerations for the day)

**Optional Activities/Notes:** (Suggest alternative activities or important notes for the day)

**(Image Keyword: [A relevant keyword for an image to represent this day or location])**
`;

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
        const tripData = await parseTripSummaryWithImages(tripSummary); // Await the parsing

        res.json(tripData);

    } catch (error) {
        console.error('Error generating trip:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to generate trip.' });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});