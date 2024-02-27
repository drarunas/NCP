const host = window.location.host;
console.log(host);
const scriptElement = document.createElement("script");
scriptElement.src = chrome.runtime.getURL("setcolor.js");
scriptElement.onload = function () {
    this.remove(); // Clean up after injection
};
(document.head || document.documentElement).appendChild(scriptElement);

// REMOVING DEFAULT CSS
if (host.includes("mts-ncomms.nature.com")) {
    console.log("removing css");
    // Find the <link> element with the specified href attribute
    var linkElement = document.querySelector(
        'link[href="https://mts-ncomms.nature.com/html/style.css"]'
    );

    // Check if the element exists before removing it
    if (linkElement) {
        linkElement.remove();
    }

    var linkElement = document.querySelector(
        'link[href="https://mts-ncomms.nature.com/html/default_folder.css?1550611957"]'
    );

    // Check if the element exists before removing it
    if (linkElement) {
        linkElement.remove();
    }
}

function loadRobotoFont() {
    // Create a <link> element to import the Roboto font from Google Fonts
    var linkElement = document.createElement("link");
    linkElement.href =
        "https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap";
    linkElement.rel = "stylesheet";

    document.head.appendChild(linkElement);
}
if (host.includes("mts-ncomms.nature.com")) {
    loadRobotoFont();
}

