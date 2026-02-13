const express = require('express');
const router = express.Router();
const { adminLogin, getAllResults, forgotPassword, resetPassword, deleteResult, getResultById, getStudentReportCards, getMonthlyLeaderboard } = require('../controllers/admin.controller');
const { getExamForEdit, getAllExamsForAdmin } = require('../controllers/exam.controller');
const { protect } = require('../middleware/auth');

router.post('/login', adminLogin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/results', getAllResults);
router.get('/exams', protect, getAllExamsForAdmin);
router.get('/exams/:id', protect, getExamForEdit);
router.delete('/results/:id', protect, deleteResult);
router.get('/results/:id', protect, getResultById);
router.get('/report-cards', protect, getStudentReportCards);
router.get('/leaderboard', protect, getMonthlyLeaderboard);

module.exports = router;
