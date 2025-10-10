require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sgMail = require('@sendgrid/mail');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(__dirname));
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

// Set SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// POST /contact
app.post('/contact', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const msg = {
        to: process.env.EMAIL_USER,       // Your Gmail
        from: process.env.EMAIL_USER,     // Verified sender in SendGrid
        replyTo: email,                    // User’s email
        subject: `New Contact Form Submission from ${name}`,
        text: `You received a message from ${name} (${email}):\n\n${message}`,
        html: `<h2>New Contact Form Submission</h2>
               <p><strong>Name:</strong> ${name}</p>
               <p><strong>Email:</strong> ${email}</p>
               <p><strong>Message:</strong></p>
               <p>${message}</p>`
    };

    try {
        await sgMail.send(msg);
        console.log("✅ Email sent successfully!");
        return res.json({ message: "Message sent successfully" });
    } catch (error) {
        console.error("❌ SendGrid Error:", error);
        return res.status(500).json({ message: "Error sending message", error: error.toString() });
    }
});

// Start server
const PORT = process.env.PORT || 3023;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
