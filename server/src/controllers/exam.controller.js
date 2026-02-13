const Exam = require('../models/Exam');
const Question = require('../models/Question');

// @desc    Get all exams
// @route   GET /api/exams
exports.getExams = async (req, res) => {
    try {
        const { includeHidden, category } = req.query;
        let query = {};

        if (includeHidden !== 'true') {
            query.isHidden = { $ne: true };
        }

        if (category) {
            if (category === 'All Exam') {
                query.category = { $ne: 'Class Test' };
            } else {
                query.category = category;
            }
        }

        const exams = await Exam.find(query).sort({ createdAt: -1 });

        // Transform exams to exclude securityKey but indicate if it exists
        const transformedExams = exams.map(exam => ({
            ...exam.toObject(),
            securityKey: undefined,
            hasSecurityKey: !!exam.securityKey
        }));

        res.json(transformedExams);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all exams for Admin (includes keys and question count)
// @route   GET /api/admin/exams
exports.getAllExamsForAdmin = async (req, res) => {
    try {
        const exams = await Exam.find({}).sort({ createdAt: -1 }).lean();

        // Fetch question counts for all exams
        const examIds = exams.map(exam => exam._id);
        const questionCounts = await Question.aggregate([
            { $match: { examId: { $in: examIds } } },
            { $group: { _id: "$examId", count: { $sum: 1 } } }
        ]);

        // Map counts to exams
        const countMap = {};
        questionCounts.forEach(item => {
            countMap[item._id.toString()] = item.count;
        });

        const examsWithCount = exams.map(exam => ({
            ...exam,
            totalQuestions: countMap[exam._id.toString()] || 0
        }));

        res.json(examsWithCount);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single exam with questions
// @route   GET /api/exams/:id
exports.getExamById = async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.id);
        if (!exam) return res.status(404).json({ message: 'Exam not found' });

        // Retrieve questions for this exam
        const questions = await Question.find({ examId: exam._id }).select('-correctIndex');

        // Hide security key from response
        const examObj = exam.toObject();
        delete examObj.securityKey;
        examObj.hasSecurityKey = !!exam.securityKey;

        res.json({ exam: examObj, questions });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create Exam (Seed)
// @route   POST /api/exams
exports.createExam = async (req, res) => {
    try {
        const { title, description, timeLimitMinutes, questions, startTime, endTime, showResult, randomizeQuestions, questionType, isHidden, securityKey, category, securityEnabled } = req.body;

        const exam = new Exam({
            title,
            description,
            timeLimitMinutes,
            startTime,
            endTime,
            showResult: showResult !== undefined ? showResult : true,
            randomizeQuestions: randomizeQuestions !== undefined ? randomizeQuestions : false,
            questionType: questionType || 'MCQ',
            isHidden: isHidden !== undefined ? isHidden : false,
            securityKey: securityKey || '',
            category: category || 'All Exam',
            securityEnabled: securityEnabled !== undefined ? securityEnabled : false
        });
        const savedExam = await exam.save();

        if (questions && questions.length > 0) {
            const questionDocs = questions.map(q => ({
                ...q,
                examId: savedExam._id,
            }));
            await Question.insertMany(questionDocs);
        }

        res.status(201).json(savedExam);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify Exam Security Key
// @route   POST /api/exams/:id/verify-key
exports.verifyExamKey = async (req, res) => {
    try {
        const { key } = req.body;
        const exam = await Exam.findById(req.params.id);

        if (!exam) return res.status(404).json({ message: 'Exam not found' });

        if (!exam.securityKey) {
            // If no key is set, verification is automatically successful
            return res.json({ success: true });
        }

        if (exam.securityKey === key) {
            res.json({ success: true });
        } else {
            res.status(401).json({ success: false, message: 'Invalid Security Key' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update Exam
// @route   PUT /api/exams/:id
exports.updateExam = async (req, res) => {
    try {
        const { title, description, timeLimitMinutes, questions, startTime, endTime, showResult, randomizeQuestions, questionType, isHidden, securityKey, category, securityEnabled } = req.body;
        const exam = await Exam.findById(req.params.id);

        if (!exam) return res.status(404).json({ message: 'Exam not found' });

        // Update Exam fields
        exam.title = title;
        exam.description = description;
        exam.timeLimitMinutes = timeLimitMinutes;
        exam.startTime = startTime;
        exam.endTime = endTime;
        if (showResult !== undefined) exam.showResult = showResult;
        if (randomizeQuestions !== undefined) exam.randomizeQuestions = randomizeQuestions;
        if (questionType) exam.questionType = questionType;
        if (isHidden !== undefined) exam.isHidden = isHidden;
        if (securityKey !== undefined) exam.securityKey = securityKey;
        if (category) exam.category = category;
        if (securityEnabled !== undefined) exam.securityEnabled = securityEnabled;

        const updatedExam = await exam.save();

        // Update Questions: Strategy -> Delete all existing and recreate
        await Question.deleteMany({ examId: exam._id });

        if (questions && questions.length > 0) {
            const questionDocs = questions.map(q => ({
                ...q,
                examId: updatedExam._id,
            }));
            await Question.insertMany(questionDocs);
        }

        res.json(updatedExam);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// @desc    Get single exam for editing (Admin only - includes correctIndex)
// @route   GET /api/admin/exams/:id
exports.getExamForEdit = async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.id);
        if (!exam) return res.status(404).json({ message: 'Exam not found' });

        // Retrieve questions for this exam - INCLUDE correctIndex
        const questions = await Question.find({ examId: exam._id });

        // We can expose security key here too if we want, or handle it as before.
        // For editing, seeing the key might be useful, or we trust logic in EditExam.jsx
        // Logic in EditExam.jsx handles "hidden" key well.

        const examObj = exam.toObject();
        // Just in case we want to show it for admin, let's keep it or follow previous pattern.
        // Previous pattern hides it. admin can overwrite it.
        // Let's pass it! Admin should be able to see it? 
        // Actually, for security, usually we don't send secrets back.
        // But if I want to "keep existing", sending it back allows the frontend to know it exists.
        // Let's stick to the current logic: exclude it but send hasSecurityKey flag.
        delete examObj.securityKey;
        examObj.hasSecurityKey = !!exam.securityKey;

        res.json({ exam: examObj, questions });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete Exam
// @route   DELETE /api/exams/:id
exports.deleteExam = async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.id);
        if (!exam) return res.status(404).json({ message: 'Exam not found' });

        // Cascade delete: Remove all results associated with this exam
        const Result = require('../models/Result');
        await Result.deleteMany({ examId: exam._id });

        // Delete the exam and its questions
        await exam.deleteOne();
        await Question.deleteMany({ examId: exam._id });

        res.json({ message: 'Exam removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Copy Exam
// @route   POST /api/exams/:id/copy
exports.copyExam = async (req, res) => {
    try {
        // 1. Find Original Exam
        const originalExam = await Exam.findById(req.params.id);
        if (!originalExam) return res.status(404).json({ message: 'Exam not found' });

        // 2. Create New Exam Object
        const newExamData = {
            title: `${originalExam.title} (Copy)`,
            description: originalExam.description,
            timeLimitMinutes: originalExam.timeLimitMinutes,
            startTime: originalExam.startTime, // Optional: might want to reset this? Keeping for now.
            endTime: originalExam.endTime,
            showResult: originalExam.showResult,
            randomizeQuestions: originalExam.randomizeQuestions,
            questionType: originalExam.questionType,
            isHidden: true, // Copied exams should be hidden by default until ready
            questionType: originalExam.questionType,
            isHidden: true, // Copied exams should be hidden by default until ready
            securityKey: originalExam.securityKey,
            category: originalExam.category,
            securityEnabled: originalExam.securityEnabled
        };

        const newExam = new Exam(newExamData);
        const savedExam = await newExam.save();

        // 3. Find and Copy Questions
        const questions = await Question.find({ examId: originalExam._id });
        if (questions.length > 0) {
            const questionDocs = questions.map(q => ({
                text: q.text,
                options: q.options,
                correctIndex: q.correctIndex,
                type: q.type,
                examId: savedExam._id, // Link to new exam
            }));
            await Question.insertMany(questionDocs);
        }

        res.status(201).json(savedExam);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};