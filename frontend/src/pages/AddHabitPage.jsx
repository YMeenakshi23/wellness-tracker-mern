// Path: wellness-tracker/frontend/src/pages/AddHabitPage.jsx

import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext.jsx';
import HabitForm from '../components/HabitForm.jsx'; // <<< IMPORTANT: Make sure this path is correct with 'Components'
import habitService from '../services/habitService';

function AddHabitPage() {
    const { user, loading, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    // Redirect if not logged in
    useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
        }
    }, [user, loading, navigate]);

    const handleAddHabit = async (habitData) => {
        try {
            await habitService.createHabit(habitData, user.token);
            alert('Habit added successfully!');
            navigate('/my-habits'); // Redirect to My Habits page after adding
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to add habit');
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                logout(); // Log out if token is invalid
            }
        }
    };

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>;
    }

    if (!user) { // Should be handled by useEffect, but a fallback
        return null;
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '900px', margin: '3rem auto', background: '#fff', borderRadius: '1.2rem', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)' }}>
            <h2 style={{ textAlign: 'center', fontSize: '2.5rem', fontWeight: 'bold', color: '#6366f1', marginBottom: '2.5rem' }}>Add a New Habit</h2>
            <HabitForm onSubmit={handleAddHabit} />
        </div>
    );
}

export default AddHabitPage;