const PaymentMethod = require('../models/payment-methods.model');
const mongoose = require('mongoose');

exports.get_paymentMethods = async (req, res) => {

    try {

        const query = {
            deleteStatus: false
        };

        const paymentMethods = await PaymentMethod.find({});

        const response = {
            status: 200,
            data: paymentMethods
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

exports.get_paymentMethod = async (req, res) => {

    try {

        const _id = req.params.id

        if(!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(422).send({
                status: 422,
                message: "Invalid payment method Id."
            })
        }

        const paymentMethod = await PaymentMethod.findOne({_id: _id, deleteStatus: false})
        if(!paymentMethod) {
            return res.status(404 ).send({
                status: 404 ,
                message: "Payment method does not exist."
            })
        }

        const response = {
            status: 200,
            data: paymentMethod
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

exports.create_paymentMethod = async (req, res) => {

    try {

        const { name } = req.body

        const newPaymentMethod = new PaymentMethod({
            name: name,
        });

        newPaymentMethod.save()
        .then((paymentMethod) => {
            return res.status(200).send({
                status: 200,
                message: "Payment method created.",
                data: newPaymentMethod
            })
        })
        .catch((error) => {
            console.error('Error creating payment method:', error);
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

exports.update_paymentMethod = async (req, res) => {

    try {
        const { name } = req.body
        const _id = req.params.id
        const query = {
            _id: _id
        }

        if(!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(422).send({
                status: 422,
                message: "Invalid payment method Id."
            })
        }

        const isExist = await PaymentMethod.findOne({_id: _id, deleteStatus: false})

        if(!isExist) {
            return res.status(404 ).send({
                status: 404 ,
                message: "Payment method does not exist."
            })
        }

        const newValues = {
            $set: {
                name: name,
            }
        }

        const updatePaymentMethod = await PaymentMethod.updateOne(query, newValues);

        const response = {
            status: 200,
            message: "Payment method updated.",
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

exports.delete_paymentMethod = async (req, res) => {

    try {
        const _id = req.params.id

        if(!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(422).send({
                status: 422,
                message: "Invalid payment method Id."
            })
        }

        const isExist = await PaymentMethod.findOne({_id: _id, deleteStatus: false})

        if(!isExist) {
            return res.status(404 ).send({
                status: 404 ,
                message: "Payment method does not exist."
            })
        }

        const deletePaymentMethod = await PaymentMethod.findByIdAndUpdate(
            { _id: _id },
            { deleteStatus: true }
        );

        const response = {
            status: 200,
            message: "Payment method deleted.",
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

