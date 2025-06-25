// Path: wellness-tracker/frontend/src/pages/Dashboard.jsx

import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext.jsx';
import axios from 'axios';
import Chatbot from '../Components/Chatbot.jsx';
import LifetimeMentorshipPurchase from '../components/LifetimeMentorshipPurchase.jsx';

function Dashboard() {
    const { user, loading, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(true);
    // Fix: Suppress the ESLint warning for setErrorProfile, as it is used in the catch block
    // eslint-disable-next-line no-unused-vars
    const [errorProfile, setErrorProfile] = useState(null); 
    
    // Function to refetch user data (including isLifetimeMentor status)
    const refetchUserData = async () => {
        if (user && user.token) {
            try {
                setLoadingProfile(true); 
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const response = await axios.get('http://localhost:5000/api/users/profile', config);
                setProfileData(response.data);
            } catch (err) {
                console.error("Failed to refetch user data:", err);
                setErrorProfile(err.response?.data?.message || 'Failed to refetch profile data'); // This is where it's used
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    logout();
                }
            } finally {
                setLoadingProfile(false);
            }
        }
    };

    // Redirect if not logged in
    useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
        }
    }, [user, loading, navigate]);

    // Fetch user profile data initially AND whenever refetchUserData might be triggered
    useEffect(() => {
        if (user) { 
            refetchUserData();
        } else {
            setLoadingProfile(false);
        }
    }, [user, logout]); // Depend on user and logout to trigger fetch/refetch

    if (loading || loadingProfile) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)' }}>
                <div style={{ fontSize: '2rem', color: '#6366f1', fontWeight: 600 }}>
                    Loading your dashboard...
                </div>
            </div>
        );
    }

    if (errorProfile) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff1f2' }}>
                <div style={{ fontSize: '1.5rem', color: '#dc2626', fontWeight: 500 }}>
                    Error: {errorProfile}
                </div>
            </div>
        );
    }

    if (!user || !profileData) return null;

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)', padding: '0', margin: '0' }}>
            <div style={{
                maxWidth: '900px',
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
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#6366f1', marginBottom: '0.5rem', letterSpacing: '-1px', textShadow: '0 2px 8px #e0e7ff' }}>
                        Welcome, {profileData.username}!
                    </h2>
                    <div style={{ fontSize: '1.2rem', color: '#64748b', marginBottom: '2.5rem', fontWeight: 400 }}>
                        Here’s your personalized wellness dashboard.
                    </div>

                    <hr style={{ margin: '2rem 0', borderColor: '#eee' }} />

                    {/* Conditional rendering for mentorship content or purchase option */}
                    {profileData.isLifetimeMentor ? (
                        <div style={{
                            background: '#e6fffa',
                            padding: '2rem',
                            borderRadius: '1rem',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                            textAlign: 'center',
                            border: '1px solid #b2f5ea'
                        }}>
                            <h3 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#38a169', marginBottom: '1rem' }}>
                                Congratulations! You have gained access for life long mentorship!
                            </h3>
                            <p style={{ fontSize: '1.1rem', color: '#4a5568' }}>
                                Access exclusive content, personalized sessions, and priority support.
                            </p>
                        </div>
                    ) : (
                        <LifetimeMentorshipPurchase onPurchaseSuccess={refetchUserData} />
                    )}
                </div>
            </div>
            {/* AI Coach Chatbot Section */}
            <Chatbot />
        </div>
    );
}

export default Dashboard;