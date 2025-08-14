const Appointment = require('../models/appointments.model');
const Admin = require('../models/admins.model');
const User = require('../models/users.model');
const mongoose = require('mongoose');
const Specialization = require('../models/specializations.model');

exports.get_appointments = async (req, res) => {

    try {
        const query = {
            deleteStatus: false,
        };
        
        const admin = await Admin.findOne({_id: req.loginDetails.id, deleteStatus: false, isActive: true})
        
        if(!admin) {
            query.userId =  mongoose.Types.ObjectId.createFromHexString(req.loginDetails.id)
        }

        const page = 1
        const limit = 10
        const sortBy = "createdAt"
        const sortType = "desc"

        const options = {
            page: page, 
            limit: limit,
        };

        let sortVal = {}

        if (sortBy) {
            sortVal[sortBy] = sortType === "desc" ? -1 : 1;
        } else {
            sortVal["createdAt"] = -1;
        }

        const aggregatedAppointments = Appointment.aggregate([
            { $match: query },
            { 
                $lookup: {
                    from: "admins",
                    localField: "dentistId",
                    foreignField: "_id",
                    as: "dentist"
                }
            },
            {
                $unwind: {
                    path: '$dentist',
                    preserveNullAndEmptyArrays: true
                }
            },
            { 
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $unwind: {
                    path: '$user',
                    preserveNullAndEmptyArrays: true,
                }
            },
            {
                $project: {
                    _id: '$_id',
                    userId: '$userId',
                    user: {
                        _id: '$user._id',
                        firstName: '$user.firstName',
                        middleName: '$user.middleName',
                        lastName: '$user.lastName',
                        email: '$user.email',
                        mobileNumber: '$user.mobileNumber',
                        age: '$user.age',
                        address: '$user.address',
                        isActive: '$user.isActive',
                        deleteStatus: '$user.deleteStatus',
                    },
                    status: '$status',
                    procedure: '$procedure',
                    otherDetails: '$otherDetails',
                    dentistId: '$dentistId',
                    dentist: {
                        _id: '$dentist._id',
                        firstName: '$dentist.firstName',
                        middleName: '$dentist.middleName',
                        lastName: '$dentist.lastName',
                        email: '$dentist.email',
                        mobileNumber: '$dentist.mobileNumber',
                        age: '$dentist.age',
                        address: '$dentist.address',
                        isActive: '$dentist.isActive',
                        deleteStatus: '$dentist.deleteStatus',
                        roleId: '$dentist.roleId',
                        specializationIds: '$dentist.specializationIds',
                    },
                    startDateTime: '$startDateTime',
                    endDateTime: '$endDateTime',
                    totalAmount: '$totalAmount',
                    paymentMethodId: '$paymentMethodId',
                    paymentStatus: '$paymentStatus',
                    deleteStatus: '$deleteStatus',
                }
            },
            { 
                $lookup: {
                    from: "roles",
                    localField: "dentist.roleId",
                    foreignField: "_id",
                    as: "dentist.role"
                }
            },
            {
                $unwind: {
                    path: '$dentist.role',
                    preserveNullAndEmptyArrays: true
                }
            },
            { 
                $lookup: {
                    from: "specializations",
                    localField: "dentist.specializationIds",
                    foreignField: "_id",
                    as: "dentist.specializations"
                }
            },
            { 
                $lookup: {
                    from: "payment_methods",
                    localField: "paymentMethodId",
                    foreignField: "_id",
                    as: "paymentMethod"
                }
            },
            {
                $unwind: {
                    path: '$paymentMethod',
                    preserveNullAndEmptyArrays: true
                }
            },
            { $sort: sortVal },
        ]);

        const appointments = await Appointment.aggregatePaginate(aggregatedAppointments, options)

        const response = {
            status: 200,
            data: appointments
        }

        return res.status(200).send(response)

    } catch (error) {
      console.log(error)
      return res.status(400).send({
          status: 400,
          message: error.message
      })
    }
}

