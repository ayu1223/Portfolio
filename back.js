require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(__dirname));
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});



transporter.verify((error, success) => {
    if (error) {
        console.error("❌ Transporter error:", error);
    } else {
        console.log("✅ Server is ready to send emails");
    }
});


app.post('/contact', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            replyTo: email,
            subject: `Contact Form Submission: ${name}\n`,
            text: `You received a message from ${name} (${email}):\n\n${message}`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent:", info.response);
        return res.json({ message: "Message sent successfully" });

    } catch (err) {
        console.error("❌ Email error:", err);
        return res.status(500).json({ message: "Error sending message", error: err.toString() });
    }
});


const PORT = process.env.PORT || 3023;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
