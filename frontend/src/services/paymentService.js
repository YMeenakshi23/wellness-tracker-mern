
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/payment/'; // Backend Payment API base URL

// Helper to set config with auth token
const getConfig = (token) => ({
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Include JWT token for protected routes
    },
});

// Call backend to create a Razorpay Order
const createRazorpayOrder = async (amountInPaisa, token) => {
    const response = await axios.post(API_URL + 'create-order', { amount: amountInPaisa }, getConfig(token));
    return response.data; // Should return { orderId, currency, amount, key_id }
};

// Call backend to verify the payment after Razorpay checkout success
const verifyRazorpayPayment = async (verificationData, token) => {
    const response = await axios.post(API_URL + 'verify-payment', verificationData, getConfig(token));
    return response.data; // Should return success message
};

const paymentService = {
    createRazorpayOrder,
    verifyRazorpayPayment,
};

export default paymentService;