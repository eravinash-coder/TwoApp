const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for a nomination
const nominationSchema = new Schema({
    Categories: {
        type: String,
       
    },
    Nominees: {
        type: String,
        
    },
    Website: {
        type: String,
       
    },
    Supporting_Documents: {
        type: String
    }
});


module.exports = mongoose.model('nomination', nominationSchema);
