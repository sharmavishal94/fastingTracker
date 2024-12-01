chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && changes.fasting) {
        // Inject content script into all tabs when fasting starts
        chrome.tabs.query({}, (tabs) => {
            tabs.forEach((tab) => {
                if (tab.id) {
                    chrome.scripting.executeScript({
                        target: { tabId: tab.id },
                        files: ["content.js"],
                    });
                }
            });
        });
    }
});