exports.get_appointment = async (req, res) => {

    try {
        const _id = req.params.id

        if(!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(422).send({
                status: 422,
                message: "Invalid appointment Id."
            })
        }

        const aggregatedAppointment = await Appointment.aggregate([
            { $match: {_id: mongoose.Types.ObjectId.createFromHexString(_id), deleteStatus: false} },
            { 
                $lookup: {
                    from: "admins",
                    localField: "dentistId",
                    foreignField: "_id",
                    as: "dentist"
                }
            },
            {
                $unwind: {
                    path: '$dentist',
                    preserveNullAndEmptyArrays: true,
                }
            },
            { 
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $unwind: {
                    path: '$user',
                    preserveNullAndEmptyArrays: true,
                }
            },
            {
                $project: {
                    _id: '$_id',
                    userId: '$userId',
                    user: {
                        _id: '$user._id',
                        firstName: '$user.firstName',
                        middleName: '$user.middleName',
                        lastName: '$user.lastName',
                        email: '$user.email',
                        mobileNumber: '$user.mobileNumber',
                        age: '$user.age',
                        address: '$user.address',
                        isActive: '$user.isActive',
                        deleteStatus: '$user.deleteStatus',
                    },
                    status: '$status',
                    procedure: '$procedure',
                    otherDetails: '$otherDetails',
                    dentistId: '$dentistId',
                    dentist: {
                        _id: '$dentist._id',
                        firstName: '$dentist.firstName',
                        middleName: '$dentist.middleName',
                        lastName: '$dentist.lastName',
                        email: '$dentist.email',
                        mobileNumber: '$dentist.mobileNumber',
                        age: '$dentist.age',
                        address: '$dentist.address',
                        isActive: '$dentist.isActive',
                        deleteStatus: '$dentist.deleteStatus',
                        roleId: '$dentist.roleId',
                        specializationIds: '$dentist.specializationIds',
                    },
                    startDateTime: '$startDateTime',
                    endDateTime: '$endDateTime',
                    totalAmount: '$totalAmount',
                    paymentMethodId: '$paymentMethodId',
                    paymentStatus: '$paymentStatus',
                    deleteStatus: '$deleteStatus',
                }
            },
            { 
                $lookup: {
                    from: "roles",
                    localField: "dentist.roleId",
                    foreignField: "_id",
                    as: "dentist.role"
                }
            },
            {
                $unwind: {
                    path: '$dentist.role',
                    preserveNullAndEmptyArrays: true,
                }
            },
            { 
                $lookup: {
                    from: "specializations",
                    localField: "dentist.specializationIds",
                    foreignField: "_id",
                    as: "dentist.specializations"
                }
            },
            { 
                $lookup: {
                    from: "payment_methods",
                    localField: "paymentMethodId",
                    foreignField: "_id",
                    as: "paymentMethod"
                }
            },
            {
                $unwind: {
                    path: '$paymentMethod',
                    preserveNullAndEmptyArrays: true,
                }
            },
        ]);

        if(!aggregatedAppointment[0]) {
            return res.status(404 ).send({
                status: 404 ,
                message: "Appointment does not exist."
            })
        }

        const response = {
            status: 200,
            data: aggregatedAppointment[0]
        }

        return res.status(200).send(response)

    } catch (error) {
      console.log(error)
      return res.status(400).send({
          status: 400,
          message: error.message
      })
    }
}

exports.create_appointment = async (req, res) => {
    try {
        const { userId, procedure, otherDetails, dentistId, startDateTime, endDateTime } = req.body

        const isAdmin = await Admin.findOne({_id: req.loginDetails.id, deleteStatus: false, isActive: true})

        const newAppointment = new Appointment({
            userId: !isAdmin ? req.loginDetails.id : userId,
            procedure: procedure,
            otherDetails: otherDetails,
            dentistId: dentistId,
            startDateTime: new Date(startDateTime).toISOString(),
            endDateTime: new Date(endDateTime).toISOString(),
        });

        newAppointment.save()
        .then((appointment) => {
            return res.status(200).send({
                status: 200,
                message: "Appointment created.",
                data: newAppointment
            })
        })
        .catch((error) => {
            console.error('Error creating appointment:', error);
            return res.status(400).send({
                status: 400,
                message: error.message
            })
        });

    } catch (error) {
      console.log(error)
      return res.status(400).send({
          status: 400,
          message: error.message
      })
    }
}

exports.update_appointment = async (req, res) => {
    
    try {
        const { userId, status, procedure, otherDetails, dentistId, startDateTime, endDateTime, totalAmount, paymentMethodId, paymentStatus } = req.body
        const _id = req.params.id
        const query = {
            _id: _id
        }

        if(!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(422).send({
                status: 422,
                message: "Invalid appointment Id."
            })
        }

        const appointment = await Appointment.findById(_id)

        if(!appointment) {
            return res.status(404 ).send({
                status: 404 ,
                message: "Appointment does not exist."
            })
        }

        const valuesToSet = {
            status: status,
            procedure: procedure,
            otherDetails: otherDetails,
            dentistId: dentistId,
            startDateTime: new Date(startDateTime).toISOString(),
            endDateTime: new Date(endDateTime).toISOString(),
            totalAmount: totalAmount,
            paymentMethodId: paymentMethodId,
            paymentStatus: paymentStatus
        }

        const user = await User.findOne({_id: req.loginDetails.id, deleteStatus: false, isActive: true})
        
        if(user) {
            if(!user._id.equals(appointment.userId)) {
                return res.status(401).send({
                    status: 401 ,
                    message: "Unauthorized"
                })
            }
        } else {
            const admin = await Admin.findOne({_id: req.loginDetails.id, deleteStatus: false, isActive: true})
            if(admin) {
                if(userId) {
                    const isUserExist = await User.findOne({_id: userId, deleteStatus: false, isActive: true})
                    if(isUserExist) {
                        valuesToSet.userId = userId
                    }
                }
            }
        }

        const newValues = {
            $set: valuesToSet
        }

        const updateAppointment = await Appointment.updateOne(query, newValues);

        return res.status(200).send({
            status: 200,
            message: "Appointment updated."
        })
    } catch (error) {
      console.log(error)
      return res.status(400).send({
          status: 400,
          message: error.message
      })
    }
}

exports.delete_appointment = async (req, res) => {

    try {
        const _id = req.params.id

        if(!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(422).send({
                status: 422,
                message: "Invalid appointment Id."
            })
        }

        const isExist = await Appointment.findOne({_id: _id, deleteStatus: false})

        if(!isExist) {
            return res.status(404 ).send({
                status: 404 ,
                message: "Appointment does not exist."
            })
        }

        const deleteAppointment = await Appointment.findByIdAndUpdate(
            { _id: _id },
            { deleteStatus: true }
        );

        return res.status(200).send({
            status: 200,
            message: "Appointment deleted."
        })

    } catch (error) {
      console.log(error)
      return res.status(400).send({
          status: 400,
          message: error.message
      })
    }
}

