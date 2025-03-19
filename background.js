// Background service worker
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    apiEndpoint: '',
    apiKey: '',
    delayMin: 5,
    delayMax: 15
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'processImage') {
    processImage(request.imageData)
      .then(response => sendResponse(response))
      .catch(error => sendResponse({ error: error.message }));
    return true; // Required for async response
  }
});

async function processImage(imageData) {
  const { apiEndpoint, apiKey } = await chrome.storage.sync.get([
    'apiEndpoint',
    'apiKey'
  ]);
  
  const response = await fetch(apiEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({ image: imageData })
  });

  if (!response.ok) throw new Error('API request failed');
  return response.json();
}
