const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

const app = express();
app.use(bodyParser.json());

const auth = require("./routes/auth");
const whatsapp = require("./routes/whatsapp");

// Login route
app.use("/auth", auth);

// Webhook for WhatsApp messages
app.use("/whatsapp", whatsapp);

// Start server
app.listen(5000, () => console.log("Server running on port 5000"));
