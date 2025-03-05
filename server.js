const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// session config
app.use(
  session({
    secret: "sesstion-secerte",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    cookie: {
      maxAge: 60 * 60 * 1000, // 1 hour session
    },
  }),
);

const auth = require("./routes/auth");
const whatsapp = require("./routes/whatsapp");
const twilo = require("./routes/twilo");

const student = require("./routes/students");

const knowledgeBase = require("./routes/knowledgeBase");

// Login route
app.use("/auth", auth);

// Webhook for WhatsApp messages
app.use("/whatsapp", whatsapp);
app.use("/twilio", twilo);

// student routes
app.use("/students", student);

// Knowledge base routes
app.use("/knowledgeBase", knowledgeBase);

// Start server
app.listen(5000, () => console.log("Server running on port 5000"));
