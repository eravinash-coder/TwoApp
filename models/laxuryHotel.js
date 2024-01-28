const mongoose = require('mongoose');

const laxuryHotelSchema = new mongoose.Schema({
    
    name: String,
    title: String,
    address: String,
    city: String,
    country: String,
    access: String,
    amenities: [String],
    image_url: [Object],
    home_url: [Object],
    website: String
});

module.exports = mongoose.model('LaxuryHotel', laxuryHotelSchema);
