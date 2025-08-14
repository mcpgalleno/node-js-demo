const Role = require('../models/roles.model');
const mongoose = require('mongoose');

exports.get_roles = async (req, res) => {

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

      const roles = await Role.find(query).sort(options.sort);

      const response = {
          status: 200,
          data: roles
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

exports.get_role = async (req, res) => {

  try {
    const _id = req.params.id

    if(!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(422).send({
            status: 422,
            message: "Invalid role Id."
        })
    }

    const role = await Role.findOne({_id: _id, deleteStatus: false})

    if(!role) {
        return res.status(404 ).send({
            status: 404 ,
            message: "Role does not exist."
        })
    }

    const response = {
        status: 200,
        data: role
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

exports.create_role = async (req, res) => {
  try {
    const { name } = req.body

    const newRole = new Role({
        name: name,
    });

    newRole.save()
    .then((role) => {
        return res.status(200).send({
            status: 200,
            message: "Role created.",
            data: newRole
        })
    })
    .catch((error) => {
        console.error('Error creating role:', error);
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

exports.update_role = async (req, res) => {
  try {
    const { name } = req.body
    const _id = req.params.id
    const query = {
        _id: _id,
    }

    if(!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(422).send({
            status: 422,
            message: "Invalid role Id."
        })
    }

    const isExist = await Role.findOne({_id: _id, deleteStatus: false})
    
    if(!isExist) {
        return res.status(404 ).send({
            status: 404 ,
            message: "Role does not exist."
        })
    }

    const newValues = {
        $set: {
            name: name,
        }
    }

    const updateRole = await Role.updateOne(query, newValues);

    return res.status(200).send({
        status: 200,
        message: "Role updated."
    })

  } catch (error) {
    console.log(error)
    return res.status(400).send({
        status: 400,
        message: error.message
    })
  }
}

exports.delete_role = async (req, res) => {

  try {
    const _id = req.params.id

    if(!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(422).send({
            status: 422,
            message: "Invalid role Id."
        })
    }

    const isExist = await Role.findOne({_id: _id, deleteStatus: false})
    
    if(!isExist) {
        return res.status(404).send({
            status: 404 ,
            message: "Role does not exist."
        })
    }

    const deleteRole = await Role.findByIdAndUpdate(
        { _id: _id },
        { deleteStatus: true }
    );

    return res.status(200).send({
        status: 200,
        message: "Role deleted."
    })
  } catch (error) {
    console.log(error)
    return res.status(400).send({
        status: 400,
        message: error.message
    })
  }
}

