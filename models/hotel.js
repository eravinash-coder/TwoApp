const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  associationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Association' },
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
  dealName: String,
  hotelCategory:String,
  hotelplans: String,
  dealType:String,
  priceForOther:String,
  priceForSame:String,
  description:String,
  countryOrState:String,
  city:String,
  destination:String,
  expire:String,
  ContactName:String,
  ContactNumber:String,
  ContactEmail:String,
  addedAt:Date

});

module.exports = mongoose.model('Hotel', hotelSchema);
