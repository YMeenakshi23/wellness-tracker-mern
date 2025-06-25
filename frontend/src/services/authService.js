// Path: wellness-tracker/frontend/src/services/authService.js

import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users/';

// Register user
const register = async (userData) => {
    const response = await axios.post(API_URL + 'register', userData);
    if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

// Login user
const login = async (userData) => {
    const response = await axios.post(API_URL + 'login', userData);
    if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

// Logout user
const logout = () => {
    localStorage.removeItem('user');
};

// --- NEW: Password Reset Functions ---

// Request OTP for password reset
const requestPasswordResetOtp = async (email) => {
    const response = await axios.post(API_URL + 'forgotpassword', { email });
    return response.data;
};

// Verify OTP and get a temporary password reset access token
const verifyOtpAndGetAccessToken = async (email, otp) => {
    const response = await axios.post(API_URL + 'verify-otp', { email, otp });
    return response.data; // This will contain passwordResetAccessTkn
};

// Reset password using the temporary access token
const resetPassword = async (passwordResetAccessTkn, password, confirmPassword) => {
    const response = await axios.put(API_URL + 'resetpassword', { passwordResetAccessTkn, password, confirmPassword });
    return response.data;
};

// --- END NEW ---

const authService = {
    register,
    login,
    logout,
    requestPasswordResetOtp, // Add to exported service
    verifyOtpAndGetAccessToken, // Add to exported service
    resetPassword, // Add to exported service
};

export default authService;