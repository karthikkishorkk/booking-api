const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// GET all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json({data:bookings});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new booking
router.post('/', async (req, res) => {
    console.log(req.body,"request");
    
    const { firstName, lastName, room, checkIn, checkOut, status } = req.body;
  
    try {
      const newBooking = await Booking.create({
        firstName,
        lastName,
        room,
        checkIn,
        checkOut,
        status,
      });
  
      res.status(201).json({data:newBooking});
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  

// PATCH a booking by ID
router.patch('/:id', async (req, res) => {
  try {
    const updated = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
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
