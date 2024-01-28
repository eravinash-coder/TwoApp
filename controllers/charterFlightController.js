const CharterFlight = require("../models/charterFlight");
const asyncHandler = require("express-async-handler");

exports.AddLuxuryCruise= asyncHandler(async (req, res) => {
    const {
        fname ,
    
        lname ,
       
        email ,
       
        CompanyName ,
       
        phone ,
       
        Country ,
       
        departure ,
       
        destination ,
       
       
        NoOfPassenger ,
       
       
        enquirydetails 
    } = req.body;
    try {


        var charterFlight = new CharterFlight({
            fname ,
    
            lname ,
           
            email ,
           
            CompanyName ,
           
            phone ,
           
            Country ,
           
            departure ,
           
            destination ,
           
           
            NoOfPassenger ,
           
           
            enquirydetails 
        });
        var record = await charterFlight.save();

        // Send success response inside the try block
        res.status(201).json({
            success: true,
            msg: "Successfully Added",
            data: record,
        });

    } catch (error) {
        // Send error response inside the catch block
        res.status(400).json({ success: false, msg: error.message });
    }


});