const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto'); // Import crypto for hashing

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    isLifetimeMentor: {
        type: Boolean,
        default: false,
    },
    otp: String,                     // <<< CHANGED: For the One-Time Password (hashed)
    otpExpire: Date,                 // <<< CHANGED: Expiration for OTP
    passwordResetAccessTkn: String,  // <<< NEW: Temporary token for password reset access AFTER OTP verification
    passwordResetAccessTknExpire: Date, // <<< NEW: Expiration for passwordResetAccessTkn
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Hash password before saving the user
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare entered password with hashed password
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Method to generate and hash the numeric OTP
UserSchema.methods.getOtp = function() {
    // Generate a 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash the OTP before saving to database
    this.otp = crypto.createHash('sha256').update(otp).digest('hex');

    // Set OTP expire time (e.g., 5 minutes from now)
    this.otpExpire = Date.now() + 5 * 60 * 1000; // 5 minutes

    return otp; // Return the unhashed OTP to be sent in the email
};

// Method to generate and hash a temporary password reset access token
UserSchema.methods.getPasswordResetAccessTkn = function() {
    const accessToken = crypto.randomBytes(32).toString('hex'); // Generate a random string token

    // Hash the token
    this.passwordResetAccessTkn = crypto.createHash('sha256').update(accessToken).digest('hex');

    // Set token expire time (e.g., 10 minutes from now)
    this.passwordResetAccessTknExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    return accessToken; // Return the unhashed token to be sent to frontend
};

module.exports = mongoose.model('User', UserSchema);