const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  pppId: { type: mongoose.Schema.Types.ObjectId, ref: 'PPP' },
  type:String,
  fname:String,
  lname:String,
  cname:String,
  website:String,
  email:String,
  phone:String,
  address:String,
  City:String,
  pincode:String,
  description:String,
  Document:[Object]

});

module.exports = mongoose.model('StackHolder', memberSchema);
