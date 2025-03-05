const mongoose = require("../utils/db");

const StudentSchema = new mongoose.Schema({
  rollNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  whatsAppNumber: {type: String, required: true, unique: true},
  program: { type: String, required: true }, // MIS, MBA, MFIN, ...
  eventsMissed: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
});

module.exports = mongoose.model("Student", StudentSchema);
