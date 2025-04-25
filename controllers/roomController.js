const Room = require('../models/Room');
const Booking = require('../models/Booking');

// Function to get available rooms based on check-in/check-out dates and room type
const getAvailableRooms = async (req, res) => {
  const { checkIn, checkOut, roomType } = req.query;

  // Validate the query parameters
  if (!checkIn || !checkOut) {
    return res.status(400).json({ message: 'Check-in and check-out dates are required.' });
  }

  try {
    // Convert dates to Date objects
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Find rooms that are available during the date range and filter by room type if provided
    const rooms = await Room.find({
      roomType: roomType || { $exists: true }, // If roomType is provided, filter by it, else ignore
    });

    // Find all bookings that conflict with the selected date range
    const conflictingBookings = await Booking.find({
      $or: [
        { checkIn: { $lt: checkOutDate }, checkOut: { $gt: checkInDate } }, // Overlap check
      ],
    }).select('room'); // Only get the room references

    // Get an array of room IDs that are already booked during the requested dates
    const bookedRoomIds = conflictingBookings.map(booking => booking.room.toString());

    // Filter out the rooms that are already booked
    const availableRooms = rooms.filter(room => !bookedRoomIds.includes(room._id.toString()));

    // Return the list of available rooms
    res.json({ data: availableRooms });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching available rooms', error: err.message });
  }
};

module.exports = {
  getAvailableRooms,
};
