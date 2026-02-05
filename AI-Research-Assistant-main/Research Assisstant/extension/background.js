chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'summarize-with-ai',
    title: 'Summarize with AI',
    contexts: ['selection']
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'summarize-with-ai' && tab.id) {
    // Request selected text from content script
    chrome.tabs.sendMessage(tab.id, { action: 'getSelectedText' }, async (response) => {
      if (!response || !response.text) {
        notify('No text selected or unable to retrieve selection.');
        return;
      }

      try {
        const summary = await fetchSummary(response.text);
        notify('Summary:\n' + summary);
        // Optionally, send summary to popup or elsewhere
      } catch (err) {
        notify('Error: ' + err.message);
      }
    });
  }
});

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

function notify(message) {
  chrome.notifications?.create({
    type: 'basic',
    iconUrl: 'icon.png',
    title: 'AI Research Assistant',
    message: message
  });
}
