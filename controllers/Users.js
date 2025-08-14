const User = require('../models/users.model');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.get_users = async (req, res) => {

    try {
        const query = {
            deleteStatus: false
        };

        const page = 1
        const limit = 10
        const sortBy = "firstName"
        const sortType = "desc"

        const options = {
        page: parseInt(page, 10) || 1,
        limit: parseInt(limit, 10) || 10,
        sort: {}
        };

        if (sortBy) {
        options.sort[sortBy] = sortType === "desc" ? -1 : 1;
        } else {
        options.sort["createdAt"] = -1;
        }

        const users = await User.paginate(query, options);

        const response = {
            status: 200,
            data: users
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

exports.get_user = async (req, res) => {

    try {
        const _id = req.params.id

        if(!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(422).send({
                status: 422,
                message: "Invalid user Id."
            })
        }

        const user = await User.findById(_id).select('-password');

        if(!user) {
            return res.status(404 ).send({
                status: 404 ,
                message: "User does not exist."
            })
        }

        const response = {
            status: 200,
            data: user
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

exports.create_user = async (req, res) => {
    try {

        const { firstName, middleName, lastName, email, password, mobileNumber, age, address } = req.body

        const newUser = new User({
            firstName: firstName,
            middleName: middleName || null,
            lastName: lastName,
            age: age,
            address: address,
            email: email,
            password: password,
            mobileNumber: mobileNumber,
        });

        newUser.save()
        .then((user) => {
            return res.status(200).send({
                status: 200,
                message: "User created.",
                data: newUser
            })
        })
        .catch((error) => {
            console.error('Error creating user:', error);
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

exports.update_user = async (req, res) => {
    try {
        const { firstName, middleName, lastName, email, mobileNumber, age, address, isActive } = req.body
        const _id = req.params.id
        const query = {
            _id: _id
        }

        if(!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(422).send({
                status: 422,
                message: "Invalid user Id."
            })
        }

        const isExist = await User.findOne({_id: _id, deleteStatus: false})

        if(!isExist) {
            return res.status(404 ).send({
                status: 404 ,
                message: "User does not exist."
            })
        }

        const newValues = {
            $set: {
                firstName: firstName,
                middleName: middleName,
                lastName: lastName,
                age: age,
                address: address,
                email: email,
                mobileNumber: mobileNumber,
                isActive: isActive
            }
        }

        const updateUser = await User.updateOne(query, newValues);

        return res.status(200).send({
            status: 200,
            message: "User updated."
        })
    } catch (error) {
        console.log(error)
        return res.status(400).send({
            status: 400,
            message: error.message
        })
    }
}

exports.delete_user = async (req, res) => {
    try {
        const _id = req.params.id

        if(!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(422).send({
                status: 422,
                message: "Invalid user Id."
            })
        }

        const isExist = await User.findOne({_id: _id, deleteStatus: false})

        if(!isExist) {
            return res.status(404 ).send({
                status: 404 ,
                message: "User does not exist."
            })
        }

        const deleteUser = await User.findByIdAndUpdate(
            { _id: _id },
            { deleteStatus: true, isActive: false }
        );

        return res.status(200).send({
            status: 200,
            message: "User deleted."
        })

    } catch (error) {
        console.log(error)
        return res.status(400).send({
            status: 400,
            message: error.message
        })
    }
}