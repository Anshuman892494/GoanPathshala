const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        default: 'dummy'
    }
});

module.exports = mongoose.model('User', userSchema);
