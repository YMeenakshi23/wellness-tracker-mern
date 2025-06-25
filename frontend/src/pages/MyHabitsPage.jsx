// Path: wellness-tracker/frontend/src/pages/MyHabitsPage.jsx

import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext.jsx';
import HabitList from '../components/HabitList.jsx';
import HabitForm from '../components/HabitForm.jsx';
import habitService from '../services/habitService';

function MyHabitsPage() {
    const { user, loading, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const [habits, setHabits] = useState([]);
    const [loadingHabits, setLoadingHabits] = useState(true);
    const [errorHabits, setErrorHabits] = useState(null);
    const [editingHabit, setEditingHabit] = useState(null);

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
        }
    }, [user, loading, navigate]);

    const fetchHabits = async () => {
        if (user && user.token) {
            try {
                setLoadingHabits(true);
                const userHabits = await habitService.getHabits(user.token);
                setHabits(userHabits);
            } catch (err) {
                setErrorHabits(err.response?.data?.message || 'Failed to fetch habits');
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    logout();
                }
            } finally {
                setLoadingHabits(false);
            }
        }
    };

    useEffect(() => {
        fetchHabits();
    }, [user, logout]);

    const handleUpdateHabit = async (habitData) => {
        try {
            await habitService.updateHabit(editingHabit._id, habitData, user.token);
            alert('Habit updated successfully!');
            fetchHabits();
            setEditingHabit(null);
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to update habit');
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                logout();
            }
        }
    };

    const handleDeleteHabit = async (id) => {
        if (window.confirm('Are you sure you want to delete this habit?')) { // Confirmation already here
            try {
                await habitService.deleteHabit(id, user.token);
                alert('Habit deleted successfully!');
                fetchHabits();
            } catch (error) {
                alert(error.response?.data?.message || 'Failed to delete habit');
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    logout();
                }
            }
        }
    };

    const handleCompleteHabit = async (id) => {
        // --- FIX: Add confirmation for Mark Complete ---
        if (window.confirm('Are you sure you want to mark this habit as complete for today?')) {
            try {
                await habitService.completeHabit(id, user.token);
                alert('Habit marked complete!');
                fetchHabits();
            } catch (error) {
                alert(error.response?.data?.message || 'Failed to mark habit complete');
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    logout();
                }
            }
        }
        // --- END FIX ---
    };

    const startEditingHabit = (habit) => {
        setEditingHabit(habit);
    };

    const cancelEditingHabit = () => {
        setEditingHabit(null);
    };

    if (loading || loadingHabits) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)' }}>
                <div style={{ fontSize: '2rem', color: '#6366f1', fontWeight: 600 }}>
                    Loading your habits...
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    if (errorHabits) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff1f2' }}>
                <div style={{ fontSize: '1.5rem', color: '#dc2626', fontWeight: 500 }}>
                    Error: {errorHabits}
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)',
            padding: '0',
            margin: '0',
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '3rem auto',
                background: 'rgba(255,255,255,0.95)',
                borderRadius: '2rem',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
                padding: '3rem 2.5rem 2.5rem 2.5rem',
                position: 'relative',
                overflow: 'hidden',
            }}>
                <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '180px', height: '180px', background: 'radial-gradient(circle, #6366f1 0%, #818cf8 100%)', opacity: 0.12, borderRadius: '50%', zIndex: 0 }} />
                <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '180px', height: '180px', background: 'radial-gradient(circle, #818cf8 0%, #6366f1 100%)', opacity: 0.10, borderRadius: '50%', zIndex: 0 }} />
                
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <h2 style={{ textAlign: 'center', fontSize: '2.5rem', fontWeight: 'bold', color: '#6366f1', marginBottom: '2.5rem' }}>Your Habits</h2>

                    {editingHabit && (
                        <div style={{ marginBottom: '2.5rem', padding: '1.5rem', background: '#f8faff', borderRadius: '1rem', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                            <HabitForm
                                onSubmit={handleUpdateHabit}
                                initialData={editingHabit}
                                onCancel={cancelEditingHabit}
                            />
                        </div>
                    )}

                    <HabitList
                        habits={habits}
                        onComplete={handleCompleteHabit}
                        onEdit={startEditingHabit}
                        onDelete={handleDeleteHabit}
                    />
                </div>
            </div>
        </div>
    );
}

export default MyHabitsPage;