const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const mongoosePaginate = require("mongoose-paginate-v2");

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
        },
        middleName: {
            type: String,
            required: false,
        },
        lastName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true,
        },
        mobileNumber: {
            type: String,
            required: true,
        },
        age: {
            type: Number,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true
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

// Hash the password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.plugin(mongoosePaginate);

// Create the User model from the schema
const User = mongoose.model('User', userSchema);
module.exports = User;