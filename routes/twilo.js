require("dotenv").config();
const express = require("express");
const twilio = require("twilio");

const router = express.Router();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_WHATSAPP_NUMBER;

const client = new twilio(accountSid, authToken);

// Whatsrouter Webhook
router.post("/webhook", (req, res) => {
  const incomingMsg = req.body.Body.trim().toLowerCase();
  const senderNumber = req.body.From;

  let replyMessage =
    "I'm not sure how to respond to that. Type 'help' for options.";

  const knowledgeBase = {
    1: {
      question: "Class Schedudle",
      reply:
        "Software Engineering class is on Saturday and Sunday from 8:30am to 2:30pm",
      link: "https://example.com/services",
    },
    2: {
      question: "Exam Schedule",
      reply: "Software Engineering exam is on 9th of this March 2025",
    },
    support: {
      reply: "For support, please email",
    },
  };

  // Automated responses
  if (incomingMsg.includes("hello")) {
    replyMessage = "Hello! How can I assist you today?";
  } else if (incomingMsg.includes("price")) {
    replyMessage =
      "Our latest pricing is available at: https://example.com/pricing";
  } else if (incomingMsg.includes("help")) {
    replyMessage = "You can ask about services, pricing, or support.";
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
