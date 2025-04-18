const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/reset-password', authController.resetPassword);
router.post('/change-password', authController.changePassword);
router.post('/getUsers', authController.getUsers);
router.post('/new-password', authController.newPassword);


module.exports = router;