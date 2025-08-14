const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const appointmentSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
        },
        status: {
            type: String,
            default: "pending", // pending, ongoing, accepted, cancelled, completed
        },
        procedure: {
            type: String,
            required: true,
        },
        otherDetails: {
            type: String,
            required: false,
        },
        dentistId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        startDateTime: {
            type: String,
            required: true,
        },
        endDateTime: {
            type: String,
            required: true,
        },
        totalAmount: {
            type: Number,
            default: 0
        },
        paymentMethodId: {
            type: mongoose.Schema.Types.ObjectId,
            default: null
        },
        paymentStatus: {
            type: Boolean,
            default: false
        },
        deleteStatus: {
            type: Boolean,
            default: false
        }
    }, 
    {
        timestamps: 
        { 
            createdAt: true, 
            updatedAt: true 
        },
    }
);


appointmentSchema.plugin(aggregatePaginate);

const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;