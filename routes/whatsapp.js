const express = require('express');
const router  = express.Router();

const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

const WHATSAPP_API_URL = `https://graph.facebook.com/v22.0.0/${process.env.WHATSAPP_API_ID}/messages`;
const ACCESS_TOKEN = process.env.WHATSAPP_API_SECRET; 


// Webhook for WhatsApp messages
router.post("/webhook", async (req, res) => {
  const message = req.body.messages[0]; // Get incoming message
  const from = message.from; // Student's WhatsApp number
  const text = message.text.body.toLowerCase(); // User's message

  let responseMessage;

  if (text.includes("events")) {
    responseMessage =
      "Here are the upcoming events: 1. Seminar on AI - June 5th, 2. Exam registration deadline - June 10th.";
  } else if (text.includes("missed")) {
    responseMessage =
      "You missed these events: 1. Career Counseling - May 20th. 2. Sports Day - May 25th.";
  } else {
    responseMessage =
      "Hello! I can help you with event updates, missed events, and general information. Type 'events' to see upcoming events.";
  }

  await axios.post(
    WHATSAPP_API_URL,
    {
      messaging_product: "whatsapp",
      to: from,
      type: "text",
      text: { body: responseMessage },
    },
    {
      headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
    },
  );

  res.sendStatus(200);
});

export default router;