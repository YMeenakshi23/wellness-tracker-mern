// Path: wellness-tracker/backend/routes/habitRoutes.js

const express = require('express');
const { protect } = require('../middleware/authMiddleWare'); // Import our auth middleware
const Habit = require('../models/Habit'); // Import the Habit model

const router = express.Router();

// @route   POST /api/habits
// @desc    Create a new habit
// @access  Private
router.post('/', protect, async (req, res) => {
    const { name, description, frequency, targetCount } = req.body;

    if (!name || !frequency) {
        return res.status(400).json({ message: 'Please include at least a name and frequency for the habit.' });
    }

    try {
        const habit = await Habit.create({
            user: req.user._id, // Link habit to the logged-in user (from req.user set by 'protect' middleware)
            name,
            description,
            frequency,
            targetCount,
        });
        res.status(201).json(habit); // Send back the created habit
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

// @route   GET /api/habits
// @desc    Get all habits for the logged-in user
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        // Find habits belonging ONLY to the authenticated user
        const habits = await Habit.find({ user: req.user._id }).sort({ createdAt: -1 }); // Sort by creation date, newest first
        res.status(200).json(habits);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

// @route   PUT /api/habits/:id
// @desc    Update a specific habit
// @access  Private
router.put('/:id', protect, async (req, res) => {
    const { name, description, frequency, targetCount } = req.body;

    try {
        let habit = await Habit.findById(req.params.id); // Find the habit by ID from URL params

        // Check if habit exists
        if (!habit) {
            return res.status(404).json({ message: 'Habit not found' });
        }

        // Make sure the logged-in user owns the habit
        // We compare the habit's user ID (as a string) with the authenticated user's ID (as a string)
        if (habit.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to update this habit' });
        }

        // Update the habit document
        habit = await Habit.findByIdAndUpdate(
            req.params.id,
            { name, description, frequency, targetCount },
            { new: true, runValidators: true } // 'new: true' returns the updated document; 'runValidators: true' ensures schema validators run on update
        );
        res.status(200).json(habit); // Send back the updated habit
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

// @route   DELETE /api/habits/:id
// @desc    Delete a specific habit
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const habit = await Habit.findById(req.params.id); // Find the habit by ID

        // Check if habit exists
        if (!habit) {
            return res.status(404).json({ message: 'Habit not found' });
        }

        // Make sure the logged-in user owns the habit
        if (habit.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to delete this habit' });
        }

        await Habit.deleteOne({ _id: req.params.id }); // Delete the habit document
        res.status(200).json({ message: 'Habit removed successfully' }); // Send success message
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

// @route   PUT /api/habits/:id/complete
// @desc    Mark a habit as completed for the current date
// @access  Private
router.put('/:id/complete', protect, async (req, res) => {
    try {
        let habit = await Habit.findById(req.params.id); // Find the habit by ID

        // Check if habit exists
        if (!habit) {
            return res.status(404).json({ message: 'Habit not found' });
        }

        // Make sure the logged-in user owns the habit
        if (habit.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to complete this habit' });
        }

        const today = new Date();
        // Set hours, minutes, seconds, milliseconds to 0 for consistent date comparison
        today.setHours(0, 0, 0, 0);

        // Check if the habit was already marked complete for today
        const alreadyCompletedToday = habit.completedDates.some(
            (completion) => completion.date.toISOString().slice(0, 10) === today.toISOString().slice(0, 10)
        );

        if (alreadyCompletedToday) {
            // If already completed, update the count or just acknowledge
            const updatedHabit = await Habit.findOneAndUpdate(
                { _id: req.params.id, "completedDates.date": today },
                { $inc: { "completedDates.$.count": 1 } }, // Increment count for today's entry
                { new: true }
            );
            return res.status(200).json(updatedHabit);
        } else {
            // Add today's date to completedDates array
            const updatedHabit = await Habit.findByIdAndUpdate(
                req.params.id,
                { $push: { completedDates: { date: today, count: 1 } } }, // Push a new completion entry
                { new: true }
            );
            return res.status(200).json(updatedHabit);
        }

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;