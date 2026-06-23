const express = require('express');
const router = express.Router();
const { getWalkingSuggestions } = require('../controllers/externalApiController');

// כשהלקוח יפנה לנתיב הזה, השרת ילך ויביא לו הצעות לטיולים
router.get('/trails', getWalkingSuggestions);

module.exports = router;