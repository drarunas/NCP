$(document).ready(function () {
    if (!getContext().includes("Notes")) {
        return
    }

    var titleTable = $('.main-div > table#ms_brief_table');
    var titleDiv = $('<div class="msview-title"></div>');
    titleTable.replaceWith(titleDiv);
    titleDiv.append($('<h6 class="badge m-1 text-bg-info"></h6>').html(titleTable.find('tr:first > th').html()));
    titleDiv.append($('<h6 class="badge m-1 text-bg-info"></h6>').html(titleTable.find('tr:first > td:first').html()));
    titleDiv.append($('<h6 class="badge m-1 text-bg-secondary"></h6>').html(titleTable.find('tr:first > td:eq(1)').html()));

    getMSDetails().then(msDetails => {
        titleDiv.append($('<h6 class="badge m-1 text-bg-secondary"></h6>').html(msDetails["Submission Date"]));
        titleDiv.append($('<div class="card p-2 text-bg-primary h2"></div>').html(msDetails["Title"]));
    }).catch(error => {
        console.error("Failed to get manuscript details:", error);
    });
    
});