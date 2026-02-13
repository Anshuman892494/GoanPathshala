const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    timeLimitMinutes: {
        type: Number,
        required: true,
    },
    startTime: {
        type: Date,
        required: false, // Optional: if not set, exam is always available
    },
    endTime: {
        type: Date,
        required: false, // Optional
    },
    showResult: {
        type: Boolean,
        default: true
    },
    randomizeQuestions: {
        type: Boolean,
        default: false
    },
    questionType: {
        type: String,
        enum: ['MCQ', 'True/False'],
        default: 'MCQ',
        required: true
    },
    isHidden: {
        type: Boolean,
        default: false
    },
    securityKey: {
        type: String,
        default: ''
    },
    category: {
        type: String,
        enum: ['All Exam', 'Computer GK', 'Tally'],
        default: 'All Exam',
        required: true
    },
    securityEnabled: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Exam', examSchema);
