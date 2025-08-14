const express = require("express");
const router = express.Router();
const UserController = require("../controllers/Users");
const { adminAuth, adminAndUserAuth } = require("../middlewares/auth");
const { checkSchema } = require("express-validator")
const userValidator = require("../validators/users")
const { checkValidationResult } = require("../middlewares/validation-result")

router.get('/', adminAuth, UserController.get_users)
router.get('/:id', adminAndUserAuth, UserController.get_user)
router.post('/create', [checkSchema(userValidator.create), checkValidationResult], UserController.create_user)
router.put('/:id', adminAndUserAuth, [checkSchema(userValidator.update), checkValidationResult], UserController.update_user)
router.patch('/:id', adminAuth, UserController.delete_user)

module.exports = router