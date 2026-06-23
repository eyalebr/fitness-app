const express = require('express');
const router = express.Router();

// ייבוא כל 4 הפונקציות
const { 
    createWorkout, 
    getWorkouts, 
    updateWorkout, 
    deleteWorkout,
    getWorkoutsByType, 
    getWorkoutStats    
} = require('../controllers/workoutController');

// קריאה ויצירה (פועלים על כל האימונים)
router.get('/', getWorkouts);
router.post('/', createWorkout);

// שאילתות מורכבות (חייבות להיות לפני נתיבי ה-ID)
router.get('/stats/summary', getWorkoutStats);
router.get('/activity/:type', getWorkoutsByType);

// עדכון ומחיקה (פועלים על אימון ספציפי לפי ID)
router.put('/:id', updateWorkout);
router.delete('/:id', deleteWorkout);


module.exports = router;