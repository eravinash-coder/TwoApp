const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
  time: { type: String, required: true }, // Example: "09:00 AM"
  available: { type: Boolean, default: true }
});

const bookingSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  timeSlots: [timeSlotSchema]
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
