const mongoose = require('mongoose');

const BoardsSchema = new mongoose.Schema({
  associationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Association' },
  name:String,
  post:String,
  email:String,
  phone:String,
  location:String
  

});

module.exports = mongoose.model('Boards', BoardsSchema);
