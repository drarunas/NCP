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

// assign reviewer on eJP based on ID and page params
async function assignReviewer(reviewerId, jId, msId, msRevNo, msIdKey, currentStageId) {
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
        const response = await fetchNatureData(requestBody);
        if (!response.ok) {
            throw new Error("Network response was not ok.");
        }
        const data = await response.text(); // Or response.json() if the response is JSON.
        console.log("Assignment successful");
    } catch (error) {
        console.error("Error during assignment:", error);
    }
}

// when RF button clicked -> reviewerFinderPopup reviewerFinder
function initiateRevFinding() {
    const randomNumber = Math.floor(Math.random() * 1000);
    const formattedNumber = randomNumber.toString().padStart(3, '0');
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
        const spinner = createSpinner();
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
async function addToShortList(fullName, lastName, email, inst) {
    const list = document.querySelector(".popupList");
    if (!list) {
        console.error("Popup list not found.");
        return;
    }
    let resultsList = document.createElement("ul");
    resultsList.classList.add("eJPResults");
    email = email.toLowerCase();
    const { firstName, middleInitials } = separateNameAndInitial(fullName);
    console.log(firstName);
    console.log(middleInitials);

    // list item for a record added from RF:
    const item = document.createElement("li");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = email;
    checkbox.classList.add("shortlistcheck");

    checkbox.setAttribute("data-status", "new");
    item.appendChild(checkbox);

    // Create a span for the text content
    const firstLine = document.createElement("span");
    //firstLine.textContent = `📒${firstName}, ${middleInitial},  ${lastName}, 📧${email}, ${inst}`;
    const middleInitialPart = middleInitials ? ` ${middleInitials}` : "";
    firstLine.textContent = `📒${firstName}${middleInitialPart} ${lastName}, 📧${email}, ${inst}`;

    checkbox.setAttribute("data-fname", firstName);
    checkbox.setAttribute("data-lname", lastName);
    checkbox.setAttribute("data-email", email);
    checkbox.setAttribute("data-inst", inst);
    item.appendChild(firstLine);
    list.appendChild(item);

    // Create a second line container for the eJP search results using the above li
    const secondLine = document.createElement("div");
    item.appendChild(secondLine);

    // Add spinner to the second line
    const spinner = createSpinner();
    
    secondLine.appendChild(spinner);

    try {
        const form = document.getElementById("nf_assign_rev");
        const { formType, jId, msId, msRevNo, msIdKey, ndt, currentStageId, desiredRevCnt } = getPageParams(form);
        //search eJP based on name
        const searchData = await eJPPersonSearch(firstName, lastName, "", "", jId,
            msId, msRevNo, msIdKey, currentStageId, desiredRevCnt);
        const searchDataByEmail = await eJPPersonSearch("", "", email, "", jId,
            msId, msRevNo, msIdKey, currentStageId, desiredRevCnt);
        // Append search data result to the second line

        if ((!searchData || searchData.length === 0) && (!searchDataByEmail || searchDataByEmail.length === 0)) {
            secondLine.textContent = "❌ Not on eJP";
            checkbox.checked = true;
        }
        else {

            if (!searchDataByEmail || searchDataByEmail.length === 0) {
                const emailnotfoundtext = document.createElement("li");
                emailnotfoundtext.textContent = "❌ Email not on eJP";
                resultsList.appendChild(emailnotfoundtext);
                checkbox.checked = true;
            }

            // Combine the two arrays
            const combinedData = searchData.concat(searchDataByEmail);

            // Filter duplicates based on authId
            const uniqueCombinedData = Array.from(new Map(combinedData.map(item => [item['authId'], item])).values());

            // Convert forEach loop to for...of to handle async operations
            for (const dataItem of uniqueCombinedData) {
                const resultItem = document.createElement("li");
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.value = dataItem.authId;
                checkbox.classList.add("shortlistcheck");

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

// Listen to bg message with rev details, add them to shortlist in popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "reviewerDetails") {
        const { firstName, lastName, inst, email, uniqueId } = message.data;
        const senderTabId = message.senderTabId;
        console.log("received in mts", message.data);
        addToShortList(firstName, lastName, email, inst);
        chrome.runtime.sendMessage({
            action: "reviewerAssignmentComplete",
            status: "success",
            uniqueId: uniqueId, // Include the uniqueId in the response
            tabId: senderTabId // Include the sender tab ID if not already tracked
        });
    }
});

// Submits the forms via POST that actually assign revs on eJP
async function submitFormAssign(firstName, lastName, email, inst) {
    const form = document.getElementById("nf_assign_rev");

    const { formType, jId, msId, msRevNo, msIdKey, ndt, currentStageId, desiredRevCnt } = getPageParams(form);

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
        const response = await fetchNatureData(requestBody);

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