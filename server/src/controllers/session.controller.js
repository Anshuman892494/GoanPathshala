const Session = require('../models/Session');
const User = require('../models/User');

// @desc    Start Temporary Session
// @route   POST /api/session/start
exports.startSession = async (req, res) => {
    try {
        let { name, regNo } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }

        // Auto-generate RegNo for Guest if not provided
        if (!regNo) {
            const randomSuffix = Math.floor(1000 + Math.random() * 9000); // 4 digit random
            regNo = `GUEST-${Date.now().toString().slice(-6)}${randomSuffix}`;
        }

        const normalizedRegNo = regNo.toString().toUpperCase().trim();

        // 1. Check if STUDENT exists
        const Student = require('../models/Student');
        let student = await Student.findOne({ regNo: normalizedRegNo });

        if (!student) {
            // Create new student (guest) if not exists
            student = await Student.create({
                name: name,
                regNo: normalizedRegNo,
                // No password for guests
            });
        } else {
            // Update name if changed (optional, keeping latest name)
            if (student.name !== name) {
                student.name = name;
                await student.save();
            }
        }

        // 2. Check if active session exists for this student
        let session = await Session.findOne({
            studentId: student._id
        });

        if (session) {
            // Check if session is expired
            if (new Date() > session.expiresAt) {
                await session.deleteOne(); // Delete expired session to create new one
                session = null;
            } else {
                return res.json({
                    sessionId: session._id,
                    studentId: session.studentId,
                    userId: session.userId, // Keep for frontend compatibility if needed
                    expiresAt: session.expiresAt
                });
            }
        }

        // 3. Create Session (Expires in 3 Hours)
        const expiresAt = new Date(Date.now() + 3 * 60 * 60 * 1000);

        // Assign a random dummy user for backward compatibility (optional but recommended for now)
        const randomUser = await User.aggregate([{ $sample: { size: 1 } }]);
        const userId = randomUser && randomUser.length > 0 ? randomUser[0]._id : null;

        session = new Session({
            name,
            regNo: normalizedRegNo,
            studentId: student._id,
            userId: userId, // Optional now
            expiresAt
        });

        await session.save();

        res.status(201).json({
            sessionId: session._id,
            studentId: session.studentId,
            userId: session.userId,
            expiresAt: session.expiresAt
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

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
