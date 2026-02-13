const { Resend } = require('resend');

exports.sendFeedback = async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
        const { data, error } = await resend.emails.send({
            from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
            to: process.env.EMAIL_TO,
            reply_to: email, // Set the user's email as the reply-to address
            subject: `ACCIEXAMPoint - Feedback from ${name}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #dc2626;">New Feedback Received</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <hr style="border: 1px solid #eee; margin: 20px 0;">
                    <h3 style="color: #555;">Message:</h3>
                    <p style="white-space: pre-wrap; background: #f9f9f9; padding: 15px; border-radius: 5px; border: 1px solid #eee;">${message}</p>
                    <hr style="border: 1px solid #eee; margin: 20px 0;">
                    <p style="font-size: 12px; color: #888;">This feedback was sent from the ExamPoint application.</p>
                </div>
            `
        });

        if (error) {
            console.error('Resend Error:', error);
            return res.status(500).json({ message: 'Failed to send feedback', error: error.message });
        }

        res.status(200).json({ message: 'Feedback sent successfully!', data });
    } catch (error) {
        console.error('Feedback Handler Error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
