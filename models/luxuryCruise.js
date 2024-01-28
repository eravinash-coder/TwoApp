const mongoose = require('mongoose');

const luxuryCruiseSchema = new mongoose.Schema({


    fname,

    lname,

    phone,

    email,

    destination,

    departurePort,

    LenghtOfTour
});

module.exports = mongoose.model('luxuryCruise', luxuryCruiseSchema);
