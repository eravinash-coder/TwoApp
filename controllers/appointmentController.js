const Appointment = require('../models/AppointmentModel');
const Booking = require('../models/Booking');
const Association = require('../models/Association');


// Create a new appointment
exports.createAppointment = async (req, res) => {
    try {
        // Find the booking by its ID
        const associationId = req.user.associationId
        const { date, timeSlotID, phone, email, name, } = req.body;
        const associationExists = await Association.findById(associationId);
        if (!associationExists) {
            return res.status(404).send('Association not found');
        }
        const booking = await Booking.findOne({ date });
        if (!booking) {
            console.error('Booking not found');
            return;
        }
        // Find the specific time slot by its time
        const timeSlot = booking.timeSlots.find(slot => slot._id == timeSlotID);
        if (!timeSlot) {
            console.error('Time slot not found');
            return;
        }

        // Update the availability of the specific time slot
        timeSlot.available = false;

        // Save the booking with the updated time slot
        const updatedBooking = await booking.save();
        const appointment = new Appointment({
            associationId,
            name,
            aname: associationExists.name,
            email,
            phone,
            date,
            time: timeSlot.time
        });


        var record = await appointment.save();

        // Send success response inside the try block
        res.status(201).json({
            success: true,
            msg: "Successfully Added",
            data: record,
        });

    } catch (error) {
        console.log(error.message)
        res.status(400).json({ message: error.message });
    }
};

// Get  appointments by Id
 exports.getAppointments = async (req, res) => {
    const associationId = req.user.associationId
    try {
        const appointments = await Appointment.find({associationId});
        res.status(200).json(appointments);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
// Get all appointments
exports.getAllAppointments = async (req, res) => {
   
    try {
        const appointments = await Appointment.find();
        res.status(200).json(appointments);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get appointment by ID
exports.getAppointmentById = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        res.status(200).json(appointment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update an appointment
exports.updateAppointment = async (req, res) => {
    try {
        const appointmentId = req.params.id;
        const { date, timeSlotID, phone, email, name } = req.body;


        // Update existing appointment
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).send('Appointment not found');
        }

        const oldBooking = await Booking.findOne({ date: appointment.date });
        const oldTimeSlot = oldBooking.timeSlots.find(slot => slot.time === appointment.time);
        if (oldTimeSlot) {
            oldTimeSlot.available = true;
            await oldBooking.save();
        }

        const newBooking = await Booking.findOne({ date });
        if (!newBooking) {
            return res.status(404).send('New booking date not found');
        }

        const newTimeSlot = newBooking.timeSlots.find(slot => slot._id == timeSlotID);
        if (!newTimeSlot) {
            return res.status(404).send('New time slot not found');
        }

        newTimeSlot.available = false;
        await newBooking.save();

        appointment.date = date;
        appointment.time = newTimeSlot.time;
        appointment.name = name;
        appointment.email = email;
        appointment.phone = phone;

        const updatedAppointment = await appointment.save();

        res.status(200).json({
            success: true,
            msg: "Successfully Updated",
            data: updatedAppointment,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }

};

// Delete an appointment
exports.deleteAppointment = async (req, res) => {
    try {
        const appointmentId = req.params.id;

        // Find the existing appointment
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).send('Appointment not found');
        }

        // Find the booking and time slot to make it available again
        const booking = await Booking.findOne({ date: appointment.date });
        if (booking) {
            const timeSlot = booking.timeSlots.find(slot => slot.time === appointment.time);
            if (timeSlot) {
                timeSlot.available = true;
                await booking.save();
            }
        }

        // Delete the appointment
        await Appointment.findByIdAndDelete(appointmentId);

        res.status(200).json({
            success: true,
            msg: "Successfully Deleted"
        });

    } catch (error) {
        console.log(error.message);
        res.status(400).json({ message: error.message });
    }
};


exports.availableslots = async (req, res) => {
    try {
        const date = new Date(req.params.date);
        const booking = await Booking.findOne({ date });

        if (!booking) {
            return res.status(404).json({ message: 'No bookings found for this date' });
        }

        const availableSlots = booking.timeSlots;

        res.status(200).json({ date, availableSlots });
    } catch (err) {
        console.log()
        res.status(500).json({ message: err.message });
    }
};
