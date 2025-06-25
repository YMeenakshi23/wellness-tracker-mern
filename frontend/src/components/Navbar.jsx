// Path: wellness-tracker/frontend/src/Components/Navbar.jsx

import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext.jsx';

function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const onLogout = () => {
        logout();
        navigate('/login');
    };

    const linkStyle = {
        color: '#e0e0e0',
        textDecoration: 'none',
        fontSize: '1rem',
        padding: '0.5rem 0.8rem',
        borderRadius: '4px',
        transition: 'background-color 0.2s ease, color 0.2s ease',
    };

    const linkHoverStyle = {
        backgroundColor: '#555',
        color: '#fff',
    };

    const buttonStyle = {
        background: 'none',
        border: '1px solid #a0a0a0',
        color: '#e0e0e0',
        padding: '0.5rem 1rem',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '1rem',
        transition: 'background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease',
    };

    const buttonHoverStyle = {
        backgroundColor: '#007bff',
        borderColor: '#007bff',
        color: '#fff',
    };

    return (
        <nav style={{
            padding: '1rem 2rem',
            background: '#333',
            color: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
        }}>
            <Link to="/" style={{ ...linkStyle, fontSize: '1.8rem', fontWeight: 'bold', color: '#fff' }}>
                Wellness Tracker
            </Link>
            <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
                {user ? (
                    <>
                        <Link
                            to="/dashboard"
                            style={linkStyle}
                            onMouseEnter={e => Object.assign(e.target.style, linkHoverStyle)}
                            onMouseLeave={e => Object.assign(e.target.style, linkStyle)}
                        >
                            Dashboard
                        </Link>
                        {/* <<< UPDATED LINK */}
                        <Link
                            to="/add-habit" // Link to the new Add Habit page
                            style={linkStyle}
                            onMouseEnter={e => Object.assign(e.target.style, linkHoverStyle)}
                            onMouseLeave={e => Object.assign(e.target.style, linkStyle)}
                        >
                            Add Habit
                        </Link>
                        {/* <<< UPDATED LINK */}
                        <Link
                            to="/my-habits" // Link to the new My Habits page
                            style={linkStyle}
                            onMouseEnter={e => Object.assign(e.target.style, linkHoverStyle)}
                            onMouseLeave={e => Object.assign(e.target.style, linkStyle)}
                        >
                            My Habits
                        </Link>

                        <button
                            onClick={onLogout}
                            style={buttonStyle}
                            onMouseEnter={e => Object.assign(e.target.style, buttonHoverStyle)}
                            onMouseLeave={e => Object.assign(e.target.style, buttonStyle)}
                        >
                            Logout ({user.username})
                        </button>
                    </>
                ) : (
                    <>
                        <Link
                            to="/register"
                            style={linkStyle}
                            onMouseEnter={e => Object.assign(e.target.style, linkHoverStyle)}
                            onMouseLeave={e => Object.assign(e.target.style, linkStyle)}
                        >
                            Register
                        </Link>
                        <Link
                            to="/login"
                            style={linkStyle}
                            onMouseEnter={e => Object.assign(e.target.style, linkHoverStyle)}
                            onMouseLeave={e => Object.assign(e.target.style, linkStyle)}
                        >
                            Login
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;