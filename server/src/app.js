const express = require('express');
const cors = require('cors');
const examRoutes = require('./routes/exam.routes');
const resultRoutes = require('./routes/result.routes');
const sessionRoutes = require('./routes/session.routes');
const adminRoutes = require('./routes/admin.routes');
const feedbackRoutes = require('./routes/feedback.routes');


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/exams', examRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/session', sessionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/students', require('./routes/student.routes'));


// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

module.exports = app;
