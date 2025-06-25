// Path: wellness-tracker/backend/models/Habit.js

const mongoose = require('mongoose');

const HabitSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId, // This links the habit to a User
            required: true,
            ref: 'User', // References the 'User' model
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: false, // Description is optional
            trim: true,
        },
        frequency: {
            type: String, // e.g., 'daily', 'weekly', 'monthly'
            enum: ['daily', 'weekly', 'monthly'], // Only allows these values
            default: 'daily',
            required: true,
        },
        targetCount: { // e.g., for 'drink water', target 8 glasses/day
            type: Number,
            required: false,
            default: 1,
        },
        completedDates: [ // Array to store dates when habit was completed
            {
                date: {
                    type: Date,
                    required: true,
                },
                count: { // How many times completed on that date (for targetCount habits)
                    type: Number,
                    default: 1,
                },
            },
        ],
    },
    {
        timestamps: true, // Adds createdAt and updatedAt timestamps automatically
    }
);

module.exports = mongoose.model('Habit', HabitSchema);