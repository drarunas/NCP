const host = window.location.host;
console.log(host);

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

$(document).ready(function () {
    // Identify the table by finding a span with class "TITLE" that contains specific text
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
});

if (host.includes("mts-ncomms.nature.com")) {
    // SEARCH BOX ON TOP OF PAGE

    document.body.insertAdjacentHTML(
        "afterbegin",
        `
<div id="myExtensionSearchBox">
<button id="homeBtn" title="Home">🏠</button>
  <input type="text" id="searchInput" placeholder="Last Name or MS#">
    <!-- Spinner element -->
  <div id="spinner" class="spinner" style="display: none;"></div>
  <button id="searchBtn">Search</button>
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
            <input type="text" id="firstName" placeholder="First Name">
            <input type="text" id="lastName" placeholder="Last Name">
            <input type="email" id="email" placeholder="Email">
            <button id="addButton">Add</button>
            <button id="reviewerFinder">Reviewer Finder</button>
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
    title.textContent = "From Reviewer Finder";
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
        item.textContent = `Name: ${lastName}, ${firstName}, Email: ${email}, ${comment}`;
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
        const { firstName, lastName, email } = message.data;
        console.log("received in mts", message.data);
        submitFormAssign(firstName, lastName, email);
    }
});

function submitFormAssign(firstName, lastName, email) {
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
