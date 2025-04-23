const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  altPhone: String,
  guests: Number,
  children: Number,
  childrenAges: [Number],
  checkIn: Date,
  checkOut: Date,
  room: String,
  status: {
    type: String,
    default: 'confirmed'  // Set default status
  }
});


module.exports = mongoose.model('Booking', bookingSchema);
