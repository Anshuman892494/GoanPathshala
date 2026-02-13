const Session = require('../models/Session');
const User = require('../models/User');

// @desc    Start Temporary Session
// @route   POST /api/session/start


// @desc    Get All Sessions
// @route   GET /api/session
exports.getAllSessions = async (req, res) => {
    try {
        const sessions = await Session.find().populate('userId', 'username role'); // Populate user details if needed
        res.status(200).json(sessions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete Session
// @route   DELETE /api/session/:id
exports.deleteSession = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id);

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        await session.deleteOne();
        res.status(200).json({ message: 'Session deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
