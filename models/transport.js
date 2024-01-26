const mongoose = require('mongoose');

const TransportSchema = new mongoose.Schema({
  associationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Association' },
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
  dealName: String,
  vechicleCategory: String,
  fuelType:String,
  dailyRent:String,
  costPerKm:String,
  costPerHours:String,
  description:String,
  countryOrState:String,
  destination:String,
  expire:String,
  ContactName:String,
  ContactNumber:String,
  ContactEmail:String,
  addedAt:Date

});

module.exports = mongoose.model('Transport', TransportSchema);
