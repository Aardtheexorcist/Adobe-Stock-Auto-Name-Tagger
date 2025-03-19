// Popup settings script
document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('settings-form');
  const { apiEndpoint, apiKey, delayMin, delayMax } = await chrome.storage.sync.get([
    'apiEndpoint',
    'apiKey',
    'delayMin',
    'delayMax'
  ]);

  document.getElementById('api-endpoint').value = apiEndpoint || '';
  document.getElementById('api-key').value = apiKey || '';
  document.getElementById('delay-min').value = delayMin || 5;
  document.getElementById('delay-max').value = delayMax || 15;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    chrome.storage.sync.set({
      apiEndpoint: document.getElementById('api-endpoint').value,
      apiKey: document.getElementById('api-key').value,
      delayMin: parseInt(document.getElementById('delay-min').value),
      delayMax: parseInt(document.getElementById('delay-max').value)
    }, () => {
      alert('Settings saved successfully!');
    });
  });
});
