const geminiService = require('../services/geminiService');
const logger = require('../utils/logger');

exports.generateSummary = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string' || text.trim() === '') {
      logger.error('Invalid or missing text for summarization');
      return res.status(400).json({ error: 'Text is required for summarization.' });
    }

    const summary = await geminiService.getSummary(text);
    logger.info('Summary generated successfully');
    res.status(200).json({ summary });
  } catch (error) {
    logger.error('Error generating summary:', error);
    res.status(500).json({ error: 'Failed to generate summary.' });
  }
};
