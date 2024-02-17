const host = window.location.host;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "fillForm") {
        alert("fillform");
        document.getElementById("paper_title").value = message.title || "";
        document.getElementById("paper_authors").value = message.authors || "";
        document.getElementById("paper_abstract").value =
            message.abstract || "";
        sendResponse({ status: "Form filled" });
    }
});

// This function is assumed to be part of your content script for reviewerfinder.nature.com
function processReviewerPanels() {
    //  observer.disconnect();

    const reviewerPanels = document.querySelectorAll(".reviewer_panel");

    reviewerPanels.forEach((panel) => {
        // Extracting the reviewer's name
        const nameElement = panel.querySelector(
            "a.name.button-cta.button-right-cta"
        );
        const reviewerName = nameElement
            ? nameElement.textContent.trim()
            : "Unknown";

        // Extracting the reviewer's email
        const emailElement = panel.querySelector("a.email_value");
        const reviewerEmail = emailElement
            ? new URL(emailElement.href).pathname.replace("/mailto:", "")
            : "Unknown";

        // Extracting the reviewer's institution
        const institutionElement = panel.querySelector("li.affiliation");
        const reviewerInstitution = institutionElement
            ? institutionElement.textContent.trim()
            : "Unknown";

        // Insert "Assign" button
        const assignButton = document.createElement("button");
        assignButton.textContent = "Assign";
        assignButton.classList.add("assign-reviewer-btn"); // Add class for styling if needed
        assignButton.onclick = (event) => {
            event.preventDefault(); // Prevent form submission
            sendReviewerDataToMtsTab(
                reviewerName,
                reviewerEmail,
                reviewerInstitution
            );
        };

        panel.appendChild(assignButton);
        // observer.observe(document.body, config);
    });
}

// Function to handle the click event of the "Assign" button
// Assuming this function is triggered when the "Assign" button is clicked
function sendReviewerDataToMtsTab(fullName, email) {
    // Splitting fullName into first and last names
    const [lastName, firstName] = fullName
        .split(", ")
        .map((name) => name.trim());
    console.log(firstName, lastName, email);
    // Send a message to your extension's background script or directly to the MTS tab if you have the tab ID
    chrome.runtime.sendMessage({
        action: "sendReviewerDataToMts",
        data: { firstName, lastName, email }
    });
}

$(document).ready(function () {
    // Instantiate the MutationObserver
    const observer = new MutationObserver((mutationsList, observer) => {
        for (let mutation of mutationsList) {
            if (mutation.type === "childList") {
                console.log(mutation);
                // Check for a more specific condition to avoid unnecessary execution
                if (
                    mutation.addedNodes.length > 0 &&
                    mutation.target.matches(".col-7")
                ) {
                    processReviewerPanels();
                }
            }
        }
    });

    // Observer configuration
    const config = { childList: true, subtree: true };

    // Start observing
    observer.observe(document.body, config);

    // Initial call
    processReviewerPanels();
});
