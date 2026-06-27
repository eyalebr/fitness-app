// 1. טעינת הספריות שהתקנו
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');

// ייבוא הראוטים
const workoutRoutes = require('./routes/workoutRoutes');
const externalRoutes = require('./routes/externalRoutes');
const userRoutes = require('./routes/userRoutes');

// 2. אתחול השרת
const app = express();
connectDB();

// 3. הגדרת Middlewares
app.use(cors());
app.use(express.json());

// הגדרת תיקיית ה-client כסטטית (התיקון שלנו!)
// השרת יוצא מהתיקייה שלו (../) ונכנס לתיקיית client כדי להגיש את כל ה-HTML
app.use(express.static(path.join(__dirname, '../client')));

// 4. הגדרת הראוטים של ה-API (הבקשות למידע)
app.use('/api/workouts', workoutRoutes);
app.use('/api/explore', externalRoutes);
app.use('/api/users', userRoutes);

// 5. הפעלת השרת
(async () => {
    const { default: getPort } = await import('get-port');
    const PORT = await getPort({ port: process.env.PORT || 3000 });
    app.listen(PORT, () => {
        console.log(`Server is running smoothly on port ${PORT}`);
    });
})();