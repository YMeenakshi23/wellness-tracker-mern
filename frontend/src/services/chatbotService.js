import axios from 'axios';

const API_URL = 'http://localhost:5000/api/chatbot/'; // Backend chatbot API base URL

const sendMessage = async (message, chatHistory, token) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Send the user's JWT token for authentication
        },
    };

    const response = await axios.post(
        API_URL + 'chat',
        { message, chatHistory }, // Send the current message and previous chat history
        config
    );
    return response.data; // Returns the AI's response
};

const chatbotService = {
    sendMessage,
};

export default chatbotService;