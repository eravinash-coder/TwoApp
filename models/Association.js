const mongoose = require('mongoose');

const associationSchema = new mongoose.Schema({
  name: String,
  type:String,
  shortName: String,
  email: String,
  image: [Object],
  password: String,
});

module.exports = mongoose.model('Association', associationSchema);
