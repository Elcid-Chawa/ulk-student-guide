const KnowledgeBase = require('../models/KnowledgeBase');
const getKnowledgeBase = async (req, res, next) => {
  let knowledgeBase;
  try {
    knowledgeBase = await KnowledgeBase.findById(req.params.id);
    if (knowledgeBase == null) {
      return res
        .status(404)
        .json({ message: "Cannot find knowledge base entry" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.knowledgeBase = knowledgeBase;
  next();
};

module.exports = getKnowledgeBase;