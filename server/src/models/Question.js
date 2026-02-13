const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    examId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exam',
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    options: [{
        type: String,
        required: true,
    }],
    correctIndex: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        enum: ['MCQ', 'True/False'],
        default: 'MCQ',
        required: true
    }
});

module.exports = mongoose.model('Question', questionSchema);
