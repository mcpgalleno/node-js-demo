const express = require("express");
const router = express.Router();
const AuthenticationController = require("../controllers/Authentication");

router.post('/login', AuthenticationController.login)

module.exports = router