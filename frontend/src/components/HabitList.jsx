// Path: wellness-tracker/frontend/src/Components/HabitList.jsx

import React from 'react';

function HabitList({ habits, onComplete, onEdit, onDelete }) {
    const isCompletedToday = (completedDates, frequency) => {
        if (!completedDates || completedDates.length === 0) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (frequency === 'daily') {
            return completedDates.some(
                (completion) => new Date(completion.date).toISOString().slice(0, 10) === today.toISOString().slice(0, 10)
            );
        }
        return completedDates.some(
            (completion) => new Date(completion.date).toISOString().slice(0, 10) === today.toISOString().slice(0, 10)
        );
    };

    if (!habits || habits.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '2rem', border: '1px dashed #ccc', borderRadius: '8px' }}>
                <p style={{ color: '#666' }}>No habits added yet. Start by adding a new habit above!</p>
            </div>
        );
    }

    return (
        <div style={{ marginTop: '2rem' }}>
            {/* REMOVED: The redundant h3 tag for "Your Habits" */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {habits.map((habit) => (
                    <div key={habit._id} style={{
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        padding: '1.2rem',
                        background: '#fff',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        height: 'auto'
                    }}>
                        <div>
                            <h4 style={{ margin: '0 0 0.5rem', color: '#333' }}>{habit.name}</h4>
                            {habit.description && <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.8rem' }}>{habit.description}</p>}
                            <p style={{ fontSize: '0.85rem', color: '#888' }}>Frequency: {habit.frequency}</p>
                            {habit.targetCount > 1 && (
                                <p style={{ fontSize: '0.85rem', color: '#888' }}>Target: {habit.targetCount} times</p>
                            )}
                            <p style={{ fontSize: '0.85rem', color: '#888', fontStyle: 'italic' }}>
                                Last Updated: {new Date(habit.updatedAt).toLocaleDateString()}
                            </p>
                            <p style={{ fontSize: '0.85rem', color: isCompletedToday(habit.completedDates, habit.frequency) ? '#28a745' : '#dc3545' }}>
                                Status: {isCompletedToday(habit.completedDates, habit.frequency) ? 'Completed Today!' : 'Not yet today'}
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                            <button
                                onClick={() => onComplete(habit._id)}
                                disabled={isCompletedToday(habit.completedDates, habit.frequency)}
                                style={{
                                    flex: 1,
                                    padding: '0.6rem 0.8rem',
                                    background: isCompletedToday(habit.completedDates, habit.frequency) ? '#cccccc' : '#007bff',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: isCompletedToday(habit.completedDates, habit.frequency) ? 'not-allowed' : 'pointer',
                                    fontSize: '0.85rem'
                                }}
                            >
                                {isCompletedToday(habit.completedDates, habit.frequency) ? 'Done Today!' : 'Mark Complete'}
                            </button>
                            
                            {!isCompletedToday(habit.completedDates, habit.frequency) && (
                                <button
                                    onClick={() => onEdit(habit)}
                                    style={{
                                        flex: 0.5,
                                        padding: '0.6rem 0.8rem',
                                        background: '#ffc107',
                                        color: '#333',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '0.85rem'
                                    }}
                                >
                                    Edit
                                </button>
                            )}

                            <button
                                onClick={() => onDelete(habit._id)}
                                style={{
                                    flex: 0.5,
                                    padding: '0.6rem 0.8rem',
                                    background: '#dc3545',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '0.85rem'
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default HabitList;