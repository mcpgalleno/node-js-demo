const jwt = require('jsonwebtoken');
const Admin = require('../models/admins.model');
const User = require('../models/users.model');

const adminAuth = async (req, res, next) => {
  const invalidatedTokens = [];
  const token = (req.headers["authorization"] || "").split(" ")[1];

  if (!token || invalidatedTokens.includes(token)) {
    return res.status(401).json({ status: 401, message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.JWT_SECRET
    );
    req.loginDetails = decoded;

    const admin = await Admin.findOne({
      _id: req.loginDetails.id
    })

    if(!admin) {
        return res.status(401).json({
            status: 401,
            message: "Unauthorized"
        });
    }
    next();
  } catch (err) {
    if (err) {
      console.log("Token Error", err);
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
            status: 401,
            message: "Unauthorized: Token has expired",
            code: "TOKEN_EXPIRED",
        });
      } else {
        return res.status(401).json({
          status: 401,
          message: "Unauthorized: Invalid token",
          code: "TOKEN_INVALID",
        });
      }
    }
  }
};

const adminAndUserAuth = async (req, res, next) => {

    const invalidatedTokens = [];
    const token = (req.headers["authorization"] || "").split(" ")[1];

    if (!token || invalidatedTokens.includes(token)) {
        return res.status(401).json({ status: 401, message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(
            token.replace("Bearer ", ""),
            process.env.JWT_SECRET
        );
        req.loginDetails = decoded;

        const admin = await Admin.findOne({
            _id: req.loginDetails.id
        })

        const user = await User.findOne({
            _id: req.loginDetails.id
        })

        if(!admin && !user) {
            return res.status(401).json({
                status: 401,
                message: "Unauthorized"
            });
        }

        next();

    } catch (err) {
        if (err) {
            console.log("Token Error", err);
            if (err.name === "TokenExpiredError") {
                return res.status(401).json({
                    status: 401,
                    message: "Unauthorized: Token has expired",
                    code: "TOKEN_EXPIRED",
                });
            } else {
                return res.status(401).json({
                status: 401,
                message: "Unauthorized: Invalid token",
                code: "TOKEN_INVALID",
                });
            }
        }
    }
}

module.exports = {
  adminAuth,
  adminAndUserAuth,
};
