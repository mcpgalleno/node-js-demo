const express = require("express");
const router = express.Router();
const SpecilizationController = require("../controllers/Specializations");
const { adminAuth } = require("../middlewares/auth");

router.get('/', adminAuth, SpecilizationController.get_specializations)
router.get('/:id', adminAuth, SpecilizationController.get_specialization)
router.post('/create', adminAuth, SpecilizationController.create_specialization)
router.put('/:id', adminAuth, SpecilizationController.update_specialization)
router.patch('/:id', adminAuth, SpecilizationController.delete_specialization)

module.exports = router