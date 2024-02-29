// Add sticky management script
const host = window.location.host;
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
// Add search bar on top of page
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
    console.log(data);
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

//ADDING BOTTOM BAR IF PAGE IS REV SEARCH
$(document).ready(function () {
    if (document.getElementById("nf_assign_rev")) {
        // The form exists, proceed with adding the mini window/bar
        addMiniWindow();
    } else {
        console.log('Form with id "nf_assign_ref" not found.');
    }
});
//Add reviewer search bar at the bottom
//ADDING BOTTOM BAR IF PAGE IS REV SEARCH
function addMiniWindow() {
    const miniWindowHTML = `
        <div id="miniWindow" style="position: fixed; bottom: 0; left: 0; width: 100%; background-color: #f0f0f0; padding: 10px; box-shadow: 0 -2px 5px rgba(0,0,0,0.2); display: flex; justify-content: center; gap: 10px;">
            <input type="text" id="firstName" placeholder="First Name">
            <input type="text" id="lastName" placeholder="Last Name">
            <input type="email" id="email" placeholder="Email">
            <input type="text" id="institution" placeholder="Institution">
            <button id="searchButton">Search</button>
            <button id="reviewerFinder">🔎 Reviewer Finder</button>
        </div>
    `;
    document.body.insertAdjacentHTML("beforeend", miniWindowHTML);
    document
        .getElementById("searchButton")
        .addEventListener("click", function () {
            const fname = document.getElementById("firstName").value.trim();
            const lname = document.getElementById("lastName").value.trim();
            const email = document.getElementById("email").value.trim();
            const inst = document.getElementById("institution").value.trim();
            // get page parameters
            const form = document.getElementById("nf_assign_rev");
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
            eJPPersonSearch(
                fname,
                lname,
                email,
                inst,
                jId,
                msId,
                msRevNo,
                msIdKey,
                currentStageId,
                desiredRevCnt
            )
                .then((data) => {
                    if (data) {
                        console.log("Extracted Data:", data);
                        // Do something with the data
                    } else {
                        console.log("No data extracted.");
                    }
                })
                .catch((error) => {
                    console.error("Error in eJPPersonSearch:", error);
                });
        });
    document
        .getElementById("reviewerFinder")
        .addEventListener("click", initiateRevFinding);
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

// assign reviewer on MS, if eJP revID is known
//function assignReviewer(
//    reviewerId,
//    jId,
//    msId,
//    msRevNo,
//    msIdKey,
//    currentStageId
//) {
//    // Assuming these additional values are also needed and obtained earlier
//    const requestBody = `form_type=assign_rev_tab_view_store&j_id=${encodeURIComponent(
//        jId
//    )}&ms_id=${encodeURIComponent(msId)}&ms_rev_no=${encodeURIComponent(
//        msRevNo
//    )}&ms_id_key=${encodeURIComponent(
//        msIdKey
//    )}&current_stage_id=${encodeURIComponent(
//        currentStageId
//    )}&reviewer=${encodeURIComponent(reviewerId)}&action=Assign`;
//
//    fetch("https://mts-ncomms.nature.com/cgi-bin/main.plex", {
//        method: "POST",
//        headers: {
//            accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
//            "accept-language": "en-US,en;q=0.9",
//            "cache-control": "max-age=0",
//            "content-type": "application/x-www-form-urlencoded"
//            // Include other necessary headers
//        },
//        referrer: "https://mts-ncomms.nature.com/cgi-bin/main.plex",
//        referrerPolicy: "strict-origin-when-cross-origin",
//        body: requestBody,
//        mode: "cors",
//        credentials: "include"
//    })
//        .then((response) => {
//            if (response.ok) {
//                console.log("Assignment of existing successful:");
//                return response.text(); // Or response.json() if the response is JSON.
//            }
//            throw new Error("Network response was not ok.");
//        })
//        .then((data) => {
//            console.log("Assignment successful:", data);
//            // Handle successful assignment here
//        })
//        .catch((error) => {
//            console.error("Error during assignment:", error);
//        });
//}
//
async function assignReviewer(
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

    try {
        const response = await fetch(
            "https://mts-ncomms.nature.com/cgi-bin/main.plex",
            {
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
            }
        );

        if (!response.ok) {
            throw new Error("Network response was not ok.");
        }

        const data = await response.text(); // Or response.json() if the response is JSON.
        console.log("Assignment successful");
        // Handle successful assignment here
    } catch (error) {
        console.error("Error during assignment:", error);
    }
}

// when RF button clicked -> reviewerFinderPopup reviewerFinder
function initiateRevFinding() {
    // Generate a random number between 0 and 999
    const randomNumber = Math.floor(Math.random() * 1000);

    // Format the number to be three digits (e.g., 005, 034, 500)
    const formattedNumber = randomNumber.toString().padStart(3, '0');

    // Append or prepend the random number to the current page title
    document.title = `${formattedNumber} Importing Reviewers`;
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
    reviewerFinder(
        findDataByText("Title"),
        authors,
        findDataByText("Abstract"),
        formattedNumber

    );
    reviewerFinderPopup();
}

// Construct a reviewer list popup after clicking Rev Finder button
function reviewerFinderPopup() {

    // Create the popup container
    const popup = document.createElement("div");
    popup.className = "reviewerFinderPopup";

    const form = document.getElementById("nf_assign_rev");

    // get page parameters
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
    title.textContent = "📖 From Reviewer Finder";
    title.className = "popupTitle"; // Assign class for potential styling
    title.style.marginRight = "auto"; // Pushes everything else to the right

    // Create the scrollable list
    const list = document.createElement("ul");
    list.className = "popupList"; // Assign a class for easy reference

    const assignButton = document.createElement("button");
    assignButton.textContent = "Assign Selected";
    assignButton.className = "popupCloseButton";
    assignButton.onclick = function () {
        // 1. Create and insert the spinner
        const spinner = document.createElement("div");
        spinner.className = "spinner"; // Use the CSS class for the spinner
        assignButton.parentNode.replaceChild(spinner, assignButton);
        list.style.opacity = "0.5";
        list.style.backgroundColor = "#f0f0f0"; // Light gray background

        const checkboxes = document.querySelectorAll(
            '.popupList input[type="checkbox"]:checked'
        );
        const operationPromises = [];

        checkboxes.forEach((checkbox) => {
            if (checkbox.getAttribute("data-status") === "existing") {
                // Existing reviewer assignment
                const reviewerId = checkbox.value;

                operationPromises.push(
                    assignReviewer(
                        reviewerId,
                        jId,
                        msId,
                        msRevNo,
                        msIdKey,
                        currentStageId
                    )
                );
            } else if (checkbox.getAttribute("data-status") === "new") {
                // New reviewer form submission
                const firstName = checkbox.getAttribute("data-fname");
                const lastName = checkbox.getAttribute("data-lname");
                const email = checkbox.getAttribute("data-email");
                const inst = checkbox.getAttribute("data-inst");

                operationPromises.push(
                    submitFormAssign(firstName, lastName, email, inst)
                );
            }
        });

        Promise.all(operationPromises)
            .then(() => {
                console.log("All reviewers have been successfully assigned.");
                document.body.removeChild(popup); // Removes the popup from the body

                // Redirect to the constructed URL
                window.location.href = `https://mts-ncomms.nature.com/cgi-bin/main.plex?form_type=${formType}&j_id=${jId}&ms_id=${msId}&ms_rev_no=${msRevNo}&ms_id_key=${msIdKey}&current_stage_id=${currentStageId}&show_tab=CurrentList&redirected=1&desired_rev_cnt=${desiredRevCnt}`;
            })
            .catch((error) => {
                console.error(
                    "An error occurred during the assignments:",
                    error
                );
            });
    };

    // Append title and close button to the header
    header.appendChild(title);
    header.appendChild(assignButton);

    // Append header and list to the popup
    popup.appendChild(header);
    popup.appendChild(list);

    // Append the popup to the body
    document.body.appendChild(popup);
}

// Function to add reviewer details to the popup list but not eJP revs
async function populatePopupList(fullName, lastName, email, inst) {
    const list = document.querySelector(".popupList");
    if (!list) {
        console.error("Popup list not found.");
        return;
    }
    // Define resultsList at a scope accessible throughout the function
    let resultsList = document.createElement("ul");
    resultsList.classList.add("eJPResults");
    email = email.toLowerCase();
    const { firstName, middleInitial } = separateNameAndInitial(fullName);
    console.log(firstName, middleInitial, lastName);

    const item = document.createElement("li");

    // Create a checkbox and prepend it to the list item
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    // Optionally, you can assign a value to the checkbox for identification
    // For example, using email or a combination of firstName and lastName
    checkbox.value = email;
    checkbox.setAttribute("data-status", "new");

    item.appendChild(checkbox);

    // Create a span for the text content
    const firstLine = document.createElement("span");
    //firstLine.textContent = `📒${firstName}, ${middleInitial},  ${lastName}, 📧${email}, ${inst}`;
    const middleInitialPart = middleInitial ? ` ${middleInitial}` : "";
    firstLine.textContent = `📒${firstName}${middleInitialPart} ${lastName}, 📧${email}, ${inst}`;

    checkbox.setAttribute("data-fname", firstName);
    checkbox.setAttribute("data-lname", lastName);
    checkbox.setAttribute("data-email", email);
    checkbox.setAttribute("data-inst", inst);
    // Append the text span after the checkbox
    item.appendChild(firstLine);

    // Append the completed list item to the list
    list.appendChild(item);

    // Create a second line container for the spinner and results
    const secondLine = document.createElement("div");
    item.appendChild(secondLine);

    // Add spinner to the second line
    const spinner = document.createElement("div");
    spinner.className = "spinner"; // Ensure you have CSS for this spinner
    secondLine.appendChild(spinner);

    try {
        const form = document.getElementById("nf_assign_rev");

        // get page parameters
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

        const searchData = await eJPPersonSearch(
            firstName,
            lastName,
            "",
            "",
            jId,
            msId,
            msRevNo,
            msIdKey,
            currentStageId,
            desiredRevCnt
        );

        // Append search data result to the second line
        if (!searchData || searchData.length === 0) {
            // Handle null or empty searchData
            secondLine.textContent = "❌ Not on eJP";
        } else {
            // Convert forEach loop to for...of to handle async operations
            for (const dataItem of searchData) {
                const resultItem = document.createElement("li");
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.value = dataItem.authId;
                checkbox.setAttribute("data-status", "existing");
                resultItem.appendChild(checkbox);

                const nameLink = document.createElement("a");
                nameLink.href = dataItem.nameHref;
                nameLink.textContent = `🦉${dataItem.name}`;
                nameLink.target = "_blank";

                const detailsSpan = document.createElement("span");
                detailsSpan.appendChild(nameLink);

                // Append other details to detailsSpan
                detailsSpan.appendChild(
                    document.createTextNode(
                        `, 🆔${dataItem.authId}, 🏢${dataItem.organization}`
                    )
                );

                // Conditionally append additional details
                if (dataItem.pending) {
                    detailsSpan.appendChild(
                        document.createTextNode(
                            `,❗ Pending: ${dataItem.pending}`
                        )
                    );
                }
                if (dataItem.averageDuration) {
                    detailsSpan.appendChild(
                        document.createTextNode(
                            `, 🕓 ${dataItem.averageDuration}`
                        )
                    );
                }
                if (dataItem.conflicts) {
                    detailsSpan.appendChild(
                        document.createTextNode(`,❗${dataItem.conflicts}`)
                    );
                }

                // Fetch email and append it
                try {
                    const fetchedEmail = await eJPGetEmail(dataItem.nameHref); // Fetch the email
                    if (fetchedEmail) {
                        let emailContent;

                        emailContent = document.createTextNode(
                            `, 📧 ${fetchedEmail}`
                        );

                        detailsSpan.appendChild(emailContent);
                    }
                } catch (error) {
                    console.error(
                        "Error fetching email for:",
                        dataItem.name,
                        error
                    );
                    // Optionally handle the error, e.g., by showing a default message
                }

                resultItem.appendChild(detailsSpan);
                resultsList.appendChild(resultItem);
            }

            secondLine.appendChild(resultsList);
        }
    } catch (error) {
        // Remove spinner and show error message if the search fails
        spinner.remove();
        const errorMsg = document.createElement("div");
        errorMsg.textContent = "Failed to load data";
        secondLine.appendChild(errorMsg);
        console.error("Error during eJPPersonSearch:", error);
    } finally {
        // Before removing the spinner, reorder the <li> elements if their emails match the primary email
        const lis = resultsList.querySelectorAll("li");
        lis.forEach((li) => {
            // Assuming you have a way to identify the email within the <li>, e.g., a data attribute or contained within a specific element
            const emailSpan = li.querySelector("span"); // Adjust selector as needed to target where the email is

            if (emailSpan && emailSpan.textContent.includes(`📧 ${email}`)) {
                // If the email in the <li> matches the primary email, move this <li> to the top of the <ul>
                li.classList.add("matchingLi");
                resultsList.insertBefore(li, resultsList.firstChild);
                // Select the checkbox corresponding to this <li>
                const checkbox = li.querySelector('input[type="checkbox"]');
                if (checkbox) {
                    checkbox.checked = true;
                }
            }

            const checkbox = li.querySelector('input[type="checkbox"]');

            // Check if "Already Assigned" is mentioned in the li
            if (li.textContent.includes("Already Assigned")) {
                if (checkbox) {
                    checkbox.checked = false; // Uncheck
                    checkbox.disabled = true; // Disable
                }
            }
        });

        spinner.remove(); // Ensure the spinner is removed after reordering
    }
}

// Send a message to open a new RF tab
function reviewerFinder(title, authors, abstract, MTSid) {
    chrome.runtime.sendMessage({
        action: "openReviewerFinder",
        data: { title, authors, abstract, MTSid }
    });
}

// Listen to bg message with rev details
// Currently immediately assigns on eJP using  submitFormAssign
// v2 Change this to add to potential rev list, to popup, and wait for further processing before assigning on eJP
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "reviewerDetails") {
        const { firstName, lastName, inst, email, uniqueId } = message.data;
        const senderTabId = message.senderTabId;
        console.log("received in mts", message.data);
        //submitFormAssign(firstName, lastName, email, uniqueId, senderTabId); --remove eventually
        //1 add incoming rev to popup
        populatePopupList(firstName, lastName, email, inst);
        chrome.runtime.sendMessage({
            action: "reviewerAssignmentComplete",
            status: "success",
            uniqueId: uniqueId, // Include the uniqueId in the response
            tabId: senderTabId // Include the sender tab ID if not already tracked
        });
        //2 run eJPPersonSearch with the incoming rev details
    }
});