//RESTYLING THE HOME PAGE
$(document).ready(function () {
    var targetRowsTitles = [
        "Invited and Agreed",
        "Initial QC",
        "Editor Assignment",
        "Manuscript Assessment Before Review",
        "Contact Potential Referees",
        "Under Review",
        "Review Past Due",
        "Draft Editor Recommendations",
        "Review Circulated Recommendations",
        "Manuscript Decision",
        "Decisions Ready for Author",
        "All Pending Manuscripts",
        "Post Decision",
        "Waiting for Revised Manuscript",
        "Transferred",
        "Queued E-mail",
        "Export System"
    ];

    var spans = document.querySelectorAll("span.TITLE");
    spans.forEach(function (span) {
        if (span.textContent.includes("Author Tasks")) {
            var table = span.closest("table");

            // Folders button and div
            var foldersButton = document.createElement("button");
            foldersButton.textContent = "⬇️ Folders";
            foldersButton.style.display = "block";
            foldersButton.style.marginBottom = "10px";

            var foldersContent = document.createElement("div");
            foldersContent.style.display = "none";

            var newFoldersTable = document.createElement("table");
            newFoldersTable.className = "modern-look";
            foldersContent.appendChild(newFoldersTable);

            // Other Tasks button and div
            var otherTasksButton = document.createElement("button");
            otherTasksButton.textContent = "⬇️ Other Tasks";
            otherTasksButton.style.display = "block";
            otherTasksButton.style.marginBottom = "10px";

            var otherTasksContent = document.createElement("div");
            otherTasksContent.style.display = "none";

            var newOtherTasksTable = document.createElement("table");

            newOtherTasksTable.className = "other-tasks-table";

            otherTasksContent.appendChild(newOtherTasksTable);

            table.parentNode.insertBefore(foldersButton, table);
            table.parentNode.insertBefore(foldersContent, table);
            table.parentNode.insertBefore(otherTasksButton, table);
            table.parentNode.insertBefore(otherTasksContent, table);

            var rows = Array.from(table.querySelectorAll("tr"));
            rows.forEach(function (row) {
                var bodySpans = row.querySelectorAll("span.BODY");
                var isTargetRow = Array.from(bodySpans).some(function (
                    bodySpan
                ) {
                    return targetRowsTitles.includes(
                        bodySpan.textContent.trim()
                    );
                });

                if (isTargetRow) {
                    newFoldersTable.appendChild(row.cloneNode(true)); // Add to Folders table
                } else {
                    newOtherTasksTable.appendChild(row.cloneNode(true)); // Add to Other Tasks table
                }
            });

            // Remove the original table after cloning its rows
            table.remove();

            // Toggle visibility for Folders
            var foldersState =
                localStorage.getItem("foldersState") || "collapsed";
            var otherTasksState =
                localStorage.getItem("otherTasksState") || "collapsed";

            foldersContent.style.display =
                foldersState === "expanded" ? "" : "none";
            otherTasksContent.style.display =
                otherTasksState === "expanded" ? "" : "none";

            // Toggle visibility for Folders
            foldersButton.addEventListener("click", function () {
                var isExpanded = foldersContent.style.display !== "none";
                foldersContent.style.display = isExpanded ? "none" : "";
                localStorage.setItem(
                    "foldersState",
                    isExpanded ? "collapsed" : "expanded"
                );
            });

            // Toggle visibility for Other Tasks
            otherTasksButton.addEventListener("click", function () {
                var isExpanded = otherTasksContent.style.display !== "none";
                otherTasksContent.style.display = isExpanded ? "none" : "";
                localStorage.setItem(
                    "otherTasksState",
                    isExpanded ? "collapsed" : "expanded"
                );
            });
        }
    });

    var tdElements = document.querySelectorAll(".other-tasks-table td");
    tdElements.forEach(function (td) {
        td.removeAttribute("nowrap");
    });

    // Find the <tr> element with the class 'ncommsbg'
    var trElement = document.querySelector("tr.ncommsbg");
    // Check if the <tr> element exists
    if (trElement) {
        // Navigate up to the parent <table> element
        var tableElement = trElement.closest("table");

        // Check if the parent <table> element exists
        if (tableElement) {
            // Remove the <table> element from the DOM
            tableElement.parentNode.removeChild(tableElement);
        }
    }

    // Find all images on the page
    const images = document.getElementsByTagName("img");
    // Iterate backwards through the NodeList
    for (let i = images.length - 1; i >= 0; i--) {
        if (
            images[i].src ===
            "https://mts-ncomms.nature.com/images/bred_arrow.gif"
        ) {
            // Create a span element for the arrow emoji
            const arrowEmojiSpan = document.createElement("span");
            arrowEmojiSpan.innerHTML = "✨"; // Arrow emoji
            // Replace the image with the arrow emoji span
            images[i].parentNode.replaceChild(arrowEmojiSpan, images[i]);
        } else if (
            images[i].src ===
                "https://mts-ncomms.nature.com/images/folder_closed.gif" ||
            images[i].src === "https://mts-ncomms.nature.com/images/folder.gif"
        ) {
            // Create a span element for the folder emoji
            const folderEmojiSpan = document.createElement("span");
            folderEmojiSpan.innerHTML = "🗂️"; // Folder emoji
            // Replace the image with the folder emoji span
            images[i].parentNode.replaceChild(folderEmojiSpan, images[i]);
        }
    }

    /*   // Identify the table by finding a span with class "TITLE" that contains specific text
    var spans = document.querySelectorAll("span.TITLE");
    spans.forEach(function (span) {
        if (
            span.textContent.includes("Author Tasks") ||
            span.textContent.includes("General Tasks")
        ) {
            // Find the table by traversing up from the span
            var table = span.closest("table");

            // Add a custom class to the table for styling
            if (table) {
                table.classList.add("modern-look");

                // Remove rows that are exactly <tr><td></td></tr>
                var rows = table.querySelectorAll("tr");
                rows.forEach(function (row) {
                    // Check if the row has exactly one td element that is empty
                    if (
                        row.cells.length === 1 &&
                        !row.cells[0].textContent.trim()
                    ) {
                        row.remove();
                    }
                });
                table.style.marginLeft = "auto";
                table.style.marginRight = "auto";
                table.style.display = "block";
            }
        }
    });

    // Find the <tr> element with the class 'ncommsbg'
    var trElement = document.querySelector("tr.ncommsbg");
    // Check if the <tr> element exists
    if (trElement) {
        // Navigate up to the parent <table> element
        var tableElement = trElement.closest("table");

        // Check if the parent <table> element exists
        if (tableElement) {
            // Remove the <table> element from the DOM
            tableElement.parentNode.removeChild(tableElement);
        }
    }

    // Find all images on the page
    const images = document.getElementsByTagName("img");
    // Iterate backwards through the NodeList
    for (let i = images.length - 1; i >= 0; i--) {
        if (
            images[i].src ===
            "https://mts-ncomms.nature.com/images/bred_arrow.gif"
        ) {
            // Create a span element for the arrow emoji
            const arrowEmojiSpan = document.createElement("span");
            arrowEmojiSpan.innerHTML = "✨"; // Arrow emoji
            // Replace the image with the arrow emoji span
            images[i].parentNode.replaceChild(arrowEmojiSpan, images[i]);
        } else if (
            images[i].src ===
                "https://mts-ncomms.nature.com/images/folder_closed.gif" ||
            images[i].src === "https://mts-ncomms.nature.com/images/folder.gif"
        ) {
            // Create a span element for the folder emoji
            const folderEmojiSpan = document.createElement("span");
            folderEmojiSpan.innerHTML = "🗂️"; // Folder emoji
            // Replace the image with the folder emoji span
            images[i].parentNode.replaceChild(folderEmojiSpan, images[i]);
        }
    }*/
});

