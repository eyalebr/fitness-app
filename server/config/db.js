const mongoose = require('mongoose');

// פונקציה אסינכרונית שמתחברת למסד הנתונים
const connectDB = async () => {
    try {
        // מנסה להתחבר בעזרת הכתובת ששמרו בקובץ .env
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected successfully: ${conn.connection.host} 🚀`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1); // עוצר את השרת אם החיבור נכשל
    }
};

module.exports = connectDB;