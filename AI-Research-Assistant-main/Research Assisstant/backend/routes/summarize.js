const express = require('express');
const router = express.Router();
const summarizeController = require('../controllers/summarizeController');

router.post('/', (req, res, next) => {
  const { text } = req.body;
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid "text" field.' });
  }
  summarizeController.generateSummary(req, res, next);
});

module.exports = router;
