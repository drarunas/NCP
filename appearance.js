// #1 Add main content into .main-div, hide .main-table with remaining scripts
// This is the first step for all appearance modifiers
// After this run getContext and modify pages individually base don context
//
$(document).ready(function() {
    $('body').hide(); // Hide the body element

    $('body > table:first').remove(); // Remove the first table child of the body

    $('body > table:first').addClass('main-table'); // Add class "main-table" to the second table child of the body

    $('body > table:eq(1)').remove(); // Remove the third table child of the body

    // Select the second tr's second td in the tbody of the main-table
    var content = $('.main-table tbody tr:eq(1) td:eq(1)').contents().filter(function() {
        return this.nodeType !== 1 || this.tagName.toLowerCase() !== 'script'; // Exclude inline scripts
    });

    // Create a div with class "main-div" and add the content to it, excluding any scripts
    var mainDiv = $('<div class="main-div"></div>').append(content);

    // Append mainDiv to the body
    $('body').prepend(mainDiv);

    // Move the main-table to the end of the page and hide it
    $('.main-table').appendTo('body').hide();

    $('body').show(); // Make the body visible again

    console.log(getContext());
});




// Add sticky management script
const host = window.location.host;
const scriptElement = document.createElement("script");
scriptElement.src = chrome.runtime.getURL("setcolor.js");
scriptElement.onload = function () {
    this.remove(); // Clean up after injection
};
(document.head || document.documentElement).appendChild(scriptElement);
//change fav icon
(function () {
    const emoji = '🌸'; // The emoji you want to use
    const canvas = document.createElement('canvas');
    canvas.width = 64; // Size of the favicon
    canvas.height = 64; // Make sure it's square
    const ctx = canvas.getContext('2d');
    // ctx.fillStyle = 'white'; // Skip this to keep the background transparent
    // ctx.fillRect(0, 0, canvas.width, canvas.height); // And skip this as well
    ctx.font = '56px serif'; // Adjust font size as needed
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, canvas.width / 2, canvas.height / 2);

    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = canvas.toDataURL('image/png'); // Converts the canvas to a data URL
    document.getElementsByTagName('head')[0].appendChild(link);
})();



// REMOVING DEFAULT CSS
$(document).ready(function () {
    if (host.includes("mts-ncomms.nature.com")) {
        //console.log("removing css");
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

        document.querySelectorAll('link[href="https://mts-ncomms.nature.com/html/tv.css?1550611960"]').forEach(link => {
            link.parentNode.removeChild(link);
        });



    }
});

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




//Replace folder tables with datatables

// Add search bar on top of page
function addTopBar() {

    // SEARCH BOX ON TOP OF PAGE
    if (host.includes("mts-ncomms.nature.com")) {
        //console.log("Adding top bar");
        // SEARCH BOX ON TOP OF PAGE


        document.body.insertAdjacentHTML(
            "afterbegin",
            `
<div id="myExtensionSearchBox">
  <button id="homeBtn" class="topButtons" data-toggle="tooltip" data-placement="bottom" title="Home">🏠</button>
  <button id="initialAssessmentBtn" class="topButtons" data-toggle="tooltip" data-placement="bottom" title="Initial assessment">📃</button>
  <button id="inboxBtn" class="topButtons" data-toggle="tooltip" data-placement="bottom" title="Circulations">🕓</button>
  <button id="decisionsBtn" class="topButtons" data-toggle="tooltip" data-placement="bottom" title="Decisions">✔️</button>
  <button id="allBtn" class="topButtons" data-toggle="tooltip" data-placement="bottom" title="All">📁</button>
  <input type="text" id="searchInput" placeholder="🐳 Last Name or MS#" class="form-control">
  <div id="spinner" class="spinner" style="display: none;"></div>
  <button id="searchBtn" class="topBtn btn btn-primary">🍁Search</button>
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
}


// MOVE THIS TO REVIEWER FINDING CONTEXT v2
$(document).ready(function () {
    // Check if the specific element exists
    if ($("#nf_assign_rev").length > 0) {
        console.log("Rev Finder button");
        // HTML for the Reviewer Finder button
        var reviewerFinderButtonHTML = '<button id="reviewerFinderBtn" class="topBtn btn btn-primary" title="Reviewer Finder">🔎 Reviewer Finder</button>';

        // Append the Reviewer Finder button to the existing top bar
        $("#myExtensionSearchBox").append(reviewerFinderButtonHTML);
        // Blink the button 5 times
        blinkButton("#reviewerFinderBtn", 3);

        // Add click event listener for the Reviewer Finder button
        $("#reviewerFinderBtn").click(function () {
            initiateRevFinding();
        });
    }
});




// Filter common letter types in a decision page dropdown
$(document).ready(function () {
    const selectElement = document.querySelector('select[name="template"]');

    // Stop if the select element does not exist
    if (!selectElement) {
        //console.log('Select element with name="template" not found.');
        return;
    }

    const optionExists = Array.from(selectElement.options).some((option) =>
        option.text.includes("AIP - Comments")
    );

    // Optionally, also stop if the specific option does not exist
    if (!optionExists) {
        //console.log("Specific option not found in the select element.");
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
// $(document).ready(function () {
//     // Attempt to find the select element by its name
//     const selectElement = document.getElementsByName("editor_list")[0];

//     if (selectElement) {
//         //console.log("Shortening editor list");
//         // The select element exists, proceed with the rest of the operations

//         // Create a checkbox
//         const checkbox = document.createElement("input");
//         checkbox.setAttribute("type", "checkbox");
//         checkbox.setAttribute("id", "filterCheckbox");
//         checkbox.checked = true;

//         // Create a label for the checkbox
//         const label = document.createElement("label");
//         label.setAttribute("for", "filterCheckbox");
//         label.textContent = "Show human team only";

//         // Insert the checkbox and label before the select element
//         selectElement.parentNode.insertBefore(
//             checkbox,
//             selectElement.nextSibling
//         );
//         selectElement.parentNode.insertBefore(label, checkbox.nextSibling);

//         // Filter Select Options based on Checkbox
//         checkbox.addEventListener("change", function () {
//             const options = selectElement.options;
//             const filterNames = [
//                 "Myrthel",
//                 "Brittany Car",
//                 "Yann",
//                 "Arunas",
//                 "Nicole"
//             ];

//             for (let i = 0; i < options.length; i++) {
//                 const option = options[i];
//                 // If checkbox is checked, show only the options that match the filterNames
//                 if (this.checked) {
//                     if (
//                         filterNames.some((name) => option.text.includes(name))
//                     ) {
//                         option.style.display = ""; // Show option
//                     } else {
//                         option.style.display = "none"; // Hide option
//                     }
//                 } else {
//                     option.style.display = ""; // Show all options when checkbox is unchecked
//                 }
//             }
//         });
//         // Trigger the change event to apply filter on page load
//         checkbox.dispatchEvent(new Event("change"));
//     } else {
//         // The select element does not exist, handle accordingly
//         // console.log(
//         //     'Select element named "editor_list" was not found on the page.'
//         // );
//     }
// });

addTopBar();