

const { validationResult } = require("express-validator")

const checkValidationResult = async (req, res, next) => {
    const requestError = validationResult(req);
    if (!requestError.isEmpty()) {
        const errorBody = requestError.array()
        return res.status(422).json({
            status: 422,
            message: errorBody[0]
        });
    }
    next()
}

module.exports = {
  checkValidationResult
};


