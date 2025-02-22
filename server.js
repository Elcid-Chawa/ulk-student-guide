const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const auth = require("./routes/auth");
const whatsapp = require("./routes/whatsapp");
const twilo = require("./routes/twilo");

// Login route
app.use("/auth", auth);

// Webhook for WhatsApp messages
app.use("/whatsapp", whatsapp);
app.use("/twilio", twilo);

// Start server
app.listen(5000, () => console.log("Server running on port 5000"));
