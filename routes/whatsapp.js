const express = require("express");
const router = express.Router();

const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

const WHATSAPP_API_URL = `https://graph.facebook.com/v22.0.0/${process.env.WHATSAPP_API_ID}/messages`;
const ACCESS_TOKEN = process.env.GRAPH_API_TOKEN;
const WEBHOOK_VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN;

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

// accepts GET requests at the /webhook endpoint. You need this URL to setup webhook initially.
// info on verification request payload: https://developers.facebook.com/docs/graph-api/webhooks/getting-started#verification-requests
router.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  // check the mode and token sent are correct
  if (mode === "subscribe" && token === WEBHOOK_VERIFY_TOKEN) {
    // respond with 200 OK and challenge token from the request
    res.status(200).send(challenge);
    console.log("Webhook verified successfully!");
  } else {
    // respond with '403 Forbidden' if verify tokens do not match
    res.sendStatus(403);
  }
});

module.exports = router;
