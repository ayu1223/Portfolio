require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();

app.use(cors({
  origin: [
    'http://localhost:3023',                  
    'http://127.0.0.1:5500',                  
    'https://your-portfolio.vercel.app'       
  ],
  methods: ['GET', 'POST'],
}));

app.use(express.json());

app.use(express.static(path.join(__dirname, '../public')));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const mailOptions = {
    from: `"${name}" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    replyTo: email,
    subject: `New Contact Form Submission from ${name}`,
    text: `You received a message from ${name} (${email}):\n\n${message}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully!");
    return res.json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("❌ Nodemailer Error:", error);
    return res.status(500).json({ message: "Error sending message", error: error.toString() });
  }
});

const PORT = process.env.PORT || 3023;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
