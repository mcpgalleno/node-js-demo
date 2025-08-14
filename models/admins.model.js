const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const adminSchema = new mongoose.Schema(
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
        roleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Roles",
            required: true,
        },
        specializationIds: [{ 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Specializations'
        }],
        email: {
            type: String,
            required: true,
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
adminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

adminSchema.plugin(aggregatePaginate);

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;