$(document).ready(function () {
    if (!getContext().includes( "MSView")) {
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

var tasksDiv =  $('<div class="tasks-div card m-2 p-2"></div>');
tasksDiv.prepend($('<h3 class="card-title">Tasks</h3>'))
tasksDiv.append($('.main-div  div#content_2 a'));
var filesDiv =  $('<div class="files-div card m-2 p-2"></div>');
filesDiv.prepend($('<h3 class="card-title">Files</h3>'))
filesDiv.append($('.main-div  div#content_1 > ol'));
var detailsDiv =  $('<div class="details-div card m-2 p-2"></div>');
detailsDiv.prepend($('<h3 class="card-title">Details</h3>'))
detailsDiv.append($('.main-div  div#content_0 > table'));


$('.main-div').html('').append(titleDiv).append(filesDiv).append(detailsDiv);
$('.details-div > table').replaceWith(table_to_div($('.details-div > table')));
});