if (host.includes("mts-ncomms.nature.com")) {
    // SEARCH BOX ON TOP OF PAGE

    document.body.insertAdjacentHTML(
        "afterbegin",
        `
<div id="myExtensionSearchBox">
  <button id="homeBtn" class="topButtons" title="Home">🏠</button>
  <button id="initialAssessmentBtn" class="topButtons" title="Initial assessment">📃</button>
    <button id="inboxBtn" class="topButtons" title="Circulations">🕓</button>
  <button id="decisionsBtn" class="topButtons" title="Decisions">✔️</button>
  <button id="allBtn" class="topButtons" title="All">📁</button>
  <input type="text" id="searchInput" placeholder="🐳 Last Name or MS#">
  <div id="spinner" class="spinner" style="display: none;"></div>
  <button id="searchBtn">🍁Search</button>
</div>

`
    );

    document
        .getElementById("searchInput")
        .addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                // Checks if the key pressed is the Enter key
                event.preventDefault(); // Prevents the default action of the enter key (submitting the form)

                // Trigger the search functionality
                const searchTerm = document.getElementById("searchInput").value;
                // Show the spinner
                document.getElementById("spinner").style.display =
                    "inline-block"; // Show spinner

                fetch("https://mts-ncomms.nature.com/cgi-bin/main.plex", {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/x-www-form-urlencoded; charset=UTF-8"
                        // Include other necessary headers
                    },
                    body: `form_type=tb_find_ms_or_person&j_id=18&search_pattern=${encodeURIComponent(
                        searchTerm
                    )}&time=${new Date().getTime()}`,
                    credentials: "include"
                })
                    .then((response) => response.text())
                    .then((data) => {
                        // Hide the spinner
                        document.getElementById("spinner").style.display =
                            "none";
                        // Process and display your results
                        showResultsPopup(data);
                    })
                    .catch((error) => {
                        console.error("Error:", error);
                        // Hide the spinner
                        document.getElementById("spinner").style.display =
                            "none";
                    });
            }
        });

    document.getElementById("searchBtn").addEventListener("click", function () {
        const searchTerm = document.getElementById("searchInput").value;
        // Show the spinner
        document.getElementById("spinner").style.display = "inline-block"; // Show spinner

        fetch("https://mts-ncomms.nature.com/cgi-bin/main.plex", {
            method: "POST",
            headers: {
                "Content-Type":
                    "application/x-www-form-urlencoded; charset=UTF-8"
                // Include other necessary headers
            },
            body: `form_type=tb_find_ms_or_person&j_id=18&search_pattern=${encodeURIComponent(
                searchTerm
            )}&search_popup_type=classic&time=${new Date().getTime()}`,
            credentials: "include"
        })
            .then((response) => response.text())
            .then((data) => {
                // Hide the spinner
                document.getElementById("spinner").style.display = "none";
                // Process and display your results
                showResultsPopup(data);
            })
            .catch((error) => {
                console.error("Error:", error);
                // Hide the spinner
                document.getElementById("spinner").style.display = "none";
            });
    });

    document.getElementById("homeBtn").addEventListener("click", function () {
        window.location.href =
            "https://mts-ncomms.nature.com/cgi-bin/main.plex?form_type=home";
    });
    document
        .getElementById("initialAssessmentBtn")
        .addEventListener("click", function () {
            window.location.href =
                "https://mts-ncomms.nature.com/cgi-bin/main.plex?form_type=folder_contents_display&j_id=18&ms_id_key=640ftdtJ1b9nNueyQ8JqGZ0WNA&ft_key=pRsEebnbKpjLRvyB2r8ANQ&ndt=AXE3O3eZ&folder_id=1200;role_id=30;view=pe_ind;flag_desktop=0;export_vendor=";
        });

    document
        .getElementById("decisionsBtn")
        .addEventListener("click", function () {
            window.location.href =
                "https://mts-ncomms.nature.com/cgi-bin/main.plex?form_type=folder_contents_display&j_id=18&ms_id_key=362ftd9CeR2QzL3n7fxwEYe2Pelg&ft_key=pRsEebnbKpjLRvyB2r8ANQ&ndt=Aeo3O0eZ&folder_id=1600;role_id=30;view=pe_ind;flag_desktop=0;export_vendor=";
        });

    document.getElementById("allBtn").addEventListener("click", function () {
        window.location.href =
            "https://mts-ncomms.nature.com/cgi-bin/main.plex?form_type=folder_contents_display&j_id=18&ms_id_key=835ftd4iFHDNZb7YjtRPDt6k11mA&ft_key=pRsEebnbKpjLRvyB2r8ANQ&ndt=Aig7O3eZ&folder_id=1800;role_id=30;view=pe_ind;flag_desktop=0;export_vendor=";
    });
    document.getElementById("inboxBtn").addEventListener("click", function () {
        window.location.href =
            "https://mts-ncomms.nature.com/cgi-bin/main.plex?form_type=folder_contents_display&j_id=18&ms_id_key=155ftdNBIBwmImXZBgDmlrTX7Q&ft_key=pRsEebnbKpjLRvyB2r8ANQ&ndt=AdW7O3eZ&folder_id=1530;role_id=30;view=pe_ind;flag_desktop=0;export_vendor=";
    });
}

