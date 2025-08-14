const Admin = require('../models/admins.model');
const Role = require('../models/roles.model');
const Specialization = require('../models/specializations.model');
const mongoose = require('mongoose');
const moment = require('moment');

const create = {
    userId: {
        isString: true,
        trim: true,
        optional: { options: { nullable: true } },
    },
    procedure: {
        isString: {
            errorMessage: "Invalid request: Procedure"
        },
        trim: true,
        notEmpty: {
            errorMessage: "Procedure is required."
        },
    },
    otherDetails: {
        isString: true,
        trim: true,
    },
    dentistId: {
        isString: {
            errorMessage: "Invalid request: Dentist ID"
        },
        trim: true,
        notEmpty: {
            errorMessage: "Dentist ID is required."
        },
        custom: {
            options: async (dentistId) => {
                const isExist = await Admin.findOne({_id: dentistId, deleteStatus: false})
                if(isExist) {
                    throw new Error('Invalid Dentist ID.');
                }
            },
        },
    },
    dentistId: {
        isString: {
            errorMessage: "Invalid request: Dentist ID"
        },
        trim: true,
        notEmpty: {
            errorMessage: "Dentist ID is required."
        },
        custom: {
            options: async (dentistId) => {
                const isExist = await Admin.findOne({_id: dentistId, deleteStatus: false})
                if(isExist) {
                    throw new Error('Invalid Dentist ID.');
                }
            },
        },
    },
    startDateTime: {
        isString: {
            errorMessage: "Invalid request: Start Date and Time"
        },
        trim: true,
        notEmpty: {
            errorMessage: "Start Date and Time are required.",
        },
        custom: {
            options: async (startDateTime) => {
                if(!moment(startDateTime, "YYYY-MM-DD HH:mm", true).isValid()) {
                     throw new Error('Invalid Start Date and Time.');
                }
            }
        }
    },
    endDateTime: {
        isString: {
            errorMessage: "Invalid request: End Date and Time"
        },
        trim: true,
        notEmpty: {
            errorMessage: "End Date and Time are required.",
        },
        custom: {
            options: async (endDateTime) => {
                if(!moment(endDateTime, "YYYY-MM-DD HH:mm", true).isValid()) {
                     throw new Error('Invalid End Date and Time.');
                }
            }
        }
    },  
}

module.exports = {
    create
}