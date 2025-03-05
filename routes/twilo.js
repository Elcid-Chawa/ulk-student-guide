require("dotenv").config();
const express = require("express");
const twilio = require("twilio");
const KnowledgeBase = require("../models/KnowledgeBase");
const authMiddleware = require("../controllers/authMiddleware");

const router = express.Router();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_WHATSAPP_NUMBER;

const client = new twilio(accountSid, authToken);

// Whatsrouter Webhook
router.post("/webhook", authMiddleware, async (req, res) => {
  const incomingMsg = req.body.Body.trim().toLowerCase();
  const senderNumber = req.body.From;

  let replyMessage =
    "I'm not sure how to respond to that. Type 'help' for options.";

  const knowledgeBase = await KnowledgeBase.find();

  // Automated responses
  if (incomingMsg.includes("hello")) {
    replyMessage =
      "Hello! How can I help you today? \n" +
      "1️⃣ Today's Class Schedule\n" +
      "2️⃣ Upcoming Exams\n" +
      "3️⃣ Check Results (Send '3 YOUR_STUDENT_ID')\n" +
      "4️⃣ How to Access MIS Info\n" +
      "5️⃣ Library Location\n" +
      "6️⃣ How to Access E-learning\n" +
      "❌ Type 'Exit' to reset the chat.";
  } else if (incomingMsg === "1" || incomingMsg.includes("class")) {
    replyMessage = knowledgeBase[0].reply;
  } else if (incomingMsg === "2" || incomingMsg.includes("exam")) {
    replyMessage = knowledgeBase[1].reply;
  } else if (incomingMsg === "3") {
    replyMessage = `${knowledgeBase[2].reply} \n ${knowledgeBase[2].link}`;
  } else if (incomingMsg === "4") {
    replyMessage = `${knowledgeBase[3].reply} \n ${knowledgeBase[3].link}`;
  } else if (incomingMsg === "5") {
    replyMessage = "Please visit the website for the library location.";
  } else if (incomingMsg === "6") {
    replyMessage = `${knowledgeBase[5].reply} \n ${knowledgeBase[5].link}`;
  } else if (incomingMsg === "exit") {
    replyMessage = "You have exited the chat.";
     req.session.destroy();
  }

  // Manual responses
  else if (incomingMsg.includes("help")) {
    replyMessage =
      "You can ask about services, pricing, or support. From the menu, type the number of the option you want to know more about.";
  }

  // Send response using Twilio API
  client.messages
    .create({
      from: `whatsapp:${twilioNumber}`,
      to: senderNumber,
      body: replyMessage,
    })
    .then((message) => console.log(`Message sent: ${message.sid}`))
    .catch((err) => console.error(err));

  res.sendStatus(200);
});

module.exports = router;