function showResultsPopup(data) {
    // Create the main popup container
    const resultsDiv = document.createElement("div");
    resultsDiv.className = "popupWindow";

    // Create the scrollable content container
    const contentDiv = document.createElement("div");
    contentDiv.className = "popupContent";
    contentDiv.innerHTML = data; // Assuming the response is HTML

    // Create the close button
    const closeButton = document.createElement("button");
    closeButton.textContent = "Close";
    closeButton.className = "closeButton";
    closeButton.addEventListener("click", function () {
        resultsDiv.remove(); // This will remove the popup from the document
    });

    // Append the close button and content container to the main popup container
    resultsDiv.appendChild(closeButton);
    resultsDiv.appendChild(contentDiv);

    // Append the main popup container to the body
    document.body.appendChild(resultsDiv);
}

//ADDING REVIEWERS
$(document).ready(function () {
    if (document.getElementById("nf_assign_rev")) {
        // The form exists, proceed with adding the mini window/bar
        addMiniWindow();
    } else {
        console.log('Form with id "nf_assign_ref" not found.');
    }
});

function addMiniWindow() {
    const miniWindowHTML = `
        <div id="miniWindow" style="position: fixed; bottom: 0; left: 0; width: 100%; background-color: #f0f0f0; padding: 10px; box-shadow: 0 -2px 5px rgba(0,0,0,0.2); display: flex; justify-content: center; gap: 10px;">
            <input type="text" id=" 🐇 firstName" placeholder="First Name">
            <input type="text" id="lastName" placeholder="Last Name">
            <input type="email" id="email" placeholder="Email">
            <button id="addButton">Add</button>
            <button id="reviewerFinder">🔎 Reviewer Finder</button>
        </div>
    `;
    document.body.insertAdjacentHTML("beforeend", miniWindowHTML);
    document.getElementById("addButton").addEventListener("click", submitForm);
    document
        .getElementById("reviewerFinder")
        .addEventListener("click", extractTableData);
}

