const express = require('express');
const router = express.Router();
const { getExams, getExamById, createExam, updateExam, deleteExam, verifyExamKey } = require('../controllers/exam.controller');

router.get('/', getExams);
router.get('/:id', getExamById);
router.post('/:id/verify-key', verifyExamKey);
router.post('/', createExam);
router.put('/:id', updateExam);
router.delete('/:id', deleteExam);

module.exports = router;
