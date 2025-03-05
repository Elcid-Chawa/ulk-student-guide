require("dotenv").config();
const Student = require("../models/Student");
// Helper function to send WhatsApp messages
const twilio = require("twilio");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_WHATSAPP_NUMBER;

const client = new twilio(accountSid, authToken);

const sendWhatsAppMessage = (to, message) => {
  return client.messages.create({
    from: `whatsapp:${twilioNumber}`,
    to: to,
    body: message,
  });
};

const authMiddleware = async (req, res, next) => {
  const { Body, From } = req.body;
  if (!req.session.rollNumber) {
    // If session is not set, expect the user to send their roll number
    if (!/^\d+$/.test(Body.trim())) {
      return sendWhatsAppMessage(
        From,
        "Please enter your roll number to continue.",
      );
    }

    // Check if the roll number exists in the database
    const student = await Student.findOne({ rollNumber: Body.trim() });

    if (!student) {
      return sendWhatsAppMessage(
        From,
        "Invalid roll number. Please try again or Contact the admin to register you.",
      );
    }

    // Store session details
    req.session.rollNumber = student.rollNumber;
    req.session.student = student;

    // Save session
    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        return res.status(500).send("Internal Server Error");
      }
    });

    sendWhatsAppMessage(
      From,
      `Welcome, ${student.name}! Select a query:\n` +
        "1️⃣ Class Schedule\n" +
        "2️⃣ Upcoming Exams\n" +
        "3️⃣ Check Results\n" +
        "4️⃣ How to Access MIS Info\n" +
        "5️⃣ Library Location\n" +
        "6️⃣ How to Access E-learning\n" +
        "❌ Type 'Exit' to reset the chat.",
    );
  }

  // If session exists, proceed to route handler
  next();
};

module.exports = authMiddleware;
