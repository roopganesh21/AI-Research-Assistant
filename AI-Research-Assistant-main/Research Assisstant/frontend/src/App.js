import React, { useState } from 'react';
import SummaryBox from './components/Summary';
import { summarizeText } from './api';

const App = () => {
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSummarize = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to summarize');
      return;
    }

    setLoading(true);
    setError('');
    setSummary('');

    try {
      const result = await summarizeText(inputText);
      setSummary(result.summary);
    } catch (err) {
      setError(err.message || 'Failed to generate summary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setInputText('');
    setSummary('');
    setError('');
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>🤖 AI Research Assistant</h1>
        <p style={styles.subtitle}>Extract key points from any text using AI</p>
      </header>

      <main style={styles.main}>
        <div style={styles.inputSection}>
          <label style={styles.label} htmlFor="textInput">
            Enter text to summarize:
          </label>
          <textarea
            id="textInput"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your text here... (articles, research papers, documents, etc.)"
            style={styles.textarea}
            rows={8}
          />
          
          <div style={styles.buttonGroup}>
            <button
              onClick={handleSummarize}
              disabled={loading || !inputText.trim()}
              style={{
                ...styles.button,
                ...styles.primaryButton,
                ...(loading || !inputText.trim() ? styles.disabledButton : {})
              }}
            >
              {loading ? '🔄 Processing...' : '✨ Summarize'}
            </button>
            
            <button
              onClick={handleClear}
              style={{...styles.button, ...styles.secondaryButton}}
            >
              🗑️ Clear
            </button>
          </div>
        </div>

        {error && (
          <div style={styles.errorContainer}>
            <p style={styles.errorText}>❌ {error}</p>
          </div>
        )}

        <SummaryBox summary={summary} loading={loading} />
      </main>

      <footer style={styles.footer}>
        <p>Powered by Google Gemini AI</p>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f7fa',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  header: {
    backgroundColor: '#4f46e5',
    color: 'white',
    padding: '2rem 1rem',
    textAlign: 'center'
  },
  title: {
    margin: '0 0 0.5rem 0',
    fontSize: '2.5rem',
    fontWeight: '700'
  },
  subtitle: {
    margin: 0,
    fontSize: '1.1rem',
    opacity: 0.9
  },
  main: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem 1rem'
  },
  inputSection: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    marginBottom: '2rem'
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#374151'
  },
  textarea: {
    width: '100%',
    padding: '1rem',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '1rem',
    fontFamily: 'inherit',
    resize: 'vertical',
    minHeight: '120px',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
    outline: 'none'
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem',
    flexWrap: 'wrap'
  },
  button: {
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    minWidth: '140px'
  },
  primaryButton: {
    backgroundColor: '#4f46e5',
    color: 'white'
  },
  secondaryButton: {
    backgroundColor: '#6b7280',
    color: 'white'
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
    cursor: 'not-allowed'
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    border: '1px solid #fca5a5',
    borderRadius: '8px',
    padding: '1rem',
    marginBottom: '1rem'
  },
  errorText: {
    color: '#dc2626',
    margin: 0,
    fontWeight: '500'
  },
  footer: {
    textAlign: 'center',
    padding: '2rem',
    color: '#6b7280',
    fontSize: '0.9rem'
  }
};

export default App;