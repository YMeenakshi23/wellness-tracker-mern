// Path: wellness-tracker/backend/routes/chatbotRoutes.js

const express = require('express');
const { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } = require('@google/generative-ai');
const { protect } = require('../Middleware/authMiddleWare'); 

const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model =  genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

router.post('/chat', protect, async (req, res) => {
    const { message, chatHistory } = req.body;

    if (!message) {
        return res.status(400).json({ message: 'Message is required' });
    }

    try {
        const history = chatHistory || [];
        const formattedHistory = history.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.parts[0].text }]
        }));

        const chat = model.startChat({
            history: formattedHistory,
            generationConfig: {
                maxOutputTokens: 200,
            },
            safetySettings: [
                // <<< FIX 2: Corrected HarmCategory values with HARM_CATEGORY_ prefix
                { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.MEDIUM_AND_ABOVE },
                { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.MEDIUM_AND_ABOVE },
                { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.MEDIUM_AND_ABOVE },
                { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.MEDIUM_AND_ABOVE },
            ]
        });

        const result = await chat.sendMessage(message);
        const response = result.response;
        const text = response.text();

        res.json({ role: 'model', parts: [{ text }] });

    } catch (error) {
        console.error('Gemini API Error:', error);
        if (error.response && error.response.status === 400 && error.response.data && error.response.data.error.message.includes('safety')) {
            return res.status(400).json({ message: "Content violates safety policies.", safetyFeedback: error.response.data.error.details });
        }
        res.status(500).json({ message: 'Failed to get response from AI Coach. Please try again.' });
    }
});

module.exports = router;