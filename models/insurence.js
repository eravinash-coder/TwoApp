const mongoose = require('mongoose');

const insurenceSchema = new mongoose.Schema({
    trip_type: String,
    start_date: String,
    end_date: String,
    destination: String,
    travel_region: String,
    duration: String,
    no_of_travelers: String,
    age: String
});

module.exports = mongoose.model('Insurence', insurenceSchema);
