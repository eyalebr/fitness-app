// 1. טעינת הספריות שהתקנו
require('dotenv').config(); // מאפשר לקרוא נתונים מקובץ ה-.env
const express = require('express'); // המסגרת של השרת
const cors = require('cors'); // מאפשר לצד הלקוח לתקשר עם השרת
const connectDB = require('./config/db'); // <--: ייבוא פונקציית החיבור
// <--: ייבוא קובץ הראוטס שיצרנו
const workoutRoutes = require('./routes/workoutRoutes');
const externalRoutes = require('./routes/externalRoutes');
// 2. אתחול השרת
const app = express();
// <--: הפעלת החיבור למסד הנתונים
connectDB();

// 3. הגדרת Middlewares (אמצעים שהבקשות עוברות דרכם)
app.use(cors()); // אישור תקשורת מצד הלקוח
app.use(express.json()); // מאפשר לשרת לקרוא מידע שנשלח אליו בפורמט JSON

// 4. הגדרת נתיב (Route) בסיסי לבדיקה
// כשהלקוח יפנה לכתובת הראשית של השרת ('/'), הוא יקבל את התשובה הזו
app.get('/', (req, res) => {
    res.send('Fitness Tracking API is running! 🚀');
});

// <-- חדש: הגדרת הכתובת הראשית לאימונים
// כל בקשה שתתחיל ב- /api/workouts תופנה לקובץ הראוטס שלנו
app.use('/api/workouts', workoutRoutes);
app.use('/api/explore', externalRoutes);
// 5. הגדרת הפורט והפעלת השרת
// השרת יחפש את הפורט בקובץ ה-.env, ואם לא ימצא, ישתמש ב-5000 כברירת מחדל
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running smoothly on port ${PORT}`);
});