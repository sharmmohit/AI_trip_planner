const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
const port = 5000;

app.use(express.json());

// Enhanced image fetching with error handling
async function fetchImage(keyword) {
    const apiKey = process.env.UNSPLASH_API_KEY;
    const defaultImage = `https://source.unsplash.com/random/800x600/?${encodeURIComponent(keyword)},city,tourism`;
    
    if (!apiKey) {
        console.warn("Unsplash API key not found. Using placeholder images.");
        return defaultImage;
    }

    try {
        const response = await axios.get('https://api.unsplash.com/search/photos', {
            params: {
                query: keyword,
                per_page: 1,
                orientation: 'landscape'
            },
            headers: {
                'Authorization': `Client-ID ${apiKey}`
            }
        });

        if (response.data.results?.length > 0) {
            return response.data.results[0].urls.regular;
        }
        return defaultImage;
    } catch (error) {
        console.error('Error fetching image:', error.message);
        return defaultImage;
    }
}

// Improved markdown parsing
function parseActivitySection(sectionContent) {
    if (!sectionContent) return [];
    
    const activities = [];
    const activityRegex = /^- \[(.+?)\] - \[(.+?)\]: (.+?)(?:\. (.+?))?(?=\n-|$)/gm;
    
    let match;
    while ((match = activityRegex.exec(sectionContent)) !== null) {
        activities.push({
            time: `${match[1]} - ${match[2]}`,
            description: match[3],
            note: match[4] || ''
        });
    }
    return activities;
}

// Enhanced day parsing
async function parseTripDays(markdownText) {
    const days = [];
    const dayRegex = /### Day (\d+): (.+?)\n([\s\S]+?)(?=### Day|\n\n$)/g;
    
    let dayMatch;
    while ((dayMatch = dayRegex.exec(markdownText)) !== null) {
        const dayNumber = parseInt(dayMatch[1]);
        const location = dayMatch[2];
        const dayContent = dayMatch[3];
        
        // Extract image keyword if available
        const imageKeywordMatch = /\(Image Keyword: (.+?)\)/.exec(dayContent);
        const imageKeyword = imageKeywordMatch ? imageKeywordMatch[1].trim() : location;
        
        // Parse activities by time
        const morningRegex = /\*\*Morning:\*\*\n([\s\S]+?)(?=\n\n\*\*Afternoon:|\n\n\*\*Evening:|\n\n\*\*Budget Notes)/;
        const afternoonRegex = /\*\*Afternoon:\*\*\n([\s\S]+?)(?=\n\n\*\*Evening:|\n\n\*\*Budget Notes)/;
        const eveningRegex = /\*\*Evening:\*\*\n([\s\S]+?)(?=\n\n\*\*Budget Notes|\n\n\*\*Optional Activities)/;
        
        const morningContent = morningRegex.exec(dayContent)?.[1] || '';
        const afternoonContent = afternoonRegex.exec(dayContent)?.[1] || '';
        const eveningContent = eveningRegex.exec(dayContent)?.[1] || '';
        
        const imageUrl = await fetchImage(imageKeyword);
        
        days.push({
            day: dayNumber,
            location,
            overview: extractDayOverview(dayContent),
            activities: {
                morning: parseActivitySection(morningContent),
                afternoon: parseActivitySection(afternoonContent),
                evening: parseActivitySection(eveningContent)
            },
            notes: extractDayNotes(dayContent),
            imageUrl
        });
    }
    
    return days;
}

function extractDayOverview(dayContent) {
    const overviewRegex = /\*\*Day Overview:\*\*\n(.+?)\n\n/s;
    const match = overviewRegex.exec(dayContent);
    return match ? match[1].trim() : null;
}

function extractDayNotes(dayContent) {
    const notesRegex = /\*\*Optional Activities\/Notes:\*\*\n([\s\S]+?)(?=\n\n###|\n\n$)/;
    const match = notesRegex.exec(dayContent);
    return match ? match[1].trim() : null;
}

app.post('/generate-trip', async (req, res) => {
    const { destination, days, budget, travelWith } = req.body;

    try {
        const prompt = `Generate a detailed trip itinerary for ${days} days in ${destination} with a ${budget} budget, traveling with ${travelWith}.

**Overall Trip Summary:**
* Destination: ${destination}
* Duration: ${days} days
* Budget: ${budget}
* Traveling with: ${travelWith}
* Travel Style: (Describe the travel style based on budget and companions)
* Transportation: (Primary transport modes)
* Accommodation: (Suggested lodging types)
* Currency: (Local currency)
* Key Focus: (Main highlights of the trip)

**Itinerary:**

For each day, provide the following structure:

### Day [Number]: [Location/Theme]

**Day Overview:**
[1-2 paragraph overview of the day's theme and highlights]

**Morning:**
- [Start Time] - [End Time]: [Activity]. [Detailed description]. [Additional notes/tips].
- [Start Time] - [End Time]: [Activity]. [Detailed description]. [Additional notes/tips].

**Afternoon:**
- [Start Time] - [End Time]: [Activity]. [Detailed description]. [Additional notes/tips].
- [Start Time] - [End Time]: [Activity]. [Detailed description]. [Additional notes/tips].

**Evening:**
- [Start Time] - [End Time]: [Activity/Dinner]. [Detailed description]. [Additional notes/tips].

**Budget Notes for the Day:**
[Specific budget considerations]

**Optional Activities/Notes:**
[Alternative options or important information]

(Image Keyword: [Relevant keyword for day's image])
`;

        const response = await axios.post(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
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

        const tripSummary = response.data.candidates[0].content.parts[0].text;
        const tripData = await parseTripDays(tripSummary);

        res.json(tripData);

    } catch (error) {
        console.error('Error generating trip:', error.response ? error.response.data : error.message);
        res.status(500).json({ 
            error: 'Failed to generate trip.',
            details: error.response?.data || error.message 
        });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});