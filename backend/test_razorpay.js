// Path: wellness-tracker/backend/test_razorpay.js

require('dotenv').config({ path: './.env' }); // Load .env variables
const Razorpay = require('razorpay');

console.log("Testing Razorpay SDK initialization...");
console.log("Key ID from .env:", process.env.RAZORPAY_KEY_ID ? "Loaded" : "NOT LOADED");
console.log("Key Secret from .env:", process.env.RAZORPAY_KEY_SECRET ? "Loaded" : "NOT LOADED");

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.error("ERROR: Razorpay keys are not loaded from .env. Check your .env file and spelling.");
    process.exit(1);
}

try {
    const razorpayInstance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // Try to create a dummy order to verify API connectivity
    razorpayInstance.orders.create({
        amount: 100, // 1.00 INR
        currency: "INR",
        receipt: "test_receipt_1",
        payment_capture: 1,
    })
    .then(order => {
        console.log("SUCCESS: Razorpay SDK initialized and dummy order created successfully!");
        console.log("Dummy Order ID:", order.id);
        process.exit(0); // Exit successfully
    })
    .catch(err => {
        console.error("ERROR: Razorpay SDK initialized, but failed to create dummy order.");
        console.error("Razorpay API Error (FULL):", err); // Log full error from SDK
        process.exit(1); // Exit with error
    });

} catch (err) {
    console.error("ERROR: Razorpay SDK initialization failed. Check your keys in .env.");
    console.error("Initialization Error (FULL):", err); // Log full error from initialization
    process.exit(1); // Exit with error
}