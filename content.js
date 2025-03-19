// Content script for Adobe Stock interface
let isProcessing = false;

function getRandomDelay(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function processUploadedImages() {
  if (isProcessing) return;
  isProcessing = true;

  const images = document.querySelectorAll('.uploaded-image');
  const { delayMin, delayMax } = await chrome.storage.sync.get(['delayMin', 'delayMax']);

  for (const image of images) {
    const imageData = image.src;
    const delay = getRandomDelay(delayMin, delayMax);

    try {
      const response = await chrome.runtime.sendMessage({
        action: 'processImage',
        imageData
      });

      if (response.error) throw new Error(response.error);

      // Fill Adobe Stock fields
      const titleField = document.querySelector('#title-field');
      const tagsField = document.querySelector('#tags-field');
      const aiButton = document.querySelector('#ai-generated-button');

      if (aiButton) aiButton.click();
      if (titleField) titleField.value = response.title;
      if (tagsField) tagsField.value = response.tags.join(', ');

      await new Promise(resolve => setTimeout(resolve, delay * 1000));
    } catch (error) {
      console.error('Error processing image:', error);
    }
  }

  isProcessing = false;
}

// Observe DOM changes for new uploads
const observer = new MutationObserver(processUploadedImages);
observer.observe(document.body, { childList: true, subtree: true });
