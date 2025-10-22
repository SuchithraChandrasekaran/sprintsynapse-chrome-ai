// background.js - SprintSynapse Enhanced Edition
chrome.runtime.onInstalled.addListener(() => {
    console.log("SprintSynapse installed");
    console.log("Features: Sprint Analytics, Velocity Tracking, Export (PDF/CSV)");
});

// Handle extension icon clicks
chrome.action.onClicked.addListener(async (tab) => {
    console.log("Extension icon clicked on:", tab.url);
    
    try {
        // Send message to check if it's a Jira page
        const response = await chrome.tabs.sendMessage(tab.id, { action: 'checkJiraPage' });
        
        if (response && response.isJira) {
            // Open popup only if on Jira page
            await chrome.action.setPopup({ 
                tabId: tab.id, 
                popup: 'popup.html' 
            });
            
            // Trigger popup to open
            chrome.action.openPopup();
        } else {
            // Show notification that it's not a Jira page
            chrome.notifications.create({
                type: 'basic',
                iconUrl: 'icons/icon125.png',
                title: 'SprintSynapse',
                message: '⚠️ This feature only works on Jira pages.\n\nPlease navigate to a Jira page first.',
                priority: 2
            });
        }
    } catch (error) {
        console.log("Error checking page:", error);
        
        // If content script not loaded, show error
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icons/icon125.png',
            title: 'SprintSynapse',
            message: '⚠️ Please refresh the page and try again.',
            priority: 2
        });
    }
});

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Background received message:", request);
    return true;
});


