// Path: wellness-tracker/backend/routes/paymentRoutes.js

const express = require('express');
const Razorpay = require('razorpay'); // Import Razorpay
const crypto = require('crypto'); // Node.js built-in module for cryptographic functions
const { protect } = require('../middleware/authMiddleWare'); // Your middleware (using your casing)
const User = require('../models/User'); // User model to update access

const router = express.Router();

// Initialize Razorpay instance
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Define the amount for lifetime mentorship (in paisa)
const LIFETIME_MENTORSHIP_AMOUNT = 9999; // Rs. 99.99 (amount in paisa, i.e., 100 * Rs. 99.99)
const CURRENCY = 'INR';

// @route   POST /api/payment/create-order
// @desc    Create a Razorpay Order for lifetime mentorship
// @access  Private (only logged-in users can initiate)
router.post('/create-order', protect, async (req, res) => {
    const user = req.user;

    try {
        // Check if user already has mentorship
        if (user.isLifetimeMentor) {
            return res.status(400).json({ message: 'You already have lifetime mentorship.' });
        }

        const options = {
            amount: LIFETIME_MENTORSHIP_AMOUNT, // amount in the smallest currency unit
            currency: CURRENCY,
            receipt: user._id.toString(), // FIX: Shortened receipt to just the user ID (max 40 chars)
            payment_capture: 1, // 1 for automatic capture
            notes: {
                userId: user._id.toString(), // Pass user ID as a note
                purpose: 'Lifetime Mentorship',
            },
        };

        const order = await razorpayInstance.orders.create(options);
        res.status(200).json({
            orderId: order.id,
            currency: order.currency,
            amount: order.amount,
            key_id: process.env.RAZORPAY_KEY_ID, // FIX: Correctly sending Key ID from .env
        });

    } catch (error) {
        console.error('Razorpay Create Order Error (FULL):', error); // FIX: Logging full error object
        res.status(500).json({ message: 'Failed to create Razorpay order.' });
    }
});

// @route   POST /api/payment/verify-payment
// @desc    Verify Razorpay payment signature and fulfill purchase
// @access  Private (frontend calls this after successful payment popup)
router.post('/verify-payment', protect, async (req, res) => {
    const user = req.user;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    try {
        // Generate HMAC-SHA256 signature
        const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
        hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`); // FIX: Corrected template literal syntax
        const generatedSignature = hmac.digest('hex');

        // Compare generated signature with the signature received from Razorpay
        if (generatedSignature === razorpay_signature) {
            // Payment is verified, now fulfill the purchase
            if (!user.isLifetimeMentor) {
                user.isLifetimeMentor = true;
                await user.save();
                console.log(`User ${user.username} (${user.email}) granted lifetime mentorship access.`); // FIX: Corrected template literal syntax
            }
            res.status(200).json({ message: 'Payment successful and mentorship granted!' });
        } else {
            res.status(400).json({ message: 'Payment verification failed: Invalid signature.' });
        }

    } catch (error) {
        console.error('Razorpay Verify Payment Error (FULL):', error); // FIX: Logging full error object
        res.status(500).json({ message: 'Failed to verify payment.' });
    }
});

module.exports = router;