const Workout = require('../models/Workout');

// 1-5. הפונקציות הקיימות (create, get, update, delete, type) נשארות כפי שהן
const createWorkout = async (req, res) => { try { const newWorkout = await Workout.create(req.body); res.status(201).json(newWorkout); } catch (error) { res.status(400).json({ message: 'Error creating workout', error: error.message }); } };
const getWorkouts = async (req, res) => { try { const workouts = await Workout.find().sort({ createdAt: -1 }); res.status(200).json(workouts); } catch (error) { res.status(500).json({ message: 'Error fetching workouts', error: error.message }); } };
const updateWorkout = async (req, res) => { try { const updatedWorkout = await Workout.findByIdAndUpdate(req.params.id, req.body, { new: true }); if (!updatedWorkout) return res.status(404).json({ message: 'Workout not found' }); res.status(200).json(updatedWorkout); } catch (error) { res.status(400).json({ message: 'Error updating workout', error: error.message }); } };
const deleteWorkout = async (req, res) => { try { const deletedWorkout = await Workout.findByIdAndDelete(req.params.id); if (!deletedWorkout) return res.status(404).json({ message: 'Workout not found' }); res.status(200).json({ message: 'Workout deleted successfully' }); } catch (error) { res.status(500).json({ message: 'Error deleting workout', error: error.message }); } };
const getWorkoutsByType = async (req, res) => { try { const activityType = req.params.type; const workouts = await Workout.find({ activityType: activityType }).sort({ createdAt: -1 }); res.status(200).json(workouts); } catch (error) { res.status(500).json({ message: 'Error fetching workouts by type', error: error.message }); } };

// 6. סטטיסטיקות שבועיות (מתוקן)
const getWorkoutStats = async (req, res) => {
    try {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());

        const dailyStats = await Workout.aggregate([ { $match: { createdAt: { $gte: startOfToday } } }, { $group: { _id: null, steps: { $sum: "$steps" }, calories: { $sum: "$calories" }, duration: { $sum: "$duration" } }} ]);
        const weeklyStats = await Workout.aggregate([ { $match: { createdAt: { $gte: startOfWeek } } }, { $group: { _id: null, totalWorkouts: { $sum: 1 }, totalDistance: { $sum: "$distance" }, totalCalories: { $sum: "$calories" }, totalDuration: { $sum: "$duration" } }} ]);

        const weeklyData = weeklyStats[0] || { totalWorkouts: 0, totalDistance: 0, totalCalories: 0, totalDuration: 0 };
        const avg = weeklyData.totalWorkouts > 0 ? Math.round(weeklyData.totalDuration / weeklyData.totalWorkouts) : 0;

        res.status(200).json({
            daily: dailyStats[0] || { steps: 0, calories: 0, duration: 0 },
            weekly: { ...weeklyData, avgDuration: avg }
        });
    } catch (error) { res.status(500).json({ message: 'Error calculating stats', error: error.message }); }
};

// 7. גרפים (שבועי וחודשי)
const getWeeklyChartData = async (req, res) => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const chartData = await Workout.aggregate([ { $match: { createdAt: { $gte: sevenDaysAgo } } }, { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, totalCalories: { $sum: "$calories" } } }, { $sort: { _id: 1 } } ]);
        res.status(200).json(chartData);
    } catch (error) { res.status(500).json({ message: 'Error', error: error.message }); }
};

const getMonthlyChartData = async (req, res) => {
    try {
        const chartData = await Workout.aggregate([ { $group: { _id: { $isoWeek: "$createdAt" }, totalCalories: { $sum: "$calories" } } }, { $sort: { "_id": -1 } }, { $limit: 4 } ]);
        res.status(200).json(chartData.reverse());
    } catch (error) { res.status(500).json({ message: 'Error', error: error.message }); }
};

module.exports = {
    createWorkout, getWorkouts, updateWorkout, deleteWorkout,
    getWorkoutsByType, getWorkoutStats, getWeeklyChartData, getMonthlyChartData
};