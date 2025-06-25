// Path: wellness-tracker/frontend/src/pages/Home.jsx

import React from 'react';

function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] py-16 bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800">
            {/* Hero Section */}
            <div className="text-center px-6 max-w-4xl mx-auto mb-16">
                <h1 className="text-6xl font-extrabold text-blue-700 mb-6 leading-tight animate-fade-in">Welcome to Wellness Tracker!</h1>
                <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-8 animate-slide-up">
                    Your personal guide to better habits and holistic well-being. Start tracking your journey today.
                </p>
                <p className="text-2xl font-semibold text-indigo-600 mb-10 animate-scale-in">
                    "Cultivating a healthier you, one habit at a time."
                </p>
                {/* Optional: Call-to-action buttons */}
                {/* <div className="flex justify-center space-x-4">
                    <Link to="/register" className="px-8 py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-md">Get Started</Link>
                    <Link to="/login" className="px-8 py-3 bg-white text-blue-600 border border-blue-600 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors shadow-md">Sign In</Link>
                </div> */}
            </div>

            {/* What We Provide Section */}
            <div className="w-full bg-white py-16 px-6 mb-16 shadow-inner">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-bold text-center text-blue-700 mb-12">What We Provide</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {/* Feature 1: Habit Tracking */}
                        <div className="bg-gray-50 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2">
                            <h3 className="text-2xl font-semibold text-indigo-600 mb-4">Personalized Habit Tracking</h3>
                            <p className="text-gray-700 leading-relaxed">
                                Easily create, track, and manage your daily, weekly, or monthly habits. Monitor your progress with clear streaks and completion statuses to stay motivated on your wellness journey.
                            </p>
                        </div>
                        {/* Feature 2: AI Coach */}
                        <div className="bg-gray-50 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2">
                            <h3 className="text-2xl font-semibold text-indigo-600 mb-4">AI Wellness Coach</h3>
                            <p className="text-gray-700 leading-relaxed">
                                Get instant, personalized advice and motivation from your AI Coach. Ask questions about health, well-being, habit formation, and receive intelligent, supportive responses.
                            </p>
                        </div>
                        {/* Feature 3: Lifetime Mentorship */}
                        <div className="bg-gray-50 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2">
                            <h3 className="text-2xl font-semibold text-indigo-600 mb-4">Lifetime Mentorship Access</h3>
                            <p className="text-gray-700 leading-relaxed">
                                Upgrade for exclusive, lifelong guidance on health and well-being. This includes deeper insights, priority support, and access to premium resources to accelerate your growth.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Customer Support Section */}
            <div className="w-full py-16 px-6">
                <div className="max-w-4xl mx-auto bg-white p-10 rounded-xl shadow-lg text-center">
                    <h2 className="text-4xl font-bold text-blue-700 mb-6">Need Support?</h2>
                    <p className="text-lg text-gray-700 mb-8">
                        Our team is here to help you on your wellness journey. If you have any questions, feedback, or need assistance, please don't hesitate to reach out.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                        <a href="mailto:support@wellnesstracker.com" className="px-8 py-3 bg-green-600 text-white rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors shadow-md">Email Support</a>
                        <a href="tel:+1234567890" className="px-8 py-3 bg-indigo-600 text-white rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors shadow-md">Call Us (M-F, 9 AM - 5 PM)</a>
                    </div>
                </div>
            </div>

            {/* Simple CSS for animations (can be moved to index.css if preferred) */}
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
                .animate-slide-up { animation: slideUp 0.8s ease-out forwards; animation-delay: 0.2s; }
                .animate-scale-in { animation: scaleIn 0.8s ease-out forwards; animation-delay: 0.4s; }
                .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
            `}</style>
        </div>
    );
}

export default Home;