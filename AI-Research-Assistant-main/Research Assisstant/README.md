# 🤖 AI Research Assistant

A powerful browser extension and web application that uses Google Gemini AI to extract key points from any text you select on web pages or paste into the interface.

## 🌟 Features

- **Browser Extension**: Right-click on selected text to get instant AI summaries
- **Web Interface**: Paste text directly for summarization
- **AI-Powered**: Uses Google Gemini AI for intelligent text analysis
- **Clean UI**: Modern, responsive design for both extension and web app
- **Copy to Clipboard**: Easy sharing of generated summaries
- **Error Handling**: Robust error handling and user feedback

## 🚀 Technology Stack

- **Backend**: Node.js + Express.js
- **Frontend**: React.js
- **Extension**: Chrome Extension Manifest v3
- **AI Service**: Google Gemini AI API
- **HTTP Client**: Axios
- **Styling**: Custom CSS with modern design patterns

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js (v14 or higher) installed
- Chrome or Brave browser
- Google Gemini API key

## 🔑 Getting Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key
5. Add it to your `.env` file (see setup instructions below)

## 🛠️ Installation & Setup

### 1. Clone and Setup Project
```bash
# Create project directory
mkdir ai-research-assistant
cd ai-research-assistant

# Download or copy all project files to this directory