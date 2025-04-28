const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true, unique: true },
  roomType: { type: String, required: true }, // e.g., 'Deluxe', 'Standard'
  status: {
    type: String,
    enum: ['available', 'booked', 'under_maintenance'],
    default: 'available'
  },
  capacity: { type: Number, required: true },
  amenities: [String], // e.g., ['WiFi', 'AC', 'TV']
  maintenanceStartDate: { type: Date, default: null },
  maintenanceEndDate: { type: Date, default: null },
  
  bookings: [
    {
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
      bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }
    }
  ],

  // New: availability array for date-wise availability
  availability: [
    {
      date: { type: Date, required: true },
      status: {
        type: String,
        enum: ['available', 'booked', 'under_maintenance'],
        default: 'available'
      }
    }
  ]
  
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
