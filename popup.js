// popup.js - Fixed version
document.addEventListener('DOMContentLoaded', function() {
    const sprintSummaryBtn = document.getElementById('sprintSummary');
    const statusUpdateBtn = document.getElementById('statusUpdate');
    const loadingDiv = document.getElementById('loading');
    
    function showLoading() {
        loadingDiv.style.display = 'block';
    }

    function hideLoading() {
        loadingDiv.style.display = 'none';
    }

    function handleResponse(response) {
        hideLoading();
        if (chrome.runtime.lastError) {
            console.error('Chrome runtime error:', chrome.runtime.lastError);
            alert('Please refresh the page and try again');
            return;
        }
        
        if (response && response.success) {
            // Success - form will appear on the page
            window.close();
        } else {
            alert('Error: ' + (response?.error || 'Please refresh the page and try again'));
        }
    }

    // Sprint Summary Button
    sprintSummaryBtn.addEventListener('click', function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (!tabs[0]) {
                alert('No active tab found');
                return;
            }
            
            // CHECK JIRA STATUS BEFORE SHOWING LOADING
            chrome.tabs.sendMessage(
                tabs[0].id,
                {action: 'checkJiraPage'},
                function(response) {
                    if (chrome.runtime.lastError) {
                        alert('Please refresh the page and try again');
                        return;
                    }
                    
                    if (!response || !response.isJira) {
                        alert('⚠️ This feature only works on Jira pages.\n\nPlease navigate to a Jira page first.');
                        return;
                    }
                    
                    // NOW show loading and proceed
                    showLoading();
                    chrome.tabs.sendMessage(
                        tabs[0].id, 
                        {action: 'generateSummary'}, 
                        handleResponse
                    );
                }
            );
        });
    });

    // Status Update Button
    statusUpdateBtn.addEventListener('click', function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (!tabs[0]) {
                alert('No active tab found');
                return;
            }
            
            // CHECK JIRA STATUS BEFORE SHOWING LOADING
            chrome.tabs.sendMessage(
                tabs[0].id,
                {action: 'checkJiraPage'},
                function(response) {
                    if (chrome.runtime.lastError) {
                        alert('Please refresh the page and try again');
                        return;
                    }
                    
                    if (!response || !response.isJira) {
                        alert('⚠️ This feature only works on Jira pages.\n\nPlease navigate to a Jira page first.');
                        return;
                    }
                    
                    // NOW show loading and proceed
                    showLoading();
                    chrome.tabs.sendMessage(
                        tabs[0].id, 
                        {action: 'generateStatusUpdate'}, 
                        handleResponse
                    );
                }
            );
        });
    });
});