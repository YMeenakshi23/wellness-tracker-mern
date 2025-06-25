// Path: wellness-tracker/frontend/src/Components/LifetimeMentorshipPurchase.jsx

import React, { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext.jsx';
import paymentService from '../services/paymentService';

// Ensure this matches the amount in your backend paymentRoutes.js (e.g., 9999 for Rs. 99.99)
const LIFETIME_MENTORSHIP_AMOUNT_PAISA = 9999; 

function LifetimeMentorshipPurchase({ onPurchaseSuccess }) {
    const { user, logout } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Function to load the Razorpay script (though it's loaded in index.html, this ensures window.Razorpay is available)
    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            // Check if Razorpay is already loaded, otherwise assume it's loaded by the script in index.html
            if (window.Razorpay) {
                resolve(true);
            } else {
                // Fallback or error if script not loaded, though index.html should cover this
                console.error("Razorpay script not loaded.");
                resolve(false);
            }
        });
    };

    const handlePurchase = async () => {
        if (!user || !user.token) {
            setError('You must be logged in to make a purchase.');
            logout(); // Log out if somehow not logged in but trying to purchase
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // 1. Load Razorpay script (just a check, should be loaded by index.html)
            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                setError('Razorpay SDK failed to load.');
                setLoading(false);
                return;
            }

            // 2. Call backend to create an order
            const orderData = await paymentService.createRazorpayOrder(
                LIFETIME_MENTORSHIP_AMOUNT_PAISA,
                user.token
            );

            const options = {
                key: orderData.key_id, // Your Razorpay Key ID
                amount: orderData.amount, // Amount in paisa
                currency: orderData.currency,
                name: 'Wellness Tracker',
                description: 'Lifetime Health & Well-being Mentorship',
                image: 'https://example.com/your_logo.png', // Replace with your logo URL
                order_id: orderData.orderId, // Order ID from the backend
                handler: async function (response) {
                    // This function is called when payment is successful
                    setLoading(true); // Re-show loading for verification
                    try {
                        const verificationResult = await paymentService.verifyRazorpayPayment(
                            {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                            },
                            user.token
                        );
                        alert(verificationResult.message);
                        if (onPurchaseSuccess) {
                            onPurchaseSuccess(); // Notify parent component (Dashboard) to refresh user data
                        }
                    } catch (verificationError) {
                        console.error('Payment verification failed:', verificationError);
                        alert(verificationError.response?.data?.message || 'Payment verification failed.');
                        setError(verificationError.response?.data?.message || 'Payment verification failed.');
                    } finally {
                        setLoading(false);
                    }
                },
                prefill: {
                    name: user.username,
                    email: user.email,
                    contact: '', // Optional: prefill user's phone number
                },
                notes: {
                    userId: user._id, // Pass user ID as a note to Razorpay
                    purpose: 'Lifetime Mentorship',
                },
                theme: {
                    color: '#6366f1', // Primary brand color
                },
            };

            const rzp = new window.Razorpay(options); // Initialize Razorpay checkout
            rzp.on('payment.failed', function (response) {
                console.error('Payment failed:', response.error);
                alert(`Payment Failed: ${response.error.description}`);
                setError(response.error.description || 'Payment failed.');
            });
            rzp.open(); // Open the Razorpay payment modal

        } catch (err) {
            console.error('Purchase process error:', err);
            setError(err.response?.data?.message || 'Failed to initiate purchase.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            background: '#f8faff',
            padding: '2rem',
            borderRadius: '1rem',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            textAlign: 'center',
            marginTop: '3rem',
            border: '1px solid #e0e7ef',
        }}>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#6366f1', marginBottom: '1.5rem' }}>
                Unlock Lifetime Mentorship!
            </h3>
            <p style={{ fontSize: '1.1rem', color: '#64748b', marginBottom: '1.5rem' }}>
                Get exclusive, personalized health and well-being guidance for life for just ₹{LIFETIME_MENTORSHIP_AMOUNT_PAISA / 100}!
            </p>
            <button
                onClick={handlePurchase}
                disabled={loading}
                style={{
                    padding: '1rem 2.5rem',
                    background: '#007bff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'background 0.3s ease',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                }}
                onMouseEnter={(e) => e.target.style.background = '#0056b3'}
                onMouseLeave={(e) => e.target.style.background = '#007bff'}
            >
                {loading ? 'Processing...' : `Purchase Now (₹${LIFETIME_MENTORSHIP_AMOUNT_PAISA / 100})`}
            </button>
            {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
        </div>
    );
}

export default LifetimeMentorshipPurchase;