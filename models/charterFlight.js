const mongoose = require('mongoose');

const charterFlightSchema = new mongoose.Schema({


    
     fname :String,
    
     lname :String,
    
     email :String,
    
     CompanyName :String,
    
     phone :String,
    
     Country :String,
    
     departure :String,
    
     destination :String,
    
    
     NoOfPassenger :String,
    
    
     enquirydetails :String
});

module.exports = mongoose.model('CharterFlight', charterFlightSchema);
