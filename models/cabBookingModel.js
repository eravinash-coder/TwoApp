const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  phone: String,
  email: String,
  address: String,
  city: String,
  state: String,
  pincode: String,
  isBooked: { type: Boolean, default: false }
});

module.exports = mongoose.model('CabBooking', userSchema);
