const express = require("express");
const router = express.Router();
const RoleController = require("../controllers/Roles");
const { adminAuth, adminAndUserAuth } = require("../middlewares/auth");

router.get('/', adminAuth, RoleController.get_roles)
router.get('/:id', adminAuth, RoleController.get_role)
router.post('/create', adminAuth, RoleController.create_role)
router.put('/:id', adminAuth, RoleController.update_role)
router.patch('/:id', adminAuth, RoleController.delete_role)

module.exports = router