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

// Update room by ID
router.put('/:id', async (req, res) => {
  try {
    const updated = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: 'Room updated', updated });
  } catch (err) {
    res.status(500).json({ message: 'Error updating room' });
  }
});

// Delete a room by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedRoom = await Room.findByIdAndDelete(req.params.id);
    if (!deletedRoom) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json({ message: 'Room deleted successfully', deletedRoom });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting room' });
  }
});


router.get('/:roomId/availability', async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId).populate("bookings");

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    let availability = {};

    // Fill booked dates
    const allBookings = [];
    room.bookings.forEach(booking => {
      const start = new Date(booking.startDate);
      const end = new Date(booking.endDate);

      allBookings.push({
        guestName: booking.guestName,
        startDate: booking.startDate,
        endDate: booking.endDate
      });

      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const iso = new Date(d).toISOString().split("T")[0];
        availability[iso] = "booked";
      }
    });

    // Fill available days and mark maintenance days
    const today = new Date();
    const maintenanceStartDate = new Date(room.maintenanceStartDate);
    const maintenanceEndDate = new Date(room.maintenanceEndDate);

    // Iterate through the next 365 days
    for (let i = 0; i < 365; i++) {
      const check = new Date();
      check.setDate(today.getDate() + i);
      const iso = check.toISOString().split("T")[0];

      // If the date is within the maintenance period, mark it as 'under_maintenance'
      if (check >= maintenanceStartDate && check <= maintenanceEndDate) {
        availability[iso] = "under_maintenance";
      }

      // Otherwise, mark the date as 'available' if it hasn't been booked or marked for maintenance
      else if (!availability[iso]) {
        availability[iso] = "available";
      }
    }

    res.json({ availability, bookings: allBookings });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
