const axios = require('axios');
const logger = require('../utils/logger');

// Updated API URL for 2024
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

const getSummary = async (text) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    if (!text || text.trim().length === 0) {
      throw new Error('Text is required for summarization');
    }

    logger.info('Sending request to Gemini API...');

    const prompt = `Please extract the key points from the following text and format them as bullet points. Focus on the most important information and present it in a clear, concise manner:

${text}

Provide the summary as bullet points starting with "• " for each point.`;

    // Updated request format according to new API
    const requestData = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    };

    logger.info('Request data:', JSON.stringify(requestData, null, 2));

    const response = await axios.post(
      GEMINI_API_URL,
      requestData,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': process.env.GEMINI_API_KEY  // Updated header format
        },
        timeout: 30000 // 30 seconds timeout
      }
    );

    logger.info('Gemini API response received');
    logger.info('Response data:', JSON.stringify(response.data, null, 2));

    // Extract the generated text from Gemini's response
    if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      const summary = response.data.candidates[0].content.parts[0].text.trim();
      logger.info('Summary generated successfully');
      return summary;
    } else {
      logger.error('Invalid response structure from Gemini API:', response.data);
      throw new Error('Invalid response from AI service');
    }

  } catch (error) {
    logger.error('Gemini API error:', error.message);
    
    if (error.response) {
      // API responded with an error
      const errorData = error.response.data;
      const statusCode = error.response.status;
      
      logger.error(`Gemini API error (${statusCode}):`, JSON.stringify(errorData, null, 2));
      
      if (statusCode === 400) {
        const errorMessage = errorData?.error?.message || 'Invalid request format';
        throw new Error(`Bad request: ${errorMessage}`);
      } else if (statusCode === 401) {
        throw new Error('Invalid API key. Please check your Gemini API key.');
      } else if (statusCode === 403) {
        throw new Error('API access forbidden. Check your API key permissions.');
      } else if (statusCode === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else {
        const errorMessage = errorData?.error?.message || 'Unknown API error';
        throw new Error(`AI service error: ${errorMessage}`);
      }
    } else if (error.request) {
      // Request was made but no response received
      logger.error('No response from Gemini API');
      throw new Error('Unable to connect to AI service. Please check your internet connection.');
    } else {
      // Something else happened
      logger.error('Unexpected error:', error.message);
      throw new Error(error.message || 'Failed to generate summary');
    }
  }
};

module.exports = {
  getSummary
};