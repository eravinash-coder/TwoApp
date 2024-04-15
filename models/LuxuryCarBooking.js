const mongoose = require('mongoose');

const LuxuryCarBookingSchema = new mongoose.Schema({
  LuxuryCarId:String,
  name: String,
  email:String,
  phone:String,
  place: String,
  
  

});

module.exports = mongoose.model('LuxuryCarBooking', LuxuryCarBookingSchema);
