document.addEventListener('DOMContentLoaded', () => {
  const loadingEl = document.getElementById('loading');
  const errorEl = document.getElementById('error');
  const summaryEl = document.getElementById('summary');

  loadingEl.style.display = 'block';
  errorEl.style.display = 'none';
  summaryEl.textContent = '';

  // Request summary from background script
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (!tab || !tab.id) {
      showError('No active tab found.');
      return;
    }

    chrome.tabs.sendMessage(tab.id, { action: 'getSelectedText' }, async (response) => {
      if (!response || !response.text) {
        showError(response?.error || 'No text selected.');
        return;
      }

      try {
        const summary = await fetchSummary(response.text);
        showSummary(summary);
      } catch (err) {
        showError(err.message || 'Failed to get summary.');
      }
    });
  });

  function showSummary(summary) {
    loadingEl.style.display = 'none';
    errorEl.style.display = 'none';
    summaryEl.innerHTML = formatSummary(summary);
  }

  function showError(msg) {
    loadingEl.style.display = 'none';
    errorEl.style.display = 'block';
    errorEl.textContent = msg;
    summaryEl.textContent = '';
  }

  async function fetchSummary(text) {
    const res = await fetch('http://localhost:3001/api/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to summarize');
    }
    const data = await res.json();
    return data.summary;
  }

  function formatSummary(summary) {
    // Try to format as bullet points if possible
    const lines = summary.split('\n').filter(line => line.trim());
    if (lines.length > 1) {
      return '<ul>' + lines.map(line => `<li>${line.replace(/^[\-\*\d\.]+\s*/, '')}</li>`).join('') + '</ul>';
    }
    return `<div>${summary}</div>`;
  }
});
