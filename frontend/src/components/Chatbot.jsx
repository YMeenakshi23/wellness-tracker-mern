// Path: wellness-tracker/frontend/src/Components/Chatbot.jsx

import React, { useState, useContext, useEffect, useRef } from 'react';
import chatbotService from '../services/chatbotService';
import AuthContext from '../context/AuthContext.jsx';

function Chatbot() {
    const [input, setInput] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    const { user } = useContext(AuthContext);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (messagesEndRef.current && isOpen) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chatHistory, isOpen]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (input.trim() === '' || !user || !user.token) {
            return;
        }

        const userMessage = { role: 'user', parts: [{ text: input }] };
        const newChatHistory = [...chatHistory, userMessage];
        setChatHistory(newChatHistory);
        setInput('');
        setLoading(true);
        setError(null);

        try {
            const aiResponse = await chatbotService.sendMessage(input, newChatHistory, user.token);
            setChatHistory(prevHistory => [...prevHistory, aiResponse]);
        } catch (err) {
            console.error("Error sending message to AI:", err);
            setError(err.message || 'Failed to get response from AI Coach.');
            setChatHistory(prevHistory => [...prevHistory, { role: 'model', parts: [{ text: 'Error: Could not get response.' }] }]);
        } finally {
            setLoading(false);
        }
    };

    const toggleChat = () => {
        setIsOpen(prev => !prev);
        if (!isOpen) {
            setTimeout(() => {
                if (messagesEndRef.current) {
                    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
        }}>
            {!isOpen && (
                <div style={{
                    marginBottom: '10px',
                    padding: '10px 15px',
                    background: '#007bff',
                    color: '#fff',
                    borderRadius: '8px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    maxWidth: '200px',
                    textAlign: 'center',
                }} onClick={toggleChat}>
                    Need a wellness tip? Chat with AI!
                </div>
            )}

            {/* This is the single toggle button for the whole chat widget */}
            <button
                onClick={toggleChat}
                style={{
                    background: '#007bff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50%',
                    width: '60px',
                    height: '60px',
                    fontSize: '2rem',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                    transition: 'background 0.3s ease',
                }}
            >
                {isOpen ? '✖' : '💬'}
            </button>

            {isOpen && (
                <div style={{
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '500px',
                    width: '350px',
                    background: '#fff',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                    marginTop: '15px',
                    transformOrigin: 'bottom right',
                    animation: 'fadeInUp 0.3s ease-out',
                }}>
                    <div style={{
                        background: '#007bff',
                        color: '#fff',
                        padding: '1rem',
                        borderTopLeftRadius: '8px',
                        borderTopRightRadius: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '1.1rem',
                    }}>
                        <span>AI Coach</span>
                        {/* REMOVED: The close button inside the header */}
                        {/* The main floating button now closes the chat */}
                    </div>
                    <div style={{ flexGrow: 1, overflowY: 'auto', padding: '0.5rem', background: '#f9f9f9', borderRadius: '4px 4px 0 0' }}>
                        {chatHistory.length === 0 && !loading && (
                            <p style={{ textAlign: 'center', color: '#666', fontStyle: 'italic', padding: '1rem' }}>
                                Hi there! How can I help you today?
                            </p>
                        )}
                        {chatHistory.map((msg, index) => (
                            <div key={index} style={{
                                marginBottom: '0.5rem',
                                textAlign: msg.role === 'user' ? 'right' : 'left',
                            }}>
                                <span style={{
                                    display: 'inline-block',
                                    padding: '0.6rem 1rem',
                                    borderRadius: '15px',
                                    background: msg.role === 'user' ? '#007bff' : '#e0e0e0',
                                    color: msg.role === 'user' ? '#fff' : '#333',
                                    maxWidth: '80%',
                                    wordWrap: 'break-word',
                                    filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.1))'
                                }}>
                                    {msg.parts[0].text}
                                </span>
                            </div>
                        ))}
                        {loading && (
                            <div style={{ textAlign: 'center', margin: '1rem 0' }}>
                                <span style={{ color: '#007bff' }}>AI Coach is thinking...</span>
                            </div>
                        )}
                        {error && (
                            <div style={{ textAlign: 'center', color: 'red', margin: '1rem 0' }}>
                                {error}
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <form onSubmit={handleSendMessage} style={{ display: 'flex', padding: '0.8rem', background: '#eee', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px' }}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message..."
                            style={{ flexGrow: 1, padding: '0.8rem', borderRadius: '4px', border: '1px solid #ddd', marginRight: '0.5rem' }}
                            disabled={loading}
                        />
                        <button type="submit" disabled={loading} style={{ padding: '0.8rem 1.2rem', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            Send
                        </button>
                    </form>
                </div>
            )}
            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
            `}</style>
        </div>
    );
}

export default Chatbot;