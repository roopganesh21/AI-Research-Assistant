// Listen for messages from background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getSelectedText') {
    const selection = window.getSelection();
    const selectedText = selection ? selection.toString().trim() : '';
    if (!selectedText) {
      sendResponse({ error: 'No text selected.' });
      return;
    }

    // Show visual feedback
    showProcessingOverlay();

    sendResponse({ text: selectedText });
  }
});

// Visual feedback overlay
function showProcessingOverlay() {
  removeProcessingOverlay();
  const overlay = document.createElement('div');
  overlay.id = 'ai-research-assistant-overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '10px';
  overlay.style.right = '10px';
  overlay.style.zIndex = '9999';
  overlay.style.background = '#222';
  overlay.style.color = '#fff';
  overlay.style.padding = '8px 16px';
  overlay.style.borderRadius = '6px';
  overlay.style.fontSize = '14px';
  overlay.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
  overlay.textContent = 'Processing selection...';
  document.body.appendChild(overlay);

  setTimeout(removeProcessingOverlay, 2000);
}

function removeProcessingOverlay() {
  const existing = document.getElementById('ai-research-assistant-overlay');
  if (existing) {
    existing.remove();
  }
}
