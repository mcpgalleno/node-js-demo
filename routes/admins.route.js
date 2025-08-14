const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/Admins");
const { adminAuth, adminAndUserAuth } = require("../middlewares/auth");
const { checkSchema } = require("express-validator")
const adminValidator = require("../validators/admins")
const { checkValidationResult } = require("../middlewares/validation-result")

router.get('/dropdown', adminAndUserAuth,  AdminController.get_admins_dropdowns)
router.get('/', adminAuth,  AdminController.get_admins)
router.get('/:id', adminAuth, AdminController.get_admin)
router.post('/create', adminAuth, [checkSchema(adminValidator.create), checkValidationResult],  AdminController.create_admin)
router.put('/:id', adminAuth, [checkSchema(adminValidator.update), checkValidationResult], AdminController.update_admin)
router.patch('/:id', adminAuth, AdminController.delete_admin)

module.exports = router