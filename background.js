chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed");
});
//let mtsTabId = null; // To store the ID of the original MTS tab

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "openReviewerFinder") {
        //mtsTabId = sender.tab.id; // Store the originating MTS tab ID
        chrome.storage.local.set({ mtsTabId: sender.tab.id });
        chrome.tabs.create(
            { url: "https://reviewerfinder.nature.com/" },
            (tab) => {
                console.log("Reviewer Finder tab opened", tab);

                // Wait for the tab to be fully loaded before injecting the content script
                chrome.tabs.onUpdated.addListener(function listener(
                    tabId,
                    changeInfo
                ) {
                    if (tabId === tab.id && changeInfo.status === "complete") {
                        // Remove the listener after injecting to avoid repeated injections
                        chrome.tabs.onUpdated.removeListener(listener);

                        // Inject the content script
                        chrome.scripting.executeScript({
                            target: { tabId: tab.id },
                            function: prefillReviewerFinderForm,
                            args: [message.data] // Pass the data to the content script function
                        });
                        
                        
                        
                    }
                });
            }
        );
    }
});


// Forward message with reviewer details to mts tab
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("All messages: ", message, sender);
    if (message.action === "sendReviewerDataToMts") {
        // Retrieve the mtsTabId asynchronously only if the action matches
        chrome.storage.local.get("mtsTabId", function (data) {
            let mtsTabId = data.mtsTabId; // Access the mtsTabId from storage

            // Now, check if mtsTabId is not null (or undefined) before sending the message
            if (mtsTabId != null) {
                // Use the stored MTS tab ID to send the message to that specific MTS tab
                chrome.tabs.sendMessage(mtsTabId, {
                    action: "reviewerDetails",
                    data: message.data,
                    senderTabId: sender.tab.id
                });
            }
        });

        // Indicate that sendResponse will be called asynchronously
        return true; // This is necessary if you're using sendResponse asynchronously
    }
    // If the action doesn't match, no need to access storage or return true
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "reviewerAssignmentComplete") {
        console.log("Received from MTS, rev assignment complete");

        chrome.tabs.sendMessage(message.tabId, {
            action: "updateAssignmentStatus",
            status: message.status,
            errorMessage: message.errorMessage,
            uniqueId: message.uniqueId // Forward the unique identifier
        });
    }
});

// This function will be injected into the opened tab to prefill the form
function prefillReviewerFinderForm(data) {
    // Assuming the page structure of reviewerfinder.nature.com allows direct DOM manipulation
    const { title, authors, abstract, MTSid } = data;
    document.querySelector("#paper_title").value = title;
    document.querySelector("#paper_authors").value = authors;
    document.querySelector("#paper_abstract").value = abstract;
    let tabtitle = "Exporting Reviewers " + MTSid;
    document.title = tabtitle;
}


const SESSION_EXPIRATION_IN_MIN = 30;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getOrCreateClientId") {
        getOrCreateClientId().then(clientId => {
            sendResponse({ clientId });
        });
        return true; // Indicates an asynchronous response.
    } else if (request.action === "getOrCreateSessionId") {
        getOrCreateSessionId().then(sessionId => {
            sendResponse({ sessionId });
        });
        return true; // Indicates an asynchronous response.
    }
});

async function getOrCreateClientId() {
    let { clientId } = await chrome.storage.local.get('clientId');
    if (!clientId) {
        clientId = self.crypto.randomUUID();
        await chrome.storage.local.set({ clientId });
    }
    return clientId;
}

async function getOrCreateSessionId() {
    let { sessionData } = await chrome.storage.session.get('sessionData');
    const currentTimeInMs = Date.now();
    if (sessionData && ((currentTimeInMs - sessionData.timestamp) / 60000 > SESSION_EXPIRATION_IN_MIN)) {
        sessionData = null;
    }
    if (!sessionData) {
        sessionData = { session_id: currentTimeInMs.toString(), timestamp: currentTimeInMs };
        await chrome.storage.session.set({ sessionData });
    } else {
        sessionData.timestamp = currentTimeInMs;
        await chrome.storage.session.set({ sessionData });
    }
    return sessionData.session_id;
}
