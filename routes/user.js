const express = require('express');
const router = express.Router();
const { verify, isLoggedIn} = require('../auth');
const userController = require('../controllers/user');

// Apply middleware
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get('/details', verify, isLoggedIn, userController.getUserDetails);

module.exports = router;
