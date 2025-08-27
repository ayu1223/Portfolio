require('dotenv').config(); // load .env
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();
app.use(cors());
app.use(bodyParser.json());

// Contact form endpoint
app.post('/contact', async (req, res) => {
    const { name, email, message } = req.body;

    if(!name || !email || !message){
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,   // from .env
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: email,
            to: process.env.EMAIL_USER,
            subject: `Contact Form Submission: ${name}`,
            text: message
        });

        res.json({ message: 'Email sent successfully!' });
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to send email', error: err.toString() });
    }
});

// Use port from .env or fallback
const PORT = process.env.PORT || 3023;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
