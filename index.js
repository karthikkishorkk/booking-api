const express = require('express');
const mongoose = require('mongoose');
const bookingRoutes = require('./routes/bookingRoutes');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors({
  origin: 'http://localhost:3000'
}));

app.use(express.json());

const connect = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/hotelBooking");
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
  }
};

// Connect to database
connect();

// Test route
app.get('/', (req, res) => {
    console.log("Hiiiii");
    
  res.send('Hello World with MongoDB!');
});

app.use('/api/bookings', bookingRoutes);

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
