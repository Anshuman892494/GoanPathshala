const express = require('express');
const router = express.Router();
const { submitExam, getResultById, getUserResults } = require('../controllers/result.controller');
const { getMonthlyLeaderboard } = require('../controllers/admin.controller');

router.post('/submit', submitExam);
// IMPORTANT: Specific routes MUST come BEFORE parameterized routes like /:id
// Public leaderboard route for students (no auth required)
router.get('/leaderboard', getMonthlyLeaderboard);
router.get('/:id', getResultById);
router.get('/session/:sessionId', getUserResults);

module.exports = router;
