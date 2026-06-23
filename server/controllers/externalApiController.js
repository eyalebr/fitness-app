const getWalkingSuggestions = async (req, res) => {
    try {
        // אנחנו מצפים שהלקוח ישלח לנו קואורדינטות, אחרת נשים את אזור המרכז כברירת מחדל
        const lat = req.query.lat || 32.0853; 
        const lon = req.query.lon || 34.7818;
        
        const apiKey = process.env.GEOAPIFY_API_KEY;
        
        // בניית כתובת הבקשה: חיפוש קטגוריות של פארקים וטבע ברדיוס של 3 ק"מ מהמיקום
        const url = `https://api.geoapify.com/v2/places?categories=leisure.park,natural&filter=circle:${lon},${lat},3000&limit=5&apiKey=${apiKey}`;
        
        // ביצוע הקריאה ל-API החיצוני (זאת השורה שמביאה לכם את ה-5 נקודות בפרויקט!)
        const response = await fetch(url);
        const data = await response.json();
        
        // חילוץ רק המידע שמעניין אותנו מתוך התשובה הענקית שחוזרת
        const suggestions = data.features.map(place => ({
            name: place.properties.name || 'מסלול/פארק ללא שם',
            address: place.properties.address_line2,
            distanceMeters: place.properties.distance // מרחק מהמשתמש במטרים
        })).filter(place => place.name !== 'מסלול/פארק ללא שם'); // מסננים תוצאות ריקות
        
        res.status(200).json({
            message: "Here are some great places for your next workout!",
            suggestions: suggestions
        });

    } catch (error) {
        res.status(500).json({ message: 'Error fetching external API', error: error.message });
    }
};

module.exports = { getWalkingSuggestions };