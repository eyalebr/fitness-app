const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// נתיב להרשמה
router.post('/register', userController.register);

// נתיב להתחברות
router.post('/login', userController.login);

// נתיב לעדכון סיסמה
router.put('/update-password', userController.updatePassword);

// --- הוסף כאן את הנתיב החדש ---
router.delete('/delete-account/:userId', userController.deleteAccount);

module.exports = router;