const Workout = require('../models/Workout'); // מייבאים את המודל שיצרנו

// 1. פונקציה ליצירת אימון חדש (Create)
const createWorkout = async (req, res) => {
    try {
        // req.body מכיל את הנתונים שהלקוח (ה-HTML) שלח לנו
        const newWorkout = await Workout.create(req.body);
        
        // מחזירים תשובה מוצלחת (סטטוס 201 = Created) עם הנתונים שנשמרו
        res.status(201).json(newWorkout);
    } catch (error) {
        // המרצה דורש טיפול מסודר בשגיאות, אז אנחנו מחזירים הודעה ברורה
        res.status(400).json({ message: 'Error creating workout', error: error.message });
    }
};

// 2. פונקציה לשליפת כל האימונים (Read)
const getWorkouts = async (req, res) => {
    try {
        // שולף את כל האימונים ממסד הנתונים, ממוינים מהחדש לישן
        const workouts = await Workout.find().sort({ createdAt: -1 });
        
        res.status(200).json(workouts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching workouts', error: error.message });
    }
};

// 3. פונקציה לעדכון אימון קיים (Update)
const updateWorkout = async (req, res) => {
    try {
        // req.params.id - זה ה-ID שנעביר בכתובת ה-URL
        // req.body - אלו הנתונים החדשים שאנחנו רוצים לעדכן
        // { new: true } - אומר למונגו להחזיר לנו את האימון *אחרי* העדכון ולא לפניו
        const updatedWorkout = await Workout.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        );

        if (!updatedWorkout) {
            return res.status(404).json({ message: 'Workout not found' });
        }
        res.status(200).json(updatedWorkout);
    } catch (error) {
        res.status(400).json({ message: 'Error updating workout', error: error.message });
    }
};

// 4. פונקציה למחיקת אימון (Delete)
const deleteWorkout = async (req, res) => {
    try {
        const deletedWorkout = await Workout.findByIdAndDelete(req.params.id);
        
        if (!deletedWorkout) {
            return res.status(404).json({ message: 'Workout not found' });
        }
        res.status(200).json({ message: 'Workout deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting workout', error: error.message });
    }
};

// 5. שאילתה מורכבת 1: סינון אימונים לפי סוג פעילות
const getWorkoutsByType = async (req, res) => {
    try {
        // שולפים מה-URL את סוג הפעילות (למשל: Running) ומחפשים רק את האימונים שתואמים
        const activityType = req.params.type;
        const workouts = await Workout.find({ activityType: activityType }).sort({ createdAt: -1 });
        
        res.status(200).json(workouts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching workouts by type', error: error.message });
    }
};

// 6. שאילתה מורכבת 2: סטטיסטיקות מתקדמות (Aggregation)
const getWorkoutStats = async (req, res) => {
    try {
        // שימוש ב-Aggregation Pipeline של מונגו כדי לבצע חישובים מתמטיים על כל הנתונים
        const stats = await Workout.aggregate([
            {
                $group: {
                    _id: null, // אנחנו רוצים לסכם את הכל לקבוצה אחת גדולה
                    totalWorkouts: { $sum: 1 }, // סופר כמה אימונים יש סך הכל
                    totalCalories: { $sum: "$calories" }, // מחבר את כל הקלוריות
                    totalDuration: { $sum: "$duration" } // מחבר את כל דקות האימון
                }
            }
        ]);

        // אם אין אימונים בכלל, נחזיר אפסים כדי שהלקוח לא יקרוס
        if (stats.length === 0) {
            return res.status(200).json({ totalWorkouts: 0, totalCalories: 0, totalDuration: 0 });
        }

        res.status(200).json(stats[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error calculating stats', error: error.message });
    }
};

// מייצאים את הפונקציות כדי שהראוטס יוכלו להשתמש בהן
module.exports = {
    createWorkout,
    getWorkouts,
    updateWorkout,
    deleteWorkout,
    getWorkoutsByType, 
    getWorkoutStats   
};