const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const authassoMiddleware = require('../middleware/authAssoMiddleware');

router.post('/appointments', authassoMiddleware, appointmentController.createAppointment);
router.get('/appointments', authassoMiddleware, appointmentController.getAppointments);
router.get('/Allappointments',  appointmentController.getAllAppointments);
router.get('/appointments/:id', appointmentController.getAppointmentById);
router.put('/appointments/:id', appointmentController.updateAppointment);
router.delete('/appointments/:id', appointmentController.deleteAppointment);
router.get('/bookings/available-slots/:date', appointmentController.availableslots);

module.exports = router;
