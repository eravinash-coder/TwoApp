const LuxuryCarBooking = require('../models/LuxuryCarBooking');

// Controller actions
const getAllBookings = async (req, res) => {
  try {
    const bookings = await LuxuryCarBooking.find();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createBooking = async (req, res) => {
  const booking = new LuxuryCarBooking({
    LuxuryCarId: req.body.LuxuryCarId,
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    place: req.body.place,
  });

  try {
    const newBooking = await booking.save();
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getAllBookings,
  createBooking,
};
