// Path: wellness-tracker/backend/routes/userRoutes.js

const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleWare'); // Using your specific casing for the folder and file
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const router = express.Router();

// Helper function to generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
};

// Helper to send email
const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false, // Use 'true' if port is 465, 'false' if port is 587 (TLS)
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: options.email,
        subject: options.subject,
        html: options.message,
    };

    await transporter.sendMail(mailOptions);
};

// @route   POST /api/users/register
// @desc    Register new user
// @access  Public
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
            password, // Password will be hashed by the pre-save hook in the model
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

// @route   POST /api/users/login
// @desc    Authenticate user & get token
// @access  Public
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

// @route   GET /api/users/profile
// @desc    Get user profile (protected route)
// @access  Private
router.get('/profile', protect, async (req, res) => {
    res.json({
        _id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        // The message below comes from the backend's default profile route in our early setup
        message: 'You have accessed a protected route!',
    });
});

// @route   POST /api/users/forgotpassword
// @desc    Request OTP for password reset (send email with OTP)
// @access  Public
router.post('/forgotpassword', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User with that email does not exist' });
        }

        const otp = user.getOtp(); // Custom method on User model

        console.log(`Sending OTP [${otp}] to: ${user.email}`);

        await user.save({ validateBeforeSave: false }); // Save user with new OTP and expiry

        const message = `
            <h1>Your One-Time Password (OTP) for Wellness Tracker</h1>
            <p>Your OTP is: <strong>${otp}</strong></p>
            <p>This OTP is valid for 5 minutes.</p>
            <p>Please enter this OTP on the password reset page to verify your identity.</p>
            <p>If you did not request this, please ignore this email.</p>
        `;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Wellness Tracker Password Reset OTP',
                message,
            });

            res.status(200).json({ success: true, message: 'OTP sent to your email' });

        } catch (error) {
            user.otp = undefined;
            user.otpExpire = undefined;
            await user.save({ validateBeforeSave: false }); // Clear OTP if email fails

            console.error('OTP Email send error:', error);
            return res.status(500).json({ message: 'OTP email could not be sent' });
        }

    } catch (error) {
        console.error('Forgot password OTP error:', error);
        res.status(500).send('Server error');
    }
});

// @route   POST /api/users/verify-otp
// @desc    Verify OTP and provide temporary password reset access token
// @access  Public
router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;

    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

    try {
        const user = await User.findOne({
            email,
            otp: hashedOtp,
            otpExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired OTP for this email' });
        }

        const passwordResetAccessTkn = user.getPasswordResetAccessTkn();

        user.otp = undefined;
        user.otpExpire = undefined;

        await user.save({ validateBeforeSave: false });

        res.status(200).json({
            success: true,
            message: 'OTP verified. Proceed to set new password.',
            passwordResetAccessTkn,
        });

    } catch (error) {
        console.error('OTP verification error:', error);
        res.status(500).send('Server error');
    }
});

// @route   PUT /api/users/resetpassword
// @desc    Reset user password using the temporary access token
// @access  Public (token provides access)
router.put('/resetpassword', async (req, res) => {
    const { password, confirmPassword, passwordResetAccessTkn } = req.body;

    const hashedAccessTkn = crypto
        .createHash('sha256')
        .update(passwordResetAccessTkn)
        .digest('hex');

    try {
        const user = await User.findOne({
            passwordResetAccessTkn: hashedAccessTkn,
            passwordResetAccessTknExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired password reset access token' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        user.password = password; // Mongoose pre-save hook will hash this
        user.passwordResetAccessTkn = undefined;
        user.passwordResetAccessTknExpire = undefined;
        user.otp = undefined;
        user.otpExpire = undefined;

        await user.save();

        res.status(200).json({ success: true, message: 'Password reset successful' });

    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;