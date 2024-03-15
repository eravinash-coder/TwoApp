const mongoose = require('mongoose');

const TransportBuyerSchema = new mongoose.Schema({
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
  favorites:[{type: mongoose.Schema.Types.ObjectId,ref: 'Member'}],
  addedAt:Date

});

module.exports = mongoose.model('TransportBuyer', TransportBuyerSchema);
