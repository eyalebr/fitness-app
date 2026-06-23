const mongoose = require('mongoose');

// אנחנו מגדירים כאן את ה"סכמה" (Schema) - התבנית שלפיה כל אימון יישמר במסד הנתונים
const workoutSchema = new mongoose.Schema({
    title: {
        type: String, // סוג הנתון הוא טקסט
        required: true // חובה להזין כותרת, אי אפשר לשמור אימון בלי זה
    },
    description: {
        type: String,
        required: true
    },
    activityType: {
        type: String,
        // enum אומר שמותר לשמור רק את אחד מהערכים שברשימה הזו (מונע שגיאות של משתמשים)
        enum: ['Running', 'Walking', 'Cycling', 'Custom'], 
        required: true
    },
    duration: {
        type: Number, // משך האימון בדקות (מספר)
        required: true
    },
    calories: {
        type: Number, // קלוריות שנשרפו
        default: 0 // אם המשתמש לא הזין קלוריות, נשמור 0 כברירת מחדל
    }
}, { 
    timestamps: true // טריק מעולה: מונגו יוסיף אוטומטית שדות של "מתי נוצר" (createdAt) ו"מתי עודכן" (updatedAt)
});

// אנחנו מייצאים את המודל כדי שנוכל להשתמש בו בשאר חלקי השרת
module.exports = mongoose.model('Workout', workoutSchema);