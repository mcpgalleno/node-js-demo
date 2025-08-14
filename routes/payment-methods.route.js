const express = require("express");
const router = express.Router();
const PaymentMethodsController = require("../controllers/PaymentMethods");
const { adminAuth, adminAndUserAuth } = require("../middlewares/auth");

router.get('/', adminAndUserAuth, PaymentMethodsController.get_paymentMethods)
router.get('/:id', adminAuth, PaymentMethodsController.get_paymentMethod)
router.post('/create', adminAuth, PaymentMethodsController.create_paymentMethod)
router.put('/:id', adminAuth, PaymentMethodsController.update_paymentMethod)
router.patch('/:id', adminAuth, PaymentMethodsController.delete_paymentMethod)

module.exports = router