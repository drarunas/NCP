chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed");
});
let mtsTabId = null; // To store the ID of the original MTS tab

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "openReviewerFinder") {
        mtsTabId = sender.tab.id; // Store the originating MTS tab ID
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

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "sendReviewerDataToMts" && mtsTabId !== null) {
        console.log(message);
        // Use the stored MTS tab ID to send the message to that specific tab
        chrome.tabs.sendMessage(mtsTabId, {
            action: "reviewerDetails",
            data: message.data
        });
    }
});

// This function will be injected into the opened tab to prefill the form
function prefillReviewerFinderForm(data) {
    // Assuming the page structure of reviewerfinder.nature.com allows direct DOM manipulation
    const { title, authors, abstract } = data;
    document.querySelector("#paper_title").value = title;
    document.querySelector("#paper_authors").value = authors;
    document.querySelector("#paper_abstract").value = abstract;
}