function submitForm() {
    const form = document.getElementById("nf_assign_rev");

    // Safely extracting values by checking if elements exist
    const getValueByName = (name) => {
        const element = form.querySelector(`[name="${name}"]`);
        return element ? element.value : null;
    };

    const formType = getValueByName("form_type");
    const jId = getValueByName("j_id");
    const msId = getValueByName("ms_id");
    const msRevNo = getValueByName("ms_rev_no");
    const msIdKey = getValueByName("ms_id_key");
    const ndt = getValueByName("ndt");
    const currentStageId = getValueByName("current_stage_id");
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;

    // Constructing the request body with both static and dynamic parts
    const requestBody = `form_type=${encodeURIComponent(
        formType
    )}&j_id=${encodeURIComponent(jId)}&ms_id=${encodeURIComponent(
        msId
    )}&ms_rev_no=${encodeURIComponent(msRevNo)}&ms_id_key=${encodeURIComponent(
        msIdKey
    )}&ndt=${encodeURIComponent(ndt)}&current_stage_id=${encodeURIComponent(
        currentStageId
    )}&first_nm=${encodeURIComponent(firstName)}&last_nm=${encodeURIComponent(
        lastName
    )}&email=${encodeURIComponent(email)}&action=Add+Person+Check`;

    fetch("https://mts-ncomms.nature.com/cgi-bin/main.plex", {
        headers: {
            accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-language": "en-US,en;q=0.9",
            "cache-control": "max-age=0",
            "content-type": "application/x-www-form-urlencoded"
            // Include other necessary headers
        },
        referrer: "https://mts-ncomms.nature.com/cgi-bin/main.plex",
        referrerPolicy: "strict-origin-when-cross-origin",
        body: requestBody,
        method: "POST",
        mode: "cors",
        credentials: "include"
    })
        .then((response) => response.text())
        .then((html) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");

            // Check for the existence of a span with class "MSG"
            const msgSpan = doc.querySelector("span.MSG");

            const tableExists =
                doc.querySelector("#artv_search_results_tbl") !== null;

            // Define variable to hold the reviewer ID
            let reviewerId = null;

            // Check if the conditions are met
            if (
                msgSpan &&
                msgSpan.textContent.includes(
                    "Possible matching accounts found based on Last Name and Email, Last Name and Phone # and/or Last Name and First Initial."
                ) &&
                tableExists
            ) {
                // Find the input element within the table and get its value
                const inputRadio = doc.querySelector(
                    'input[type="radio"][name="reviewer"]'
                );

                // Inside submitForm, after finding the reviewerId
                if (inputRadio) {
                    reviewerId = inputRadio.value;
                    console.log("Reviewer ID:", reviewerId);
                    // Call assignReviewer with all necessary parameters
                    assignReviewer(
                        reviewerId,
                        jId,
                        msId,
                        msRevNo,
                        msIdKey,
                        currentStageId
                    );
                } else {
                    console.log("No matching input element found.");
                }
            } else {
                console.log("Conditions not met or table/input not found.");
            }
        })
        .catch((error) => {
            console.error(
                "There has been a problem with your fetch operation:",
                error
            );
        });
}

function assignReviewer(
    reviewerId,
    jId,
    msId,
    msRevNo,
    msIdKey,
    currentStageId
) {
    // Assuming these additional values are also needed and obtained earlier
    const requestBody = `form_type=assign_rev_tab_view_store&j_id=${encodeURIComponent(
        jId
    )}&ms_id=${encodeURIComponent(msId)}&ms_rev_no=${encodeURIComponent(
        msRevNo
    )}&ms_id_key=${encodeURIComponent(
        msIdKey
    )}&current_stage_id=${encodeURIComponent(
        currentStageId
    )}&reviewer=${encodeURIComponent(reviewerId)}&action=Assign`;

    fetch("https://mts-ncomms.nature.com/cgi-bin/main.plex", {
        method: "POST",
        headers: {
            accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-language": "en-US,en;q=0.9",
            "cache-control": "max-age=0",
            "content-type": "application/x-www-form-urlencoded"
            // Include other necessary headers
        },
        referrer: "https://mts-ncomms.nature.com/cgi-bin/main.plex",
        referrerPolicy: "strict-origin-when-cross-origin",
        body: requestBody,
        mode: "cors",
        credentials: "include"
    })
        .then((response) => {
            if (response.ok) {
                console.log("Assignment of existing successful:");
                return response.text(); // Or response.json() if the response is JSON.
            }
            throw new Error("Network response was not ok.");
        })
        .then((data) => {
            console.log("Assignment successful:", data);
            // Handle successful assignment here
        })
        .catch((error) => {
            console.error("Error during assignment:", error);
        });
}

