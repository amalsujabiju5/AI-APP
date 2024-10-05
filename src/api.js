import axios from 'axios';

// Get API key from environment variables
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;


const openai = axios.create({
    baseURL: 'https://api.openai.com/v1/chat/completions',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
    },
});

// Function to get OpenAI response
export const getOpenAIResponse = async (prompt) => {
    try {
        // Make a POST request to the OpenAI chat completions endpoint
        const response = await openai.post('', {
            model: "gpt-3.5-turbo",  // Specify the correct model
            messages: [ // Correctly named and formatted 'messages' parameter
                { role: "user", content: prompt }
            ],
            max_tokens: 2000,
            temperature: 0.7,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });

        return response.data.choices[0].message.content;
    } catch (error) {
        // Handle and log errors
        console.error("Error communicating with OpenAI:", error.response ? error.response.data : error.message);
        throw error;  // Re-throw the error to handle it in the calling function
    }
};