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

// 6. שאילתה מורכבת: סטטיסטיקות יומיות ושבועיות
const getWorkoutStats = async (req, res) => {
    try {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());

        // 1. סיכום נתונים יומיים
        const dailyStats = await Workout.aggregate([
            { $match: { createdAt: { $gte: startOfToday } } },
            { $group: { 
                _id: null, 
                steps: { $sum: "$steps" }, 
                calories: { $sum: "$calories" }, 
                duration: { $sum: "$duration" } 
            }}
        ]);

        // 2. סיכום נתונים שבועיים
        const weeklyStats = await Workout.aggregate([
            { $match: { createdAt: { $gte: startOfWeek } } },
            { $group: { 
                _id: null, 
                totalWorkouts: { $sum: 1 }, 
                totalDistance: { $sum: "$distance" }, 
                totalCalories: { $sum: "$calories" } 
            }}
        ]);

        // שליחת התשובה המאוחדת
        res.status(200).json({
            daily: dailyStats[0] || { steps: 0, calories: 0, duration: 0 },
            weekly: weeklyStats[0] || { totalWorkouts: 0, totalDistance: 0, totalCalories: 0 }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error calculating stats', error: error.message });
    }
};

const getWeeklyChartData = async (req, res) => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const chartData = await Workout.aggregate([
            { $match: { createdAt: { $gte: sevenDaysAgo } } },
            { 
                $group: { 
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    totalCalories: { $sum: "$calories" }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        res.status(200).json(chartData);
    } catch (error) {
        res.status(500).json({ message: 'Error', error: error.message });
    }
};

// מייצאים את הפונקציות כדי שהראוטס יוכלו להשתמש בהן
module.exports = {
    createWorkout,
    getWorkouts,
    updateWorkout,
    deleteWorkout,
    getWorkoutsByType, 
    getWorkoutStats,
    getWeeklyChartData   
};