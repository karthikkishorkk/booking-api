const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const { getAvailableRooms } = require('../controllers/roomController');

// stats route
router.get('/stats', async (req, res) => {
  try {
    console.log('Fetching room stats...'); 
    const totalRooms = await Room.countDocuments();
    const availableRooms = await Room.countDocuments({ status: 'available' });
    const bookedRooms = await Room.countDocuments({ status: 'booked' });
    const maintenanceRooms = await Room.countDocuments({ status: 'under_maintenance' });

    console.log({
      totalRooms,
      availableRooms,
      bookedRooms,
      maintenanceRooms,
    });

    res.json({
      totalRooms,
      availableRooms,
      bookedRooms,
      maintenanceRooms,
    });
  } catch (err) {
    console.error('Error fetching stats:', err); 
    res.status(500).json({ message: 'Error fetching stats' });
  }
});

//GET available rooms based on date range and optional roomType
router.get('/available', getAvailableRooms);

// Get all rooms
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get room by ID
router.get('/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json(room);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Create a room
router.post('/', async (req, res) => {
  const { roomNumber, roomType, status, capacity, amenities } = req.body;
  try {
    const room = new Room({ roomNumber, roomType, status, capacity, amenities });
    await room.save();
    res.status(201).json({ message: 'Room created successfully', room });
  } catch (err) {
    res.status(500).json({ message: 'Error creating room' });
  }
});

module.exports = router;
