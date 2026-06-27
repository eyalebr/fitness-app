const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// נתיב להרשמה (POST /api/users/register)
router.post('/register', userController.register);

// נתיב להתחברות (POST /api/users/login)
router.post('/login', userController.login);

// הוסף את השורה הזו מתחת לנתיב ה-login הקיים
router.put('/update-password', userController.updatePassword);
module.exports = router;