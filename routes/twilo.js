require("dotenv").config();
const express = require("express");
const twilio = require("twilio");
const { link } = require("./auth");

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
        "Software Engineering class is on Saturday and Sunday from 8:30am to 2:30pm.\n" +
        "The next module is Advanced Database Design and Implementation.",
    },
    2: {
      question: "Exam Schedule",
      reply: "Software Engineering exam is on 9th of this March 2025",
    },
    3: {
      question: "Check Results (Send '3 YOUR_STUDENT_ID')",
      reply: "Registered student can check their results on the MIS portal.",
      link: "https://mis.ulk.ac.rw/",
    },
    4: {
      question: "How to Access MIS Info",
      reply:
        "Master of Internet Systems information is available on the website.",
      link: "https://ulk.ac.rw/department/master-of-internet-systems-3/",
    },
    5: {
      question: "Library Location",
      reply: "Software Engineering exam is on 9th of this March 2025",
    },
    6: {
      question: "How to Access E-learning",
      reply: "Access the e-learning platform using the following link:",
      link: "https://elearningv2.ulk.ac.rw/",
    },
  };

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
    replyMessage = knowledgeBase[1].reply;
  } else if (incomingMsg === "2" || incomingMsg.includes("exam")) {
    replyMessage = knowledgeBase[2].reply;
  } else if (incomingMsg === "3") {
    replyMessage = `${knowledgeBase[3].reply} \n ${knowledgeBase[3].link}`;
  } else if (incomingMsg === "4") {
    replyMessage = `${knowledgeBase[4].reply} \n ${knowledgeBase[4].link}`;
  } else if (incomingMsg === "5") {
    replyMessage = "Please visit the website for the library location.";
  } else if (incomingMsg === "6") {
    replyMessage = `${knowledgeBase[6].reply} \n ${knowledgeBase[6].link}`;
  } else if (incomingMsg === "exit") {
    replyMessage = "You have exited the chat.";
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
