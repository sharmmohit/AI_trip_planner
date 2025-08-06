const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
const port = 5000;

app.use(express.json());

async function fetchImage(keyword) {
    const apiKey = process.env.UNSPLASH_API_KEY;
    if (!apiKey) {
        console.warn("Unsplash API key not found. Using placeholder images.");
        return `https://source.unsplash.com/random/800x600/?${encodeURIComponent(keyword)}`;
    }
    const apiUrl = `https://api.unsplash.com/search/photos?query=${keyword}&client_id=${apiKey}`;
    try {
        const response = await axios.get(apiUrl);
        const data = response.data;
        if (data.results && data.results.length > 0) {
            return data.results[0].urls.regular;
        }
        return `https://source.unsplash.com/random/800x600/?${encodeURIComponent(keyword)}`;
    } catch (error) {
        console.error('Error fetching image:', error);
        return `https://source.unsplash.com/random/800x600/?${encodeURIComponent(keyword)}`;
    }
}

function parseActivitySection(sectionContent) {
    const activities = [];
    const activityRegex = /^- \[(.+?)\] - \[(.+?)\]: (.+?)\. (.+?)\./gm;
    
    let match;
    while ((match = activityRegex.exec(sectionContent)) !== null) {
        activities.push({
            time: `${match[1]} - ${match[2]}`,
            description: match[3],
            note: match[4]
        });
    }
    return activities;
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

async function parseTripSummary(markdownText) {
    const days = [];
    const dayRegex = /### Day (\d+): (.+?)\n([\s\S]+?)(?=### Day|\n\n$)/g;
    const summaryRegex = /\*\*Overall Trip Summary:\*\*\n([\s\S]+?)\n\n\*\*Itinerary:\*\*/;
    
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
        
        const activities = {
            morning: parseActivitySection(morningContent),
            afternoon: parseActivitySection(afternoonContent),
            evening: parseActivitySection(eveningContent)
        };
        
        const imageUrl = await fetchImage(imageKeyword);
        
        days.push({
            day: dayNumber,
            location,
            overview: extractDayOverview(dayContent),
            activities,
            notes: extractDayNotes(dayContent),
            imageUrl
        });
    }
    
    // Extract overall trip summary
    const summaryMatch = summaryRegex.exec(markdownText);
    let summary = {
        destination: '',
        duration: `${days.length} days`,
        budget: '',
        travelers: ''
    };
    
    if (summaryMatch) {
        const summaryContent = summaryMatch[1];
        const destinationMatch = /Destination: (.+)/.exec(summaryContent);
        const budgetMatch = /Budget: (.+)/.exec(summaryContent);
        const travelersMatch = /Traveling with: (.+)/.exec(summaryContent);
        
        if (destinationMatch) summary.destination = destinationMatch[1];
        if (budgetMatch) summary.budget = budgetMatch[1];
        if (travelersMatch) summary.travelers = travelersMatch[1];
    }
    
    // Add summary to first day
    if (days.length > 0) {
        days[0].summary = summary;
    }
    
    return days;
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

        const tripSummary = response.data.candidates[0].content.parts[0].text;
        const tripData = await parseTripSummary(tripSummary);

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