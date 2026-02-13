const Student = require('../models/Student');
const bcrypt = require('bcryptjs');

// @desc    Add a Single Student
// @route   POST /api/students
exports.addStudent = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, password } = req.body;

        if (!firstName || !lastName || !email) {
            return res.status(400).json({ message: 'First Name, Last Name and Email are required' });
        }

        const phoneRegex = /^[1-9]\d{9}$/;
        if (phone && !phoneRegex.test(String(phone))) {
            return res.status(400).json({ message: 'Phone number must be exactly 10 digits and cannot start with 0.' });
        }

        const formattedEmail = email.toString().toLowerCase().trim();

        // Check for existing student
        const existingStudent = await Student.findOne({
            $or: [{ email: formattedEmail }, { phone: phone }]
        });

        if (existingStudent) {
            if (existingStudent.email === formattedEmail) {
                return res.status(400).json({ message: 'Student with this Email already exists' });
            }
            return res.status(400).json({ message: 'Student with this Phone Number already exists' });
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (password) {
            if (!passwordRegex.test(password)) {
                return res.status(400).json({ message: 'Password must contain at least 8 characters, including 1 uppercase, 1 lowercase, 1 number, and 1 special character.' });
            }
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);
        }

        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
        const regNo = `GP-${timestamp}${random}`;

        const student = await Student.create({
            firstName,
            lastName,
            email: formattedEmail,
            phone,
            password: hashedPassword,
            regNo
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
        const { students } = req.body; // Array of { firstName, lastName, email, phone, password }

        if (!students || !Array.isArray(students) || students.length === 0) {
            return res.status(400).json({ message: 'Invalid data format. Expected an array of students.' });
        }

        const results = {
            added: 0,
            failed: 0,
            errors: []
        };

        for (const s of students) {
            if (!s.firstName || !s.lastName || !s.email) {
                results.failed++;
                results.errors.push(`Missing Name or Email for entry: ${JSON.stringify(s)}`);
                continue;
            }

            const formattedEmail = s.email.toString().toLowerCase().trim();
            const existing = await Student.findOne({ email: formattedEmail });

            if (existing) {
                results.failed++;
                results.errors.push(`Duplicate Email: ${formattedEmail}`);
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
                const timestamp = Date.now().toString().slice(-6);
                const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
                const regNo = `GP-${timestamp}${random}`;

                await Student.create({
                    firstName: s.firstName,
                    lastName: s.lastName,
                    email: formattedEmail,
                    phone: s.phone ? String(s.phone) : undefined,
                    password: hashedPassword,
                    regNo
                });
                results.added++;
            } catch (err) {
                results.failed++;
                results.errors.push(`Error adding ${formattedEmail}: ${err.message}`);
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
        const { firstName, lastName, email, phone, password } = req.body;
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Check if email is being changed and if it already exists
        if (email && email !== student.email) {
            const formattedEmail = email.toString().toLowerCase().trim();
            const existingStudent = await Student.findOne({ email: formattedEmail });
            if (existingStudent) {
                return res.status(400).json({ message: 'Student with this Email already exists' });
            }
            student.email = formattedEmail;
        }

        // Update fields
        if (firstName) student.firstName = firstName;
        if (lastName) student.lastName = lastName;
        if (phone !== undefined) student.phone = phone;

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
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and Password are required' });
        }

        const formattedEmail = email.toString().toLowerCase().trim();
        const student = await Student.findOne({ email: formattedEmail });

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

        // Create Session
        const Session = require('../models/Session');

        // Check existing session
        let session = await Session.findOne({ studentId: student._id });
        const fullName = `${student.firstName} ${student.lastName}`;

        if (session) {
            if (new Date() > session.expiresAt) {
                await session.deleteOne();
                session = null;
            } else {
                return res.json({
                    sessionId: session._id,
                    studentId: session.studentId,
                    name: fullName,
                    email: student.email,
                    regNo: student.regNo,
                    expiresAt: session.expiresAt
                });
            }
        }

        // Create new session
        const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours

        session = await Session.create({
            name: fullName,
            email: student.email,
            regNo: student.regNo,
            studentId: student._id,
            expiresAt
        });

        res.json({
            sessionId: session._id,
            studentId: session.studentId,
            name: fullName,
            email: student.email,
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
        const { firstName, lastName, email, phone } = req.body;

        if (!firstName || !lastName || !email || !phone) {
            return res.status(400).json({ message: 'First Name, Last Name, Email, and Phone are required' });
        }

        const formattedEmail = email.toString().toLowerCase().trim();

        const student = await Student.findOne({
            email: formattedEmail,
            phone: phone,
            firstName: { $regex: new RegExp(`^${firstName}$`, 'i') },
            lastName: { $regex: new RegExp(`^${lastName}$`, 'i') }
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
        const { firstName, lastName, email, phone, newPassword } = req.body;

        if (!firstName || !lastName || !email || !phone || !newPassword) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const formattedEmail = email.toString().toLowerCase().trim();

        // Find student with matching details
        const student = await Student.findOne({
            email: formattedEmail,
            phone: phone,
            firstName: { $regex: new RegExp(`^${firstName}$`, 'i') },
            lastName: { $regex: new RegExp(`^${lastName}$`, 'i') }
        });

        if (!student) {
            return res.status(404).json({ message: 'Student details do not match our records' });
        }

        // Update password
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({ message: 'Password must contain at least 8 characters, including 1 uppercase, 1 lowercase, 1 number, and 1 special character.' });
        }

        const salt = await bcrypt.genSalt(10);
        student.password = await bcrypt.hash(newPassword, salt);
        await student.save();

        res.json({ message: 'Password reset successfully. You can now login.' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