function extractTableData() {
    const msDetailsRow = document.querySelector(
        "#ms_details_row_author_information"
    );
    if (!msDetailsRow) {
        console.error("The table row with author information was not found.");
        return;
    }

    const table = msDetailsRow.closest("table"); // Find the closest parent table

    // Function to find sibling TD text based on TH text content
    const findDataByText = (headerText) => {
        const th = Array.from(table.querySelectorAll("th")).find((th) =>
            th.textContent.includes(headerText)
        );
        return th ? th.nextElementSibling.textContent : "Not found";
    };

    // Utility function to clean text
    const cleanText = (text) => {
        // Remove honorifics and content within parentheses
        let cleanedText = text
            .replace(/\b(Dr|Mr|Ms|Mrs|Miss|Professor)\.?\s+/gi, "")
            .replace(/\(.*?\)/g, "")
            .trim();
        // Additional cleaning for extra spaces within names
        cleanedText = cleanedText.replace(/\s{2,}/g, " ");
        return cleanedText;
    };

    // Split and clean individual author names
    const splitAndCleanAuthors = (authorsText) => {
        return authorsText
            .split(",")
            .map((author) => author.trim()) // Trim each author name
            .filter(Boolean); // Remove any empty strings resulting from split
    };

    // Extract, clean, and process the author information
    let contributingAuthorsText = findDataByText("Contributing Authors");
    let correspondingAuthorText = findDataByText("Corresponding Author");

    contributingAuthorsText = cleanText(contributingAuthorsText);
    correspondingAuthorText = cleanText(correspondingAuthorText);

    const contributingAuthors = splitAndCleanAuthors(contributingAuthorsText);
    const correspondingAuthor = splitAndCleanAuthors(correspondingAuthorText);

    // Combine and deduplicate author names
    const allAuthorsSet = new Set([
        ...contributingAuthors,
        ...correspondingAuthor
    ]);
    const authors = Array.from(allAuthorsSet).join(", ");

    // Logging or further processing
    console.log({
        title: findDataByText("Title"),
        abstract: findDataByText("Abstract"),
        authors
    });
    // Assuming you have a function to handle the extracted data
    // handleExtractedData(findDataByText('Title'), findDataByText('Abstract'), authors);
    reviewerFinder(
        findDataByText("Title"),
        authors,
        findDataByText("Abstract")
    );
    reviewerFinderPopup();
}

function reviewerFinderPopup() {
    // Create the popup container
    const popup = document.createElement("div");
    popup.className = "reviewerFinderPopup"; // Assign a class for styling

    const form = document.getElementById("nf_assign_rev");

    const getValueByName = (name) => {
        const element = form ? form.querySelector(`[name="${name}"]`) : null;
        return element ? element.value : null;
    };

    const formType = getValueByName("form_type");
    const jId = getValueByName("j_id");
    const msId = getValueByName("ms_id");
    const msRevNo = getValueByName("ms_rev_no");
    const msIdKey = getValueByName("ms_id_key");
    const ndt = getValueByName("ndt");
    const currentStageId = getValueByName("current_stage_id");
    const desiredRevCnt = getValueByName("desired_rev_cnt");

    // Create a header container for title and close button
    const header = document.createElement("div");
    header.className = "popupHeader"; // Use this class for flexbox styling

    // Create the title
    const title = document.createElement("h2");
    title.textContent = "↙ From Reviewer Finder";
    title.className = "popupTitle"; // Assign class for potential styling
    title.style.marginRight = "auto"; // Pushes everything else to the right

    // Create the close button
    const closeButton = document.createElement("button");
    closeButton.textContent = "Close";
    closeButton.className = "popupCloseButton";
    closeButton.onclick = function () {
        document.body.removeChild(popup);
        // Dynamically construct the URL with form values
        window.location.href = `https://mts-ncomms.nature.com/cgi-bin/main.plex?form_type=${formType}&j_id=${jId}&ms_id=${msId}&ms_rev_no=${msRevNo}&ms_id_key=${msIdKey}&current_stage_id=${currentStageId}&show_tab=CurrentList&redirected=1&desired_rev_cnt=${desiredRevCnt}`;
    };

    // Append title and close button to the header
    header.appendChild(title);
    header.appendChild(closeButton);

    // Create the scrollable list
    const list = document.createElement("ul");
    list.className = "popupList"; // Assign a class for easy reference

    // Append header and list to the popup
    popup.appendChild(header);
    popup.appendChild(list);

    // Append the popup to the body
    document.body.appendChild(popup);
}

// Function to add items to the popup list
// Function to add reviewer details to the popup list
function populatePopupList(firstName, lastName, email, comment) {
    const list = document.querySelector(".popupList"); // Find the list by class name
    if (list) {
        const item = document.createElement("li");
        item.textContent = `✅ ${lastName}, ${firstName}, ${email}, ${comment}`;
        list.appendChild(item); // Add the new item to the list
    } else {
        console.error(
            "Popup list not found. Ensure the popup is created before populating."
        );
    }
}

function reviewerFinder(title, authors, abstract) {
    chrome.runtime.sendMessage({
        action: "openReviewerFinder",
        data: { title, authors, abstract }
    });
}
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "reviewerDetails") {
        const { firstName, lastName, inst, email, uniqueId } = message.data;
        const senderTabId = message.senderTabId;
        console.log("received in mts", message.data);
        submitFormAssign(firstName, lastName, email, uniqueId, senderTabId);
        //sendResponse({ status: "success", result: result });
    }
});

