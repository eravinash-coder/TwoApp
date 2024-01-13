const mongoose = require('mongoose');

const associationSchema = new mongoose.Schema({
  name: String,
  shortName: String,
  email: String,
  image: String,
  password: String,
});

module.exports = mongoose.model('Association', associationSchema);
