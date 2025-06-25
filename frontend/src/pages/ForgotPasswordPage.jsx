// Path: wellness-tracker/frontend/src/pages/ForgotPasswordPage.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [requestLoading, setRequestLoading] = useState(false);
    const [verifyLoading, setVerifyLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [otpError, setOtpError] = useState(''); // <<< NEW: Declare otpError state here

    const navigate = useNavigate();

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setRequestLoading(true);
        setMessage('');
        setError('');
        setOtpError(''); // Clear OTP error when sending new OTP

        try {
            const response = await authService.requestPasswordResetOtp(email);
            setMessage(response.message || 'OTP sent successfully to your email!');
            setOtpSent(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
            console.error("Forgot password request error:", err);
        } finally {
            setRequestLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setVerifyLoading(true);
        setError('');
        setOtpError(''); // Clear previous OTP error

        try {
            const response = await authService.verifyOtpAndGetAccessToken(email, otp);
            navigate(`/reset-password?token=${response.passwordResetAccessTkn}&email=${encodeURIComponent(email)}`);
        } catch (err) {
            setOtpError(err.response?.data?.message || 'OTP verification failed. Please check your email and OTP.'); // <<< Used here
            console.error("OTP verification error:", err);
        } finally {
            setVerifyLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg z-10">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Forgot Password?
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    {otpSent ? 'Enter the OTP sent to your email.' : 'Enter your email address to receive an OTP.'}
                </p>

                {!otpSent ? (
                    <form className="mt-8 space-y-6" onSubmit={handleSendOtp}>
                        <input
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <div>
                            <button
                                type="submit"
                                disabled={requestLoading}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                            >
                                {requestLoading ? 'Sending OTP...' : 'Send OTP'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <form className="mt-8 space-y-6" onSubmit={handleVerifyOtp}>
                        <input
                            name="otp"
                            type="text"
                            required
                            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                        <div>
                            <button
                                type="submit"
                                disabled={verifyLoading}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                            >
                                {verifyLoading ? 'Verifying...' : 'Validate OTP'}
                            </button>
                        </div>
                    </form>
                )}

                {message && <p className="mt-4 text-center text-sm text-green-600">{message}</p>}
                {error && <p className="mt-4 text-center text-sm text-red-600">{error}</p>}
                {otpError && <p className="mt-4 text-center text-sm text-red-600">{otpError}</p>} {/* Display OTP error */}

                <div className="text-center text-sm mt-6">
                    <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ForgotPasswordPage;