function submitFormAssign(firstName, lastName, email, uniqueId, senderTabId) {
    const form = document.getElementById("nf_assign_rev");

    // Safely extracting values by checking if elements exist
    const getValueByName = (name) => {
        const element = form.querySelector(`[name="${name}"]`);
        return element ? element.value : null;
    };

    const formType = getValueByName("form_type");
    const jId = getValueByName("j_id");
    const msId = getValueByName("ms_id");
    const msRevNo = getValueByName("ms_rev_no");
    const msIdKey = getValueByName("ms_id_key");
    const ndt = getValueByName("ndt");
    const currentStageId = getValueByName("current_stage_id");
    const desiredRevCnt = getValueByName("desired_rev_cnt");

    // Constructing the request body with both static and dynamic parts
    const requestBody = `form_type=${encodeURIComponent(
        formType
    )}&j_id=${encodeURIComponent(jId)}&ms_id=${encodeURIComponent(
        msId
    )}&ms_rev_no=${encodeURIComponent(msRevNo)}&ms_id_key=${encodeURIComponent(
        msIdKey
    )}&ndt=${encodeURIComponent(ndt)}&current_stage_id=${encodeURIComponent(
        currentStageId
    )}&first_nm=${encodeURIComponent(firstName)}&last_nm=${encodeURIComponent(
        lastName
    )}&desired_rev_cnt=${encodeURIComponent(
        desiredRevCnt
    )}&email=${encodeURIComponent(email)}&action=Add+Person+Check`;
    console.log(requestBody);
    fetch("https://mts-ncomms.nature.com/cgi-bin/main.plex", {
        headers: {
            accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-language": "en-US,en;q=0.9",
            "cache-control": "max-age=0",
            "content-type": "application/x-www-form-urlencoded"
            // Include other necessary headers
        },
        referrer: "https://mts-ncomms.nature.com/cgi-bin/main.plex",
        referrerPolicy: "strict-origin-when-cross-origin",
        body: requestBody,
        method: "POST",
        mode: "cors",
        credentials: "include"
    })
        .then((response) => response.text())
        .then((html) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");

            // Check for the existence of a span with class "MSG"
            const msgSpan = doc.querySelector("span.MSG");

            const tableExists =
                doc.querySelector("#artv_search_results_tbl") !== null;

            // Define variable to hold the reviewer ID
            let reviewerId = null;

            // Check if the conditions are met
            if (
                msgSpan &&
                msgSpan.textContent.includes(
                    "Possible matching accounts found based on Last Name and Email, Last Name and Phone # and/or Last Name and First Initial."
                ) &&
                tableExists
            ) {
                // Find the input element within the table and get its value
                const inputRadio = doc.querySelector(
                    'input[type="radio"][name="reviewer"]'
                );

                // Inside submitForm, after finding the reviewerId
                if (inputRadio) {
                    reviewerId = inputRadio.value;
                    console.log("Reviewer ID:", reviewerId);
                    // Call assignReviewer with all necessary parameters
                    assignReviewer(
                        reviewerId,
                        jId,
                        msId,
                        msRevNo,
                        msIdKey,
                        currentStageId
                    );

                    //add reviewer details to my list in popup
                    populatePopupList(
                        firstName,
                        lastName,
                        email,
                        "Existing found"
                    );
                    chrome.runtime.sendMessage({
                        action: "reviewerAssignmentComplete",
                        status: "success",
                        uniqueId: uniqueId, // Include the uniqueId in the response
                        tabId: senderTabId // Include the sender tab ID if not already tracked
                    });
                } else {
                    console.log("No matching input element found.");
                }
            } else {
                // Check for <script> tags containing specific JavaScript redirection
                const scripts = doc.querySelectorAll("script");
                let foundRedirect = false;

                scripts.forEach((script) => {
                    const scriptContent =
                        script.textContent || script.innerText;
                    if (
                        scriptContent.includes(
                            "window.location.href='https://mts-ncomms.nature.com/cgi-bin/main.plex?"
                        )
                    ) {
                        console.log("Found redirect script:", scriptContent);
                        foundRedirect = true;
                        populatePopupList(
                            firstName,
                            lastName,
                            email,
                            "New Added"
                        );
                        chrome.runtime.sendMessage({
                            action: "reviewerAssignmentComplete",
                            status: "success",
                            uniqueId: uniqueId, // Include the uniqueId in the response
                            tabId: senderTabId // Include the sender tab ID if not already tracked
                        });
                    }
                });

                if (!foundRedirect) {
                    console.log(
                        "No redirect script found with the specified pattern."
                    );
                }
            }
        })
        .catch((error) => {
            console.error(
                "There has been a problem with your fetch operation:",
                error
            );
        });
}

