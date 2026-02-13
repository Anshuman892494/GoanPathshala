const express = require('express');
const router = express.Router();
const { startSession, getAllSessions, deleteSession } = require('../controllers/session.controller');
const { protect } = require('../middleware/auth'); // Protect admin routes

router.post('/start', startSession); // Public - students can start sessions
router.get('/', protect, getAllSessions); // Protected - admin only
router.delete('/:id', protect, deleteSession); // Protected - admin only

module.exports = router;