// Submits the forms via POST that actually assign revs on eJP
async function submitFormAssign(firstName, lastName, email, inst) {
    const form = document.getElementById("nf_assign_rev");

    // Function to get form values
    const getValueByName = (name) => {
        const element = form.querySelector(`[name="${name}"]`);
        return element ? element.value : null;
    };

    // Extracting form values
    const formType = getValueByName("form_type");
    const jId = getValueByName("j_id");
    const msId = getValueByName("ms_id");
    const msRevNo = getValueByName("ms_rev_no");
    const msIdKey = getValueByName("ms_id_key");
    const ndt = getValueByName("ndt");
    const currentStageId = getValueByName("current_stage_id");
    const desiredRevCnt = getValueByName("desired_rev_cnt");

    // Constructing the request body
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
    )}&org=${encodeURIComponent(inst)}&desired_rev_cnt=${encodeURIComponent(
        desiredRevCnt
    )}&email=${encodeURIComponent(email)}&action=Add+Person+Check`;

    try {
        console.log("assigning new");
        const response = await fetch(
            "https://mts-ncomms.nature.com/cgi-bin/main.plex",
            {
                method: "POST",
                headers: {
                    accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                    "accept-language": "en-US,en;q=0.9",
                    "cache-control": "max-age=0",
                    "content-type": "application/x-www-form-urlencoded"
                },
                referrer: "https://mts-ncomms.nature.com/cgi-bin/main.plex",
                referrerPolicy: "strict-origin-when-cross-origin",
                body: requestBody,
                mode: "cors",
                credentials: "include"
            }
        );

        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        // Check for the existence of a span with class "MSG"
        const msgSpan = doc.querySelector("span.MSG");
        const tableExists =
            doc.querySelector("#artv_search_results_tbl") !== null;

        if (
            msgSpan &&
            msgSpan.textContent.includes("Possible matching accounts found") &&
            tableExists
        ) {
            const inputRadio = doc.querySelector(
                'input[type="radio"][name="reviewer"]'
            );
            if (inputRadio) {
                const reviewerId = inputRadio.value;
                console.log("Reviewer ID:", reviewerId);

                // Call assignReviewer with all necessary parameters
                await assignReviewer(
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
            // Handle cases without matching accounts or redirection
            // [Your existing logic for handling these cases]
        }
    } catch (error) {
        console.error("Error in fetch operation:", error);
    }
}

// Filter circulation editor list to human team only
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
// Filter common letter types in a decision page dropdown
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
// Add divs to folder table cells to manage overflow and scrolls
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

function separateNameAndInitial(fullName) {
    const parts = fullName.trim().split(" ");
    console.log(parts);
    let firstName = fullName;
    let middleInitial = "";

    // Check if there's a potential middle initial or name part
    if (parts.length > 1) {
        firstName = parts.slice(0, -1).join(" "); // Everything except the last part
        console.log(firstName);
        middleInitial = parts[parts.length - 1]; // The last part

        // Optional: Check if the last part is likely a middle initial
        if (!middleInitial.includes(".")) {
            console.log("Not an Initial");
            // If the last part is longer than 1 character (not counting the period),
            // or doesn't include a period, it might not be a middle initial.
            // Adjust logic here based on your needs.
            firstName = fullName; // Reset firstName to the full original string
            middleInitial = ""; // Assume no middle initial
        }
    }

    return { firstName, middleInitial };
}

// search person on eJP by fname lname email inst

async function eJPPersonSearch(
    fname,
    lname,
    email,
    inst,
    jId,
    msId,
    msRevNo,
    msIdKey,
    currentStageId,
    desiredRevCnt
) {
    const requestBody = `form_type=assign_rev_tab_view_store&j_id=${encodeURIComponent(
        jId
    )}&ms_id=${encodeURIComponent(msId)}&ms_rev_no=${encodeURIComponent(
        msRevNo
    )}&ms_id_key=${encodeURIComponent(
        msIdKey
    )}&current_stage_id=${encodeURIComponent(
        currentStageId
    )}&input_fname=${encodeURIComponent(
        fname
    )}&input_lname=${encodeURIComponent(
        lname
    )}&input_email=${encodeURIComponent(email)}&input_org=${encodeURIComponent(
        inst
    )}&desired_rev_cnt=${encodeURIComponent(desiredRevCnt)}&action=Search`;

    try {
        const response = await fetch(
            "https://mts-ncomms.nature.com/cgi-bin/main.plex",
            {
                method: "POST",
                headers: {
                    accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                    "accept-language": "en-US,en;q=0.9",
                    "cache-control": "max-age=0",
                    "content-type": "application/x-www-form-urlencoded"
                },
                body: requestBody,
                referrer: "https://mts-ncomms.nature.com/cgi-bin/main.plex",
                referrerPolicy: "strict-origin-when-cross-origin",
                mode: "cors",
                credentials: "include"
            }
        );

        if (!response.ok) {
            throw new Error("Network response was not ok.");
        }

        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const table = doc.querySelector("#artv_search_results_tbl");

        // Check if the table exists
        if (!table) {
            console.log("Table #artv_search_results_tbl not found.");
            return null; // Or return []; if you prefer an empty array
        }

        const rows = table.querySelectorAll("tbody > tr");

        const extractedData = Array.from(rows).map((row) => {
            const cells = row.querySelectorAll("td");
            const nameLink = cells[1].querySelector("a"); // First <a> tag in the name cell
            const organizationCell = cells[2];

            // Extract auth_id from the href attribute of the name link
            const authIdMatch = nameLink.href.match(/auth_id=(\d+)/);
            const authId = authIdMatch ? authIdMatch[1] : null;

            return {
                name: nameLink.innerText.trim(), // Use the text from the first <a> tag as the name
                authId: authId,
                organization: organizationCell.innerText.trim(),
                //assigned: cells[3].innerText.trim(),
                //invited: cells[4].innerText.trim(),
                pending: cells[5].innerText.trim(),
                //completed: cells[6].innerText.trim(),
                averageDuration: cells[7].innerText.trim(),
                //averageRanking: cells[8].innerText.trim(),
                conflicts: cells[9].innerText.trim(),
                //notes: cells[10].innerText.trim()
                nameHref: nameLink.href
            };
        });

        return extractedData; // Return the data for subsequent processing
    } catch (error) {
        console.error("Error during fetch operation:", error);
        return null; // Or return []; if you prefer an empty array
    }
}

async function eJPGetEmail(nameHref) {
    try {
        const response = await fetch(nameHref);
        if (!response.ok) throw new Error("Failed to fetch page");

        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const mailtoLink = doc.querySelector('a[href^="mailto:"]');

        if (mailtoLink) {
            const email = mailtoLink
                .getAttribute("href")
                .replace("mailto:", "");
            return email;
        }
        return null; // Return null if no email found
    } catch (error) {
        console.error("Error opening page or parsing email:", error);
        return null; // Return null in case of error
    }
}
