const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const mongoosePaginate = require("mongoose-paginate-v2");

const specializationSchema = new mongoose.Schema(
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


specializationSchema.plugin(mongoosePaginate);

const Specialization = mongoose.model('Specialization', specializationSchema);
module.exports = Specialization;