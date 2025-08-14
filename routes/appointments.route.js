const express = require("express");
const router = express.Router();
const AppointmentController = require("../controllers/Appointments");
const { adminAuth, adminAndUserAuth } = require("../middlewares/auth");
const { checkSchema } = require("express-validator")
const appointmentValidator = require("../validators/appointments")
const { checkValidationResult } = require("../middlewares/validation-result")

router.get('/', adminAndUserAuth, AppointmentController.get_appointments)
router.get('/:id', adminAndUserAuth, AppointmentController.get_appointment)
router.post('/create', adminAndUserAuth, [checkSchema(appointmentValidator.create), checkValidationResult], AppointmentController.create_appointment)
router.put('/:id', adminAndUserAuth, AppointmentController.update_appointment)
router.patch('/:id', adminAuth, AppointmentController.delete_appointment)

module.exports = router