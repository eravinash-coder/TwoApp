const mongoose = require('mongoose');

const PackageSchema = new mongoose.Schema({
  associationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Association' },
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
  dealName: String,
  duration: String,
  dealType:String,
  priceForSame:String,
  priceForOther:String,
  airportTransport:String,
  inclusions:String,
  hotelCategory:String,
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

module.exports = mongoose.model('Package', PackageSchema);
