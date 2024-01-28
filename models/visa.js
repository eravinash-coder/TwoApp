const mongoose = require('mongoose');

const visaSchema = new mongoose.Schema({
  countryName:String,
  fname: String,

  lname: String,

  email: String,

  phone: String,

  visaType: String,

  address: String,

  city: String,

  state: String,

  country: String,

  zipcode: String,
  images: [Object],
  passport:[Object],
  bankstatement:[Object],
  hotelbooking:[Object],
  flightbook:[Object],
  travelInsurance:[Object],
  ITR:[Object],
  iternnary:[Object],
  marriage:[Object],
  invitationletter:[Object]

});

module.exports = mongoose.model('Visa', visaSchema);
