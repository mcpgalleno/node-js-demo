const Admin = require('../models/admins.model');
const Role = require('../models/roles.model');
const User = require('../models/users.model');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.login = async (req, res) => {
  
  try {
    const { email, password } = req.body

    const adminDetails = await Admin.findOne({ email: email, deleteStatus: false, isActive: true });
    const userDetails = await User.findOne({ email: email, deleteStatus: false, isActive: true });

    if(!adminDetails && !userDetails) { 
      return res.status(401).send({ message: "Invalid Email and Password" });
    }
    
    let data = ""
    let role = ""

    if(adminDetails) {
        const query = [
            {
                $match: {
                email: email,
                deleteStatus: false,
                isActive: true
                },
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
        ]

        const aggregatedAdmin = await Admin.aggregate(query)
        data = aggregatedAdmin.length > 0 ? aggregatedAdmin[0] : null
        role  = await Role.findById(data.roleId)
    }

    if(userDetails) {
        data = userDetails
    }
    
    bcrypt.compare(password, data.password, async (err, result) => {
      if(!result) {
        return res.status(401).send({ message: "Invalid Email and Password" });
      }

      const token = jwt.sign(
        { id: data._id,
          email: data.email, 
        },
        process.env.JWT_SECRET, // Store your secret securely in environment variables
        { expiresIn: '1h' } // Token expires in 1 hour
      );

      res.status(200).send(
        { 
          status: 200,
          message: "Logged in successfully.", 
          data: {
            _id: data._id,
            role: adminDetails ? role.name : null,
            accessToken: token,
            user: data
          }

        }
      );
    })

  } catch (err) {
    console.log(err)
    res.status(400).send(err);
  }

}