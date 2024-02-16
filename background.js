chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "open_tab") {
        // Open a new tab with the Reviewer Finder website
        chrome.tabs.create(
            { url: "https://reviewerfinder.nature.com/" },
            (tab) => {
                // When the tab finishes loading, send a message back to the content script
                // in the new tab
                chrome.tabs.onUpdated.addListener(function listener(
                    tabId,
                    changeInfo,
                    tab
                ) {
                    if (tabId === tab.id && changeInfo.status === "complete") {
                        chrome.tabs.sendMessage(tabId, {
                            action: "insert_text",
                            title: message.title,
                            abstract: message.abstract,
                            authors: message.authors
                        });
                        chrome.tabs.onUpdated.removeListener(listener);
                    }
                });
            }
        );
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message && message.action === "Add Ref") {
        // send a message to all tabs
        chrome.tabs.query({}, function (tabs) {
            for (let i = 0; i < tabs.length; i++) {
                chrome.tabs.sendMessage(tabs[i].id, {
                    action: "Add Ref",
                    email: message.email,
                    fname: message.fname,
                    lname: message.lname,
                    org: message.org
                });
            }
        });
    }
});
