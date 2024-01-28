const LaxuryTransport = require("../models/LaxuryTransport");

exports.AddLaxuryTransport = async (req, res) => {
    try {
        const {
            fname,

            lname,

            phone,

            brandOfVehicle,

            numberOfPeople,

            luxury,

            sluxury,

            address 
        } = req.body;




        const laxuryTransport = new LaxuryTransport({             
            fname,

            lname,

            phone,

            brandOfVehicle,

            numberOfPeople,

            luxury,

            sluxury,

            address  });
        await laxuryTransport.save();
        res.status(201).send(' Uploded successfully');
    } catch (error) {
        res.status(500).send(error.message);
    }
};