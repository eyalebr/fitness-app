const User = require('../models/User');
const bcrypt = require('bcrypt'); // הוספנו את ספריית ההצפנה

// פונקציה להרשמת משתמש חדש
exports.register = async (req, res) => {
    try {
        const { fullName, birthDate, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email.' });
        }

        // --- הצפנת הסיסמה ---
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // שמירת המשתמש עם הסיסמה המוצפנת
        const newUser = new User({ 
            fullName, 
            birthDate, 
            email, 
            password: hashedPassword 
        });
        
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully!', user: { _id: newUser._id ,fullName: newUser.fullName, email: newUser.email } });
    } catch (error) {
        console.error('Error in register:', error);
        res.status(500).json({ message: 'Server error during registration.' });
    }
};

// פונקציה להתחברות משתמש קיים
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        // --- השוואת הסיסמה שהוזנה לסיסמה המוצפנת במסד הנתונים ---
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        res.status(200).json({ message: 'Login successful!', user: { _id: user._id, fullName: user.fullName, email: user.email } });
    } catch (error) {
        console.error('Error in login:', error);
        res.status(500).json({ message: 'Server error during login.' });
    }
};

exports.updatePassword = async (req, res) => {
    try {
        const { userId, newPassword } = req.body;

        // 1. הצפנת הסיסמה החדשה
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        
        // 2. עדכון המשתמש במסד הנתונים
        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            { password: hashedPassword }, 
            { returnDocument: 'after' }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Error in updatePassword:", error);
        res.status(500).json({ message: "Server error" });
    }
};