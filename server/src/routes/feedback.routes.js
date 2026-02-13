const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedback.controller');

// POST /api/feedback/send
router.post('/send', feedbackController.sendFeedback);

module.exports = router;
