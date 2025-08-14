const Admin = require('../models/admins.model');
const mongoose = require('mongoose');

exports.get_admins = async (req, res) => {

  try { 
    const page = 1
    const limit = 10
    const sortBy = "firstName"
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

    const aggregatedAdmins = Admin.aggregate([
        { $match: 
          { deleteStatus: false} 
        },
        {
          $unwind: {
            path: "$specializationIds",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: "$_id", // Group by the original document's ID
            firstName: { $first: "$firstName" }, // Take the first data
            middleName: { $first: "$middleName" },
            lastName: { $first: "$lastName" },
            email: { $first: "$email" },
            mobileNumber: { $first: "$mobileNumber" },
            age: { $first: "$age" },
            address: { $first: "$address" },
            roleId: { $first: "$roleId" },
            isActive: { $first: "$isActive" },
            specializationIds: { $push: "$specializationIds" } // Push all unwound data back into an array
          }
        },
        { 
          $lookup: {
            from: "specializations",
            localField: "specializationIds",
            foreignField: "_id",
            as: "specializations"
          }
        },
        { 
          $lookup: {
            from: "roles",
            localField: "roleId",
            foreignField: "_id",
            as: "role"
          }
        },
        {
          $unwind: {
            path: "$role",
            preserveNullAndEmptyArrays: true,
          },
        },
        { $sort: sortVal },
    ]);

    const admins = await Admin.aggregatePaginate(aggregatedAdmins, options)

    const response = {
        status: 200,
        data: admins
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

exports.get_admin = async (req, res) => {

  try {

    const _id = req.params.id

    if(!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(422).send({
            status: 422,
            message: "Invalid admin Id."
        })
    }

    const aggregatedAdmin = await Admin.aggregate([
        { $match: 
          { _id: mongoose.Types.ObjectId.createFromHexString(_id), isActive: true, deleteStatus: false} 
        },
        {
          $unwind: {
            path: "$specializationIds",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: "$_id", // Group by the original document's ID
            firstName: { $first: "$firstName" }, // Take the first data
            middleName: { $first: "$middleName" },
            lastName: { $first: "$lastName" },
            email: { $first: "$email" },
            mobileNumber: { $first: "$mobileNumber" },
            age: { $first: "$age" },
            address: { $first: "$address" },
            roleId: { $first: "$roleId" },
            isActive: { $first: "$isActive" },
            specializationIds: { $push: "$specializationIds" } // Push all unwound data back into an array
          }
        },
        { 
          $lookup: {
            from: "specializations",
            localField: "specializationIds",
            foreignField: "_id",
            as: "specializations"
          }
        },
        { 
          $lookup: {
            from: "roles",
            localField: "roleId",
            foreignField: "_id",
            as: "role"
          }
        },
        {
          $unwind: {
            path: "$role",
            preserveNullAndEmptyArrays: true,
          },
        }
    ]);

    if(!aggregatedAdmin[0]) {
        return res.status(404 ).send({
            status: 404 ,
            message: "Admin does not exist."
        })
    }

    const response = {
        status: 200,
        data: aggregatedAdmin[0]
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

exports.create_admin = async (req, res) => {
  try {
    const { firstName, middleName, lastName, email, password, mobileNumber, age, address, roleId, specializationIds } = req.body

    const newAdmin = new Admin({
        firstName: firstName,
        middleName: middleName || null,
        lastName: lastName,
        age: age,
        address: address,
        email: email,
        password: password,
        mobileNumber: mobileNumber,
        password: password,
        roleId: roleId,
        specializationIds: specializationIds
    });

    newAdmin.save()
    .then((admin) => {
        return res.status(200).send({
            status: 200,
            message: "Admin created.",
            data: newAdmin
        })
    })
    .catch((error) => {
        console.error('Error creating admin:', error);
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

exports.update_admin = async (req, res) => {
  try {
    const { firstName, middleName, lastName, email, mobileNumber, age, address, roleId, specializationIds, isActive } = req.body
    const _id = req.params.id
    const query = {
        _id: _id,
    }

    if(!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(422).send({
            status: 422,
            message: "Invalid admin Id."
        })
    }

    const isExist = await Admin.findOne({_id: _id, deleteStatus: false})
    
    if(!isExist) {
        return res.status(404 ).send({
            status: 404 ,
            message: "Admin does not exist."
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
            roleId: roleId,
            specializationIds: specializationIds,
            isActive: isActive
        }
    }

    const updateAdmin = await Admin.updateOne(query, newValues);

    return res.status(200).send({
        status: 200,
        message: "Admin updated."
    })

  } catch (error) {
      console.log(error)
      return res.status(400).send({
          status: 400,
          message: error.message
      })
  }
}

exports.delete_admin = async (req, res) => {

  try {

    const _id = req.params.id

    if(!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(422).send({
            status: 422,
            message: "Invalid admin Id."
        })
    }

    const isExist = await Admin.findOne({_id: _id, deleteStatus: false})
    
    if(!isExist) {
        return res.status(404 ).send({
            status: 404 ,
            message: "Admin does not exist."
        })
    }

    const deleteAdmin = await Admin.findByIdAndUpdate(
        { _id: _id },
        { deleteStatus: true, isActive: false }
    );

    return res.status(200).send({
        status: 200,
        message: "Admin deleted."
    })

  } catch (error) {
      console.log(error)
      return res.status(400).send({
          status: 400,
          message: error.message
      })
  }
}

exports.get_admins_dropdowns = async (req, res) => {

  try { 
    const page = 1
    const limit = 10
    const sortBy = "firstName"
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

    const adminDropdowns = await Admin.aggregate([
        { $match: 
          { isActive: true, deleteStatus: false} 
        },
        {
          $unwind: {
            path: "$specializationIds",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: "$_id", // Group by the original document's ID
            firstName: { $first: "$firstName" }, // Take the first data
            middleName: { $first: "$middleName" },
            lastName: { $first: "$lastName" },
          }
        },
        { $sort: sortVal },
    ]);

    const response = {
        status: 200,
        data: adminDropdowns
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

