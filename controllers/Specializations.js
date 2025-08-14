const Specialization = require('../models/specializations.model');
const mongoose = require('mongoose');

exports.get_specializations = async (req, res) => {
    try {
        const query = {
            deleteStatus: false,
        };

        const sortBy = "name"
        const sortType = "desc"

        const options = {
        sort: {}
        };

        if (sortBy) {
        options.sort[sortBy] = sortType === "desc" ? -1 : 1;
        } else {
        options.sort["createdAt"] = -1;
        }

        const specializations = await Specialization.find(query).sort(options.sort);

        const response = {
            status: 200,
            data: specializations
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

exports.get_specialization = async (req, res) => {

  try {
        const _id = req.params.id

        if(!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(422).send({
                status: 422,
                message: "Invalid specialization Id."
            })
        }

        const specialization = await Specialization.findOne({_id: _id, deleteStatus: false})

        if(!specialization) {
            return res.status(404 ).send({
                status: 404 ,
                message: "Specialization does not exist."
            })
        }

        const response = {
            status: 200,
            data: specialization
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

exports.create_specialization = async (req, res) => {
  try {
        const { name } = req.body

        const newSpecialization = new Specialization({
            name: name,
        });

        newSpecialization.save()
        .then((specialization) => {
            return res.status(200).send({
                status: 200,
                message: "Specialization created.",
                data: newSpecialization
            })
        })
        .catch((error) => {
            console.error('Error creating specialization:', error);
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

exports.update_specialization = async (req, res) => {

  try {
        const { name } = req.body
        const _id = req.params.id
        const query = {
            _id: _id,
        }

        if(!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(422).send({
                status: 422,
                message: "Invalid specialization Id."
            })
        }

        const isExist = await Specialization.findOne({_id: _id, deleteStatus: false})
        
        if(!isExist) {
            return res.status(404 ).send({
                status: 404 ,
                message: "Specialization does not exist."
            })
        }

        const newValues = {
            $set: {
                name: name,
            }
        }

        const updateSpecialization = await Specialization.updateOne(query, newValues);

        return res.status(200).send({
            status: 200,
            message: "Specialization updated."
        })
    } catch (error) {
        console.log(error)
        return res.status(400).send({
            status: 400,
            message: error.message
        })
    }
}

exports.delete_specialization = async (req, res) => {

  try {
        const _id = req.params.id

        if(!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(422).send({
                status: 422,
                message: "Invalid specialization Id."
            })
        }

        const isExist = await Specialization.findOne({_id: _id, deleteStatus: false})
        
        if(!isExist) {
            return res.status(404).send({
                status: 404 ,
                message: "Specialization does not exist."
            })
        }

        const deleteSpecialization = await Specialization.findByIdAndUpdate(
            { _id: _id },
            { deleteStatus: true }
        );

        return res.status(200).send({
            status: 200,
            message: "Specialization deleted."
        })

    } catch (error) {
        console.log(error)
        return res.status(400).send({
            status: 400,
            message: error.message
        })
    }
}