$(document).ready(function () {
    // Attempt to find the select element by its name
    const selectElement = document.getElementsByName("editor_list")[0];

    if (selectElement) {
        console.log("Shortening editor list");
        // The select element exists, proceed with the rest of the operations

        // Create a checkbox
        const checkbox = document.createElement("input");
        checkbox.setAttribute("type", "checkbox");
        checkbox.setAttribute("id", "filterCheckbox");
        checkbox.checked = true;

        // Create a label for the checkbox
        const label = document.createElement("label");
        label.setAttribute("for", "filterCheckbox");
        label.textContent = "Show human team only";

        // Insert the checkbox and label before the select element
        selectElement.parentNode.insertBefore(
            checkbox,
            selectElement.nextSibling
        );
        selectElement.parentNode.insertBefore(label, checkbox.nextSibling);

        // Filter Select Options based on Checkbox
        checkbox.addEventListener("change", function () {
            const options = selectElement.options;
            const filterNames = [
                "Myrthel",
                "Brittany Car",
                "Yann",
                "Arunas",
                "Nicole"
            ];

            for (let i = 0; i < options.length; i++) {
                const option = options[i];
                // If checkbox is checked, show only the options that match the filterNames
                if (this.checked) {
                    if (
                        filterNames.some((name) => option.text.includes(name))
                    ) {
                        option.style.display = ""; // Show option
                    } else {
                        option.style.display = "none"; // Hide option
                    }
                } else {
                    option.style.display = ""; // Show all options when checkbox is unchecked
                }
            }
        });
        // Trigger the change event to apply filter on page load
        checkbox.dispatchEvent(new Event("change"));
    } else {
        // The select element does not exist, handle accordingly
        console.log(
            'Select element named "editor_list" was not found on the page.'
        );
    }
});

$(document).ready(function () {
    const selectElement = document.querySelector('select[name="template"]');

    // Stop if the select element does not exist
    if (!selectElement) {
        console.log('Select element with name="template" not found.');
        return;
    }

    const optionExists = Array.from(selectElement.options).some((option) =>
        option.text.includes("AIP - Comments")
    );

    // Optionally, also stop if the specific option does not exist
    if (!optionExists) {
        console.log("Specific option not found in the select element.");
        return;
    }

    // Check if the specific element exists on the page
    if (selectElement && optionExists) {
        // Create a checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = "commonChoicesCheckbox";
        checkbox.checked = true; // Selected by default
        const label = document.createElement("label");
        label.htmlFor = "commonChoicesCheckbox";
        label.appendChild(document.createTextNode("Common choices"));

        // Insert the checkbox above the select element
        selectElement.parentNode.insertBefore(label, selectElement);
        selectElement.parentNode.insertBefore(checkbox, label);

        // Function to filter options
        const filterOptions = () => {
            const commonChoices = [
                "Reject – no review (DC)",
                "Reject – no review (DC) - Comments",
                "Reject – post review (DC)",
                "Revise (3 months)",
                "Revise (4 weeks)",
                "AIP letter for new process with calculator"
            ];

            Array.from(selectElement.options).forEach((option) => {
                if (checkbox.checked) {
                    // Show only common choices
                    if (!commonChoices.includes(option.text.trim())) {
                        option.style.display = "none";
                    } else {
                        option.style.display = "block";
                    }
                } else {
                    // Show all options
                    option.style.display = "block";
                }
            });
        };

        // Initial filter to apply when the script loads
        filterOptions();

        // Event listener for the checkbox
        checkbox.addEventListener("change", filterOptions);
    }
});

document
    .querySelectorAll(
        ".folder_table td.folder_row_even, .folder_table td.folder_row_odd"
    )
    .forEach((td) => {
        // Only add a wrapper if it doesn't already exist
        if (!td.querySelector(".content-wrapper")) {
            const wrapper = document.createElement("div");
            wrapper.className = "content-wrapper";
            wrapper.style.maxHeight = "100px"; // Adjust as needed
            wrapper.style.overflow = "auto";
            wrapper.style.width = "100%"; // Ensure it occupies the full width of the td

            Array.from(td.childNodes).forEach((child) => {
                wrapper.appendChild(child);
            });

            td.appendChild(wrapper);
        }
    });
