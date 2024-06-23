const mongoose = require('mongoose');

const ChaptersSchema = new mongoose.Schema({
  associationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Association' },
  aname:String,
  name:String,
  email:String,
  phone:String,
  date:String,
  time:String
  
});

module.exports = mongoose.model('Appointment', ChaptersSchema);
