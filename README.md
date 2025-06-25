# Wellness Tracker: Your AI-Powered Habit & Well-being Companion

---

## 🚀 Project Overview

The Wellness Tracker is a full-stack MERN (MongoDB, Express.js, React.js, Node.js) application designed to empower individuals in cultivating healthier habits and improving their overall well-being. It provides intuitive tools for habit tracking, combined with the innovative support of an AI-powered personal coach and a premium mentorship offering.

This project was built to demonstrate proficiency in full-stack development, covering secure authentication, robust CRUD operations, external API integrations, and responsive UI design.

## ✨ Features

* **Secure User Authentication:**
    * User Registration and Login with `bcrypt.js` for password hashing and JSON Web Tokens (JWT) for secure session management.
    * **OTP-based Password Reset:** Securely reset forgotten passwords using a One-Time Password sent to the user's email.
    * Protected routes ensuring data privacy and authorized access.
* **Personalized Habit Management:**
    * Create, Track, Update, Delete (CRUD): Users can define daily, weekly, or monthly habits.
    * Mark Complete: Easily mark habits as completed for the day, with confirmation prompts.
    * Conditional Editing: The 'Edit' option is intuitively hidden once a habit is marked complete for the day.
* **Interactive AI Wellness Coach:**
    * An integrated AI chatbot (powered by Google Gemini API) available as a floating widget.
    * Provides personalized advice, motivation, and answers to wellness and habit-related questions.
* **Lifetime Mentorship Access:**
    * A premium feature allowing users to unlock exclusive mentorship for life via Razorpay payment integration.
    * Secure payment processing and verification on the backend.
    * User status (`isLifetimeMentor`) is updated in the database and reflected in the UI.
* **Responsive User Interface:**
    * Clean and intuitive design across all pages.
    * Optimized for various screen sizes (desktop, tablet, mobile) using Tailwind CSS for key components and thoughtful inline styling.
    * Dedicated pages for adding and viewing habits.
* **Centralized API Management:** Organized service layers in both frontend and backend for clean API interactions.

## 🛠️ Tech Stack

**Backend:**
* Node.js: JavaScript runtime environment.
* Express.js: Web application framework for Node.js.
* MongoDB: NoSQL database for flexible data storage.
* Mongoose: Object Data Modeling (ODM) library for MongoDB.
* `dotenv`: For managing environment variables.
* `cors`: Middleware for Cross-Origin Resource Sharing.
* `bcryptjs`: For password hashing.
* `jsonwebtoken`: For implementing JWTs.
* `@google/generative-ai`: Official Node.js client library for Google Gemini API.
* `razorpay`: Official Node.js client library for Razorpay API.
* `crypto`: Node.js built-in module for cryptographic functions (used in Razorpay verification).
* `nodemailer`: For sending emails (e.g., OTPs).

**Frontend:**
* React.js: JavaScript library for building user interfaces.
* Vite: Fast build tool for modern web projects.
* `react-router-dom`: For declarative routing in React.
* `axios`: Promise-based HTTP client for the browser and Node.js.
* Tailwind CSS: (Used for core responsive styling in key components like Home, Register, Login, Dashboard, HabitForm, HabitList, Chatbot).
* React Context API: For global state management (e.g., user authentication).

**Tools & Other:**
* MongoDB Compass: GUI for managing MongoDB data.
* Postman: For API testing.
* Git & GitHub: For version control and collaboration.
* `concurrently`: To run both frontend and backend servers with a single command.

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

* Node.js (LTS version recommended) & npm
* MongoDB installed and running locally, or a MongoDB Atlas account
* Git
* Google Gemini API Key (from Google AI Studio)
* Razorpay API Key (Key ID and Key Secret from Razorpay Dashboard)
* Gmail App Password (for password reset email sending)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/YOUR_USERNAME/wellness-tracker-mern.git](https://github.com/YOUR_USERNAME/wellness-tracker-mern.git) # Replace with your actual repo URL
    cd wellness-tracker-mern
    ```

2.  **Configure Environment Variables:**
    * Create a `.env` file in the `backend/` directory:
        ```
        # backend/.env
        PORT=5000
        MONGO_URI=mongodb://127.0.0.1:27017/wellness_tracker
        JWT_SECRET=your_super_secret_jwt_key_here # Make this long and random!
        GEMINI_API_KEY=YOUR_GOOGLE_GEMINI_API_KEY_HERE
        RAZORPAY_KEY_ID=rzp_test_YOUR_RAZORPAY_KEY_ID
        RAZORPAY_KEY_SECRET=YOUR_RAZORPAY_KEY_SECRET
        EMAIL_HOST=smtp.gmail.com
        EMAIL_PORT=587
        EMAIL_USER=your_gmail_email@gmail.com
        EMAIL_PASS=your_gmail_app_password
        APP_URL=http://localhost:5173 # Your frontend's URL
        ```
    * **IMPORTANT:** Ensure `MONGO_URI` points to your running MongoDB instance (local or Atlas). Replace placeholders with your actual keys.

3.  **Install Dependencies:**
    * **Root Dependencies:**
        ```bash
        npm install # Installs concurrently
        ```
    * **Backend Dependencies:**
        ```bash
        cd backend
        npm install
        ```
    * **Frontend Dependencies:**
        ```bash
        cd ../frontend
        npm install
        ```

4.  **Verify Tailwind CSS Setup (Frontend):**
    * Ensure `frontend/tailwind.config.js` `content` array includes `"./src/**/*.{js,ts,jsx,tsx}"`.
    * Ensure `frontend/src/index.css` has `@tailwind base; @tailwind components; @tailwind utilities;` at the top.

### Running the Application

Once dependencies are installed and `.env` is configured:

1.  **Ensure your MongoDB server is running.**
2.  **Start the full-stack application (frontend & backend) with one command:**
    ```bash
    cd C:/Users/meena/MernProjects/wellness-tracker # Navigate back to root
    npm run fullstack
    ```
    This will concurrently start your backend server (typically on `http://localhost:5000`) and your frontend development server (typically on `http://localhost:5173`).

3.  **Open your browser** and navigate to `http://localhost:5173/`.

## ⚙️ Usage

1.  **Register:** Create a new user account on the `/register` page.
2.  **Login:** Access your dashboard via the `/login` page.
3.  **Forgot Password:** If you forget your password, use the "Forgot Password?" link on the login page to initiate an OTP-based reset process.
4.  **Dashboard:** View your profile and access other features.
5.  **Habit Management:**
    * Navigate to the "Add Habit" page to create new habits.
    * Go to "My Habits" to view, mark complete, edit, or delete your habits.
6.  **AI Coach:** Click the floating chat icon at the bottom right of the dashboard to interact with your AI Wellness Coach.
7.  **Lifetime Mentorship:** On the Dashboard, click "Purchase Now" to simulate or complete a Razorpay payment for lifetime access (use Razorpay test card details in test mode).

## 🤝 Contributing

Feel free to contribute to this project!

## 📄 License

This project is licensed under the ISC License.

---
