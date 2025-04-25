const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Room = require('../models/Room');

// GET all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().populate('room');
    res.json({ data: bookings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new booking
router.post('/', async (req, res) => {
  console.log(req.body, "request");

  const {
    firstName,
    lastName,
    email,
    phone,
    altPhone,
    guests,
    children,
    childrenAges,
    room,
    checkIn,
    checkOut,
    status
  } = req.body;

  try {
    const roomData = await Room.findById(room);
    if (!roomData) {
      return res.status(404).json({ error: 'Room not found' });
    }

    const newBooking = await Booking.create({
      firstName,
      lastName,
      email,
      phone,
      altPhone,
      guests,
      children,
      childrenAges,
      room,
      checkIn,
      checkOut,
      status,
    });

    roomData.bookings.push({
      startDate: checkIn,
      endDate: checkOut,
      bookingId: newBooking._id
    });
    await roomData.save();

    res.status(201).json({ data: newBooking });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH a booking by ID
router.patch('/:id', async (req, res) => {
  const { room } = req.body;

  try {
    // Optional: If the room is being updated, verify its existence
    if (room) {
      const roomExists = await Room.findById(room);
      if (!roomExists) {
        return res.status(404).json({ error: 'Room not found' });
      }
    }

    const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedBooking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE a booking by ID
router.delete('/:id', async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Booking deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
