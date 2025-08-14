const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const mongoosePaginate = require("mongoose-paginate-v2");

const roleSchema = new mongoose.Schema(
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


roleSchema.plugin(mongoosePaginate);

const Role = mongoose.model('Role', roleSchema);
module.exports = Role;