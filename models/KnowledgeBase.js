const mongoose = require("../utils/db");

const KnowledgeBaseSchema = new mongoose.Schema({
  question: { type: String, required: true },
  reply: { type: String, required: true },
  link: { type: String },
  key: { type: String, required: true, unique: true },
});

const KnowledgeBase = mongoose.model("KnowledgeBase", KnowledgeBaseSchema);

module.exports = KnowledgeBase;