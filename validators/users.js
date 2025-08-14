const User = require('../models/users.model');
const Admin = require('../models/admins.model');

const create = {
    firstName: {
        isString: {
            errorMessage: "Invalid request: First Name"
        },
        trim: true,
        notEmpty: {
            errorMessage: "First Name is required."
        },
    },
    middleName: {
        isString: {
            errorMessage: "Invalid request: Middle Name"
        },
        trim: true,
        notEmpty: false
    },
    lastName: {
        isString: {
            errorMessage: "Invalid request: Last Name"
        },
        trim: true,
        notEmpty: {
            errorMessage: "Last Name is required."
        },
    },
    email: {
        isString: {
            errorMessage: "Invalid request: Email"
        },
        isEmail: {
            errorMessage: "Invalid request: Email"
        },
        trim: true,
        notEmpty: {
            errorMessage: "Email is required."
        },
        custom: {
            options: async (email) => {
                const isUserExist = await User.findOne({email: email, deleteStatus: false, isActive: true})
                if(isUserExist) {
                    throw new Error('Email has alreay been taken.');
                }
                const isAdminExist = await Admin.findOne({email: email, deleteStatus: false, isActive: true})
                if(isAdminExist) {
                    throw new Error('Email has alreay been taken.');
                }
            },
        },
    },
    password: {
        isString: {
            errorMessage: "Invalid request: Password"
        },
        trim: true,
        notEmpty: {
            errorMessage: "Password is required."
        },
        isLength: { options: { min: 8 }, errorMessage: "Password must be at least 8 characters long." },
        matches: { options: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, errorMessage: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character." },
    },
    mobileNumber: {
        isString: {
            errorMessage: "Invalid request: Mobile Number"
        },
        trim: true,
        notEmpty: {
            errorMessage: "Mobile Number is required."
        },
        isLength: { options: { min: 11, max: 11 }, errorMessage: "Mobile number must be 11 characters long." },
    },
    age: {
        isInt: {
            errorMessage: "Invalid request: Age"
        },
        trim: true,
        notEmpty: {
            errorMessage: "Age is required."
        },
        isLength: { options: { min: 1, max: 3 }, errorMessage: "Age must be 1-3 digits long." },
    },
    address: {
        isString: {
            errorMessage: "Invalid request: Address"
        },
        trim: true,
        notEmpty: {
            errorMessage: "Address is required."
        },
    }
}

const update = {
    firstName: {
        isString: {
            errorMessage: "Invalid request: First Name"
        },
        trim: true,
        notEmpty: {
            errorMessage: "First Name is required."
        },
    },
    middleName: {
        isString: {
            errorMessage: "Invalid request: Middle Name"
        },
        trim: true,
        notEmpty: false
    },
    lastName: {
        isString: {
            errorMessage: "Invalid request: Last Name"
        },
        trim: true,
        notEmpty: {
            errorMessage: "Last Name is required."
        },
    },
    email: {
        isString: {
            errorMessage: "Invalid request: Email"
        },
        isEmail: {
            errorMessage: "Invalid request: Email"
        },
        trim: true,
        notEmpty: {
            errorMessage: "Email is required."
        },
        custom: {
            options: async ( email, {req} ) => {
                const isUserExist = await User.findOne({email: email, _id: { $ne: req.params.id }, deleteStatus: false, isActive: true})
                if(isUserExist) {
                    throw new Error('Email has alreay been taken.');
                }
                const isAdminExist = await Admin.findOne({email: email, _id: { $ne: req.params.id }, deleteStatus: false, isActive: true})
                if(isAdminExist) {
                    throw new Error('Email has alreay been taken.');
                }
            },
        },
    },
    mobileNumber: {
        isString: {
            errorMessage: "Invalid request: Mobile Number"
        },
        trim: true,
        notEmpty: {
            errorMessage: "Mobile Number is required."
        },
        isLength: { options: { min: 11, max: 11 }, errorMessage: "Mobile number must be 11 characters long." },
    },
    age: {
        isInt: {
            errorMessage: "Invalid request: Age"
        },
        trim: true,
        notEmpty: {
            errorMessage: "Age is required."
        },
        isLength: { options: { min: 1, max: 3 }, errorMessage: "Age must be 1-3 digits long." },
    },
    address: {
        isString: {
            errorMessage: "Invalid request: Address"
        },
        trim: true,
        notEmpty: {
            errorMessage: "Address is required."
        },
    },
    isActive: {
        isBoolean: {
            errorMessage: "Invalid request: Is Active"
        },
        trim: true,
        notEmpty: {
            errorMessage: "Is Active is required."
        },
    }
}

module.exports = {
    create,
    update
}