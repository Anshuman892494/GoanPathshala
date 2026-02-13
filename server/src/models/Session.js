const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    regNo: {
        type: String,
        required: true,
        uppercase: true,
        trim: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Deprecated, keeping for backward safety
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 }
    }
}, {
    timestamps: true
});

// Hook: Delete guest students when their session is deleted
sessionSchema.pre('deleteOne', { document: true, query: false }, async function () {
    try {
        const Student = require('./Student');

        // Check if this session belongs to a guest student
        if (this.studentId && this.regNo && this.regNo.startsWith('GUEST-')) {
            // Delete the guest student
            await Student.findByIdAndDelete(this.studentId);
            console.log(`Auto-deleted guest student: ${this.regNo}`);
        }
    } catch (error) {
        console.error('Error in session pre-delete hook:', error);
        throw error; // Re-throw to abort the delete operation
    }
});

module.exports = mongoose.model('Session', sessionSchema);
