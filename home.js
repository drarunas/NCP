$(document).ready(function () {
    if (!getContext().includes( "Home")) { return; }
    let tasksTable = $(".main-div").find('table').first();

    // Create individual wrapper divs for each collapsible section
    let foldersWrapper = $('<div id="foldersWrapper" class="collapsible-wrapper "></div>');
    let otherTasksWrapper = $('<div id="otherTasksWrapper" class="collapsible-wrapper"></div>');

    // Create high-level divs with collapse classes and append them to their respective wrappers
    let foldersDiv = $('<div class="folders collapse show" id="foldersCollapse"></div>'); // Initially shown
    foldersWrapper.append(foldersDiv);

    let otherTasksDiv = $('<div class="other-tasks collapse" id="otherTasksCollapse"></div>'); // Initially hidden
    otherTasksWrapper.append(otherTasksDiv);

    // Your existing logic to populate foldersDiv and otherTasksDiv
    tasksTable.find('td').each(function () {
        let spans = $(this).find('> span.BODY'); // Find only direct .BODY children spans of the td

        if (spans.length === 1) {
            // Case with one .BODY span
            let div = $('<div class="other-tasks-div"></div>');
            div.append(spans.clone());
            otherTasksDiv.append(div);
        } else if (spans.length === 2) {
            // Case with two .BODY spans
            let div = $('<div class="folder-div"></div>');
            spans.each(function () {
                div.append($(this).clone());
            });
            foldersDiv.append(div);
        }
    });

 // Buttons to trigger collapse, correctly targeting the collapsible content
let foldersButton = $('<button class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#foldersCollapse" aria-expanded="true" aria-controls="foldersCollapse">Folders</button>');
let otherTasksButton = $('<button class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#otherTasksCollapse" aria-expanded="false" aria-controls="otherTasksCollapse">Other Tasks</button>');

    // Insert buttons and wrappers
    tasksTable.before(foldersButton, foldersWrapper, otherTasksButton, otherTasksWrapper);

    // Replace tasksTable with these divs
    tasksTable.remove();
});