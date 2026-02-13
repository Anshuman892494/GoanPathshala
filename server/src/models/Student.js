const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    regNo: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    // Future extensible fields
    phone: {
        type: Number,
    },
    email: {
        type: String,
        lowercase: true
    },
    password: {
        type: String,
        required: false // Optional - only for student login, not for guests
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Student', studentSchema);
