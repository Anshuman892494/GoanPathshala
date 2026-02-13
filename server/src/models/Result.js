const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
    examId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exam',
        required: true,
    },
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Session',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    expiresAt: {
        type: Date,
        required: false  // Optional - for backward compatibility only
        // No TTL index - results are permanent until deleted manually
    },
    examTitle: {
        type: String,
        required: true,
    },
    totalQuestions: {
        type: Number,
        required: true,
    },
    correct: {
        type: Number,
        required: true,
    },
    wrong: {
        type: Number,
        required: true,
    },
    score: {
        type: Number,
        required: true,
    },
    answers: [{
        questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
        selectedIndex: Number,
        correctIndex: Number,
        isCorrect: Boolean,
    }],
}, {
    timestamps: true,
});

module.exports = mongoose.model('Result', resultSchema);
