// popup.js

// Get the button and result div from the popup.html
const analyzeButton = document.getElementById('analyze-page');
const resultDiv = document.getElementById('result');
// Add a click event listener to the button
analyzeButton.addEventListener('click', async () => {
// just showing a message that it worked!
      resultDiv.innerHTML = "<p>✅ Extension is connected! (Analysis logic coming soon...)</p>";
});
