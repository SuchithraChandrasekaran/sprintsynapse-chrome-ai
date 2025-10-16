// background.js - SprintSynapse Enhanced Edition
chrome.runtime.onInstalled.addListener(() => {
    console.log("SprintSynapse Enhanced Edition installed");
    console.log("Features: Sprint Analytics, Velocity Tracking, Export (PDF/CSV)");
});

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Background received message:", request);
    return true;
});