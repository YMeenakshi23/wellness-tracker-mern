// Path: wellness-tracker/frontend/src/Components/HabitForm.jsx

import React, { useState, useEffect } from 'react';

function HabitForm({ onSubmit, initialData = {}, onCancel }) {
    const currentInitialData = initialData || {};

    const [formData, setFormData] = useState({
        name: currentInitialData.name || '',
        description: currentInitialData.description || '',
        frequency: currentInitialData.frequency || 'daily',
        targetCount: currentInitialData.targetCount || 1,
    });

    useEffect(() => {
        if (currentInitialData._id) {
            setFormData({
                name: currentInitialData.name || '',
                description: currentInitialData.description || '',
                frequency: currentInitialData.frequency || 'daily',
                targetCount: currentInitialData.targetCount || 1,
            });
        } else {
            setFormData({
                name: '',
                description: '',
                frequency: 'daily',
                targetCount: 1,
            });
        }
    }, [currentInitialData._id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const inputStyle = {
        padding: '1rem',
        borderRadius: '8px',
        border: '1px solid #c2c2c2',
        width: '100%',
        boxSizing: 'border-box',
        fontSize: '1.1rem',
        marginBottom: '1.5rem',
    };

    const selectStyle = {
        ...inputStyle,
        width: 'auto',
        marginBottom: '0',
    };

    const labelStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '1.5rem',
        fontSize: '1.1rem',
        color: '#555',
        width: '100%',
        justifyContent: 'space-between',
    };

    const buttonStyle = {
        padding: '1.2rem 2rem',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '1.2rem',
        fontWeight: 'bold',
        transition: 'background 0.3s ease',
    };

    return (
        <div style={{
            marginBottom: '3rem',
            width: '100%',
            boxSizing: 'border-sizing', // Fixed typo here (was 'border-sizing')
        }}>
            {/* REMOVED: h3 tag for "Add New Habit" title */}
            <form onSubmit={handleSubmit} style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                maxWidth: '600px',
                margin: '0 auto',
            }}>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Habit Name (e.g., Drink Water)"
                    required
                    style={inputStyle}
                />
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Description (optional)"
                    rows="4"
                    style={{ ...inputStyle, resize: 'vertical' }}
                ></textarea>
                <label style={labelStyle}>
                    Frequency:
                    <select
                        name="frequency"
                        value={formData.frequency}
                        onChange={handleChange}
                        style={selectStyle}
                    >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                    </select>
                </label>
                <label style={labelStyle}>
                    Target Count (e.g., 8 glasses):
                    <input
                        type="number"
                        name="targetCount"
                        value={formData.targetCount}
                        onChange={handleChange}
                        min="1"
                        style={{ ...selectStyle, width: '100px' }}
                    />
                </label>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                    <button
                        type="submit"
                        style={{
                            ...buttonStyle,
                            background: '#2563eb', // <<< CHANGED TO BLUE HERE (#2563eb is a common Tailwind blue)
                            color: '#fff',
                            flex: 1
                        }}
                    >
                        {currentInitialData._id ? 'Update Habit' : 'Add Habit'}
                    </button>
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            style={{
                                ...buttonStyle,
                                background: '#dc3545',
                                color: '#fff',
                                flex: 1
                            }}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}

export default HabitForm;