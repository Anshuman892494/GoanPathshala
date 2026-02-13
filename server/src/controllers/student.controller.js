const Student = require('../models/Student');
const bcrypt = require('bcryptjs');

// @desc    Add a Single Student
// @route   POST /api/students
exports.addStudent = async (req, res) => {
    try {
        const { name, regNo, phone, password, email } = req.body;

        if (!name || !regNo) {
            return res.status(400).json({ message: 'Name and Registration Number are required' });
        }

        const formattedRegNo = regNo.toString().toUpperCase().trim();
        const existingStudent = await Student.findOne({ regNo: formattedRegNo });

        if (existingStudent) {
            return res.status(400).json({ message: 'Student with this Registration Number already exists' });
        }

        let hashedPassword = null;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);
        }

        const student = await Student.create({
            name,
            regNo: formattedRegNo,
            phone,
            email,
            password: hashedPassword
        });

        res.status(201).json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Bulk Add Students
// @route   POST /api/students/bulk
exports.addStudentsBulk = async (req, res) => {
    try {
        const { students } = req.body; // Array of { name, regNo, phone, password }

        if (!students || !Array.isArray(students) || students.length === 0) {
            return res.status(400).json({ message: 'Invalid data format. Expected an array of students.' });
        }

        const results = {
            added: 0,
            failed: 0,
            errors: []
        };

        for (const s of students) {
            if (!s.name || !s.regNo) {
                results.failed++;
                results.errors.push(`Missing Name or RegNo for entry: ${JSON.stringify(s)}`);
                continue;
            }

            const formattedRegNo = s.regNo.toString().toUpperCase().trim();
            const existing = await Student.findOne({ regNo: formattedRegNo });

            if (existing) {
                results.failed++;
                results.errors.push(`Duplicate RegNo: ${formattedRegNo}`);
                continue;
            }

            let hashedPassword = null;
            if (s.password) {
                // Ensure password is string
                const passStr = String(s.password);
                const salt = await bcrypt.genSalt(10);
                hashedPassword = await bcrypt.hash(passStr, salt);
            }

            try {
                await Student.create({
                    name: s.name,
                    regNo: formattedRegNo,
                    phone: s.phone ? String(s.phone) : undefined,
                    password: hashedPassword
                });
                results.added++;
            } catch (err) {
                results.failed++;
                results.errors.push(`Error adding ${formattedRegNo}: ${err.message}`);
            }
        }

        res.json({ message: 'Bulk import processing complete', results });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get All Students
// @route   GET /api/students
exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.find().select('-password').sort({ createdAt: -1 });
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Student by ID
// @route   GET /api/students/:id
exports.getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id).select('-password');
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update Student
// @route   PUT /api/students/:id
exports.updateStudent = async (req, res) => {
    try {
        const { name, regNo, phone, password, email } = req.body;
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Check if regNo is being changed and if it already exists
        if (regNo && regNo !== student.regNo) {
            const formattedRegNo = regNo.toString().toUpperCase().trim();
            const existingStudent = await Student.findOne({ regNo: formattedRegNo });
            if (existingStudent) {
                return res.status(400).json({ message: 'Student with this Registration Number already exists' });
            }
            student.regNo = formattedRegNo;
        }

        // Update fields
        if (name) student.name = name;
        if (phone !== undefined) student.phone = phone;
        if (email !== undefined) student.email = email;

        // Update password if provided
        if (password) {
            const salt = await bcrypt.genSalt(10);
            student.password = await bcrypt.hash(password, salt);
        }

        await student.save();

        // Return student without password
        const updatedStudent = await Student.findById(student._id).select('-password');
        res.json(updatedStudent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete Student
// @route   DELETE /api/students/:id
exports.deleteStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        await student.deleteOne();
        res.json({ message: 'Student removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Student Login
// @route   POST /api/students/login
exports.loginStudent = async (req, res) => {
    try {
        const { regNo, password } = req.body;

        if (!regNo || !password) {
            return res.status(400).json({ message: 'Registration Number and Password are required' });
        }

        const formattedRegNo = regNo.toString().toUpperCase().trim();
        const student = await Student.findOne({ regNo: formattedRegNo });

        if (!student) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (!student.password) {
            return res.status(401).json({ message: 'Password not set for this student. Please contact admin.' });
        }

        const isMatch = await bcrypt.compare(password, student.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Create Session similar to Guest Login but linked to this student
        // We reuse the Session model logic here
        const Session = require('../models/Session');

        // Check existing session
        let session = await Session.findOne({ studentId: student._id });

        if (session) {
            if (new Date() > session.expiresAt) {
                await session.deleteOne();
                session = null;
            } else {
                return res.json({
                    sessionId: session._id,
                    studentId: session.studentId,
                    name: student.name,
                    regNo: student.regNo,
                    expiresAt: session.expiresAt
                });
            }
        }

        // Create new session
        const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours

        session = await Session.create({
            name: student.name,
            regNo: student.regNo,
            studentId: student._id,
            expiresAt
        });

        res.json({
            sessionId: session._id,
            studentId: session.studentId,
            name: student.name,
            regNo: student.regNo,
            expiresAt: session.expiresAt
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify Student Details
// @route   POST /api/students/verify-details
exports.verifyStudentDetails = async (req, res) => {
    try {
        const { name, regNo, phone } = req.body;

        if (!name || !regNo || !phone) {
            return res.status(400).json({ message: 'Name, RegNo, and Phone are required' });
        }

        const formattedRegNo = regNo.toString().toUpperCase().trim();

        const student = await Student.findOne({
            regNo: formattedRegNo,
            phone: phone,
            name: { $regex: new RegExp(`^${name}$`, 'i') }
        });

        if (!student) {
            return res.status(404).json({ message: 'Student details not found or incorrect' });
        }

        res.json({ message: 'Details verified', verified: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reset Password
// @route   POST /api/students/reset-password
exports.resetPassword = async (req, res) => {
    try {
        const { name, regNo, phone, newPassword } = req.body;

        if (!name || !regNo || !phone || !newPassword) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const formattedRegNo = regNo.toString().toUpperCase().trim();

        // Find student with matching details
        // Using regex for case-insensitive name match
        const student = await Student.findOne({
            regNo: formattedRegNo,
            phone: phone,
            name: { $regex: new RegExp(`^${name}$`, 'i') }
        });

        if (!student) {
            return res.status(404).json({ message: 'Student details do not match our records' });
        }

        // Update password
        const salt = await bcrypt.genSalt(10);
        student.password = await bcrypt.hash(newPassword, salt);
        await student.save();

        res.json({ message: 'Password reset successfully. You can now login.' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
