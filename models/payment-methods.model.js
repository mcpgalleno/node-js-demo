const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const mongoosePaginate = require("mongoose-paginate-v2");

const paymentMethodSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
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

paymentMethodSchema.plugin(mongoosePaginate);

// Create the User model from the schema
const PaymentMethod = mongoose.model('Payment_Method', paymentMethodSchema);
module.exports = PaymentMethod;