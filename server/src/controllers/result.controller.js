const Result = require('../models/Result');
const Exam = require('../models/Exam');
const Question = require('../models/Question');
const Student = require('../models/Student'); // Import Student model

// @desc    Submit Exam & Calculate Score
// @route   POST /api/results/submit
exports.submitExam = async (req, res) => {
    try {
        const { examId, answers, sessionId } = req.body;

        // Validate Session
        if (!sessionId) {
            return res.status(401).json({ message: 'Session ID required' });
        }

        const Session = require('../models/Session');
        const session = await Session.findById(sessionId);

        if (!session) {
            return res.status(401).json({ message: 'Invalid or Expired Session' });
        }

        // Double check expiry
        if (new Date() > session.expiresAt) {
            return res.status(401).json({ message: 'Session Expired' });
        }

        const exam = await Exam.findById(examId);
        if (!exam) return res.status(404).json({ message: 'Exam not found' });

        const questions = await Question.find({ examId: examId });

        let correct = 0;
        let wrong = 0;

        const detailedAnswers = answers.map(ans => {
            const question = questions.find(q => q._id.toString() === ans.questionId);
            if (!question) return null;

            const isCorrect = question.correctIndex === ans.selectedIndex;
            if (isCorrect) correct++;
            else wrong++;

            return {
                questionId: ans.questionId,
                selectedIndex: ans.selectedIndex,
                correctIndex: question.correctIndex,
                isCorrect
            };
        }).filter(a => a !== null);

        const totalQuestions = questions.length;
        const score = correct;

        // --- MARK ATTENDANCE LOGIC ---
        try {
            const student = await Student.findById(session.studentId);
            if (student) {
                const today = new Date().toLocaleDateString('en-CA');
                if (!student.attendance.includes(today)) {
                    student.attendance.push(today);
                    await student.save();
                    console.log(`Attendance marked for student ${student._id} on ${today} via exam submission.`);
                }
            }
        } catch (attError) {
            console.error("Error marking attendance during exam submission:", attError);
            // Don't fail the exam submission if attendance fails
        }
        // -----------------------------

        // Check for existing result for this student and exam (Permanent Tracking)
        let result = await Result.findOne({ examId: examId, studentId: session.studentId });

        if (result) {
            // Update if new score is higher or equal (to sync session info if same)
            if (score >= result.score) {
                result.score = score;
                result.correct = correct;
                result.wrong = wrong;
                result.answers = detailedAnswers;
                result.totalQuestions = totalQuestions;
                result.sessionId = session._id; // Update to current session

                const savedResult = await result.save();
                return res.status(200).json(savedResult);
            } else {
                // Return existing result (do not overwrite higher score with lower)
                return res.status(200).json(result);
            }
        } else {
            // Create new result - permanent storage
            result = new Result({
                examId,
                examTitle: exam.title,
                sessionId: session._id,
                studentId: session.studentId,
                userId: session.userId,
                totalQuestions,
                correct,
                wrong,
                score,
                answers: detailedAnswers
            });

            const savedResult = await result.save();
            res.status(201).json(savedResult);
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Result by ID
// @route   GET /api/results/:id
exports.getResultById = async (req, res) => {
    try {
        const result = await Result.findById(req.params.id)
            .populate('examId', 'securityEnabled')
            .populate('answers.questionId');
        if (!result) return res.status(404).json({ message: 'Result not found' });
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get All Results for a Session (User)
// @route   GET /api/results/session/:sessionId
exports.getUserResults = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const Session = require('../models/Session');
        const session = await Session.findById(sessionId);

        if (!session) {
            return res.status(404).json({ message: 'Session not found or expired' });
        }

        // 1. Get user's results
        const results = await Result.find({ studentId: session.studentId })
            .populate('examId', 'title description duration')
            .sort({ updatedAt: 1 }); // Sort by date ascending for graph

        if (results.length === 0) {
            return res.json([]);
        }

        // 2. Get Exam IDs to aggregate
        const examIds = results.map(r => r.examId._id);

        // 3. Aggregate Class Averages for these exams
        const aggregation = await Result.aggregate([
            { $match: { examId: { $in: examIds } } },
            {
                $group: {
                    _id: "$examId",
                    avgScore: { $avg: "$score" },
                    avgTotalQuestions: { $avg: "$totalQuestions" }
                }
            }
        ]);

        // Create a map for easy lookup
        const avgMap = {};
        aggregation.forEach(item => {
            avgMap[item._id.toString()] = item;
        });

        // 4. Attach average to results
        const resultsWithAvg = results.map(result => {
            const examIdStr = result.examId._id.toString();
            const avgData = avgMap[examIdStr];

            let classAvgPercentage = 0;
            if (avgData && avgData.avgTotalQuestions > 0) {
                classAvgPercentage = Math.round((avgData.avgScore / avgData.avgTotalQuestions) * 100);
            }

            return {
                ...result.toObject(),
                classAverage: classAvgPercentage,
                studentPercentage: Math.round((result.score / result.totalQuestions) * 100)
            };
        });

        res.json(resultsWithAvg);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
