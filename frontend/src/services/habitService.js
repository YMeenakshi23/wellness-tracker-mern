// Path: wellness-tracker/frontend/src/services/habitService.js

import axios from 'axios';

const API_URL = 'http://localhost:5000/api/habits/'; // Backend Habit API base URL

// Helper to set config with auth token
const getConfig = (token) => ({
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Include JWT token for protected routes
    },
});

// Create new habit
const createHabit = async (habitData, token) => {
    const response = await axios.post(API_URL, habitData, getConfig(token));
    return response.data;
};

// Get all habits for a user
const getHabits = async (token) => {
    const response = await axios.get(API_URL, getConfig(token));
    return response.data;
};

// Update a habit
const updateHabit = async (id, habitData, token) => {
    const response = await axios.put(API_URL + id, habitData, getConfig(token));
    return response.data;
};

// Delete a habit
const deleteHabit = async (id, token) => {
    const response = await axios.delete(API_URL + id, getConfig(token));
    return response.data;
};

// Mark habit as complete for today
const completeHabit = async (id, token) => {
    const response = await axios.put(API_URL + id + '/complete', {}, getConfig(token));
    return response.data;
};

const habitService = {
    createHabit,
    getHabits,
    updateHabit,
    deleteHabit,
    completeHabit,
};

export default habitService;