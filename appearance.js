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

            //TODO: replace this
            const fname = document.getElementById("firstName").value.trim();
            const lname = document.getElementById("lastName").value.trim();
            const email = document.getElementById("email").value.trim();
            const inst = document.getElementById("institution").value.trim();
            // get page parameters
            const form = document.getElementById("nf_assign_rev");
           
            const { formType, jId, msId, msRevNo, msIdKey, ndt, currentStageId, desiredRevCnt } = getPageParams(form);

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
//ADDING BOTTOM BAR IF PAGE IS REV SEARCH
$(document).ready(function () {
    if (document.getElementById("nf_assign_rev")) {
        // The form exists, proceed with adding the mini window/bar
        addMiniWindow();
    } else {
        console.log('Form with id "nf_assign_ref" not found.');
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

