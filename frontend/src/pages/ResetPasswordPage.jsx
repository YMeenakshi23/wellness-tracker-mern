// Path: wellness-tracker/frontend/src/pages/ResetPasswordPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom'; // <<< Add 'Link' here
import authService from '../services/authService';
function ResetPasswordPage() {
    const navigate = useNavigate();
    const location = useLocation(); // Hook to access URL's location object

    const [passwordResetAccessTkn, setPasswordResetAccessTkn] = useState('');
    const [email, setEmail] = useState(''); // State to hold email from query param
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [resetLoading, setResetLoading] = useState(false);
    const [resetError, setResetError] = useState('');
    const [resetSuccess, setResetSuccess] = useState(false);

    // Effect to extract token and email from URL query parameters
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tokenFromUrl = params.get('token');
        const emailFromUrl = params.get('email');

        if (tokenFromUrl && emailFromUrl) {
            setPasswordResetAccessTkn(tokenFromUrl);
            setEmail(emailFromUrl);
        } else {
            // If token or email is missing, redirect to forgot password page
            setResetError('Invalid or missing password reset parameters.');
            // navigate('/forgot-password'); // Optional: Redirect if parameters are missing
        }
    }, [location.search]); // Depend on location.search to re-evaluate if URL changes


    const handleResetPassword = async (e) => {
        e.preventDefault();
        setResetLoading(true);
        setResetError('');
        setResetSuccess(false);

        if (password !== confirmPassword) {
            setResetError('Passwords do not match');
            setResetLoading(false);
            return;
        }

        if (!passwordResetAccessTkn || !email) { // Check if we have the necessary info
            setResetError('Missing access token or email. Please restart the process.');
            setResetLoading(false);
            return;
        }

        try {
            const response = await authService.resetPassword(passwordResetAccessTkn, password, confirmPassword);
            setResetSuccess(true);
            alert(response.message); // Use alert for now
            navigate('/login'); // Redirect to login after successful reset
        } catch (err) {
            setResetError(err.response?.data?.message || 'Password reset failed. Please try again.');
            console.error("Password reset error:", err);
        } finally {
            setResetLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg z-10">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Set Your New Password
                </h2>

                {(!passwordResetAccessTkn || !email) ? (
                    // Display message if token or email is missing
                    <p className="mt-4 text-center text-sm text-red-600">
                        {resetError || "Please request a password reset from the 'Forgot Password?' page."}
                        <Link to="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500 block mt-2">
                            Go to Forgot Password
                        </Link>
                    </p>
                ) : (
                    // Password Reset Form (after OTP verification)
                    <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
                        <p className="text-sm text-gray-600 text-center">
                            OTP verified! Set new password for {email}.
                        </p>
                        <input
                            name="password"
                            type="password"
                            required
                            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="New Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <input
                            name="confirmPassword"
                            type="password"
                            required
                            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <div>
                            <button
                                type="submit"
                                disabled={resetLoading}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                            >
                                {resetLoading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </div>
                        {resetError && <p className="mt-4 text-center text-sm text-red-600">{resetError}</p>}
                        {resetSuccess && <p className="mt-4 text-center text-sm text-green-600">Password has been reset successfully!</p>}
                    </form>
                )}
            </div>
        </div>
    );
}

export default ResetPasswordPage;