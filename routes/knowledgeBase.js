const express = require('express');
const router = express.Router();
const KnowledgeBase = require('../models/KnowledgeBase');

const getKnowledgeBase = require('../controllers/knowlegeBaseController');

// Get all knowledge base entries
router.get('/', async (req, res) => {
  try {
    const knowledgeBase = await KnowledgeBase.find();
    res.json(knowledgeBase);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get one knowledge base entry
router.get('/:id', getKnowledgeBase, (req, res) => {
  res.json(res.knowledgeBase);
});

// Create one knowledge base entry  
router.post('/', async (req, res) => {
  const knowledgeBase = new KnowledgeBase({
    question: req.body.question,
    reply: req.body.reply,
    link: req.body.link,
    key: req.body.key
  });
  try {
    const newKnowledgeBase = await knowledgeBase.save();
    res.status(201).json(newKnowledgeBase);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update one knowledge base entry
router.patch('/:id', getKnowledgeBase, async (req, res) => {
  if (req.body.question != null) {
    res.knowledgeBase.question = req.body.question;
  }
  if (req.body.reply != null) {
    res.knowledgeBase.reply = req.body.reply;
  }
  if (req.body.link != null) {
    res.knowledgeBase.link = req.body.link;
  }
  if (req.body.key != null) {
    res.knowledgeBase.key = req.body.key;
  }
  try {
    const updatedKnowledgeBase = await res.knowledgeBase.save();
    res.json(updatedKnowledgeBase);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;