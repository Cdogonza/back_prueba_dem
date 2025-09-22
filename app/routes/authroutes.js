const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/reset-password/:email', authController.resetPassword);
router.post('/change-password', authController.changePassword);
router.post('/getUsers', authController.getUsers);
router.post('/new-password', authController.newPassword);
router.post('/delete-user', authController.deleteUser);
router.post('/update-user/:id', authController.updateUser);
router.post('/resetDefault/:email', authController.resetPassword);


module.exports = router;