// Path: wellness-tracker/backend/routes/userRoutes.js

const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleWare'); // Make sure this is imported

const router = express.Router();

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
};

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        user = await User.create({
            username,
            email,
            password,
        });

        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id),
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id),
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

// --- THIS IS THE MISSING ROUTE ---
// @route   GET /api/users/profile
// @desc    Get user profile (protected route)
// @access  Private
router.get('/profile', protect, async (req, res) => {
    // req.user is available here because the 'protect' middleware attached it
    res.json({
        _id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        message: 'You have accessed a protected route!', // This message comes from backend
    });
});
// --- END OF MISSING ROUTE ---

module.exports = router;