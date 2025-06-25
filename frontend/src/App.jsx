// Path: wellness-tracker/frontend/src/App.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AddHabitPage from './pages/AddHabitPage.jsx'; // <<< NEW IMPORT
import MyHabitsPage from './pages/MyHabitsPage.jsx'; // <<< NEW IMPORT

import './App.css'; 
import './index.css';

function App() {
    return (
        <div className="min-h-screen bg-gray-100 font-sans antialiased">
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/add-habit" element={<AddHabitPage />} /> {/* <<< NEW ROUTE */}
                <Route path="/my-habits" element={<MyHabitsPage />} /> {/* <<< NEW ROUTE */}
            </Routes>
        </div>
    );
}

export default App;