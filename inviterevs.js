$(document).ready(function () {
    if (!getContext().includes( "InviteRevs")) { return; }
    var titleTable = $('.main-div >  table#ms_brief_table');
    var titleDiv = $('<div class="msview-title"></div>');
    titleTable.replaceWith(titleDiv);
    titleDiv.append($('<h6 class="badge m-1 text-bg-info"></h6>').html(titleTable.find('tr:first > th').html()));
    titleDiv.append($('<h6 class="badge m-1 text-bg-info"></h6>').html(titleTable.find('tr:first > td:first').html()));
    titleDiv.append($('<h6 class="badge m-1 text-bg-secondary"></h6>').html(titleTable.find('tr:first > td:eq(1)').html()));

    getMSDetails().then(msDetails => {
        //titleDiv.append($('<h6></h6>').html(msDetails["Corresponding Author"]));
        titleDiv.append($('<h6 class="badge m-1 text-bg-secondary"></h6>').html(msDetails["Submission Date"]));
        titleDiv.append($('<h3></h3>').html(msDetails["Title"]));

    }).catch(error => {
        console.error("Failed to get manuscript details:", error);
    });


    var inviteTable = $('.main-div #topf > table.contact_pot_revs_table');
    // Add all descendant elements to inviteTable and iterate over each element
    // Remove attributes that are not relevant#
    inviteTable.removeAttr("border");

    inviteTable.add(inviteTable.find('*:not(select, select *)')).each(function () {
        var $this = $(this);
        var href = $this.is('a') ? $this.attr('href') : null; // Preserve href for <a> elements

        // Remove all attributes from the current element
        $.each(this.attributes, function () {
            $this.removeAttr(this.name);
        });

        // Re-add href attribute for <a> elements after removing all attributes
        if (href !== null) {
            $this.attr('href', href);
        }
    });





    // insert thead
    var firstRow = inviteTable.find('tr:first');
    var thead = $('<thead></thead>').append(firstRow);
    inviteTable.prepend(thead);

    // Responive DataTable from inviteTable
    // Basic DataTables initialization options
    var dataTableOptions = {
        responsive: true
    };

    // Calculate the column count from the first row in the thead of inviteTable
    var columnCount = inviteTable.find('thead tr:first-child th').length;

    // Initialize an empty array for columnDefs
    dataTableOptions.columnDefs = [];

    // Prioritized headers and their target action
    const priorityHeaders = ["E-mail", "Phone Number"];

    // Iterate through each header in the thead of inviteTable to set column definitions
    inviteTable.find('thead tr:first-child th').each(function (index) {
        var thText = $(this).text().trim();
        if (priorityHeaders.includes(thText)) {
            dataTableOptions.columnDefs.push({ className: 'none', targets: index, responsivePriority: 2 });
        } else {
            // Assign a default priority and ensure visibility for other columns
            dataTableOptions.columnDefs.push({ className: 'all', targets: index, responsivePriority: 1 });
        }
    });

    // Adjust the conditional for responsive details for consistency in the example
    if (columnCount > 2) { // Adjust according to your needs
        dataTableOptions.responsive = {
            details: {
                // display: $.fn.dataTable.Responsive.display.childRow
                display: $.fn.dataTable.Responsive.display.modal({
                    header: function (row) {
                        var data = row.data();
                        return data[0];
                    }
                })
            }
        };
    }

    // Initialize DataTables with the configured options on inviteTable
    inviteTable.DataTable(dataTableOptions);
    inviteTable.addClass('stripe display compact row-border');
    removeNbsp($('form#topf'));
    $('form#topf > p:first').replaceWith('');
    $('input[type="submit"]').addClass('btn btn-primary m-2');
    $('select').addClass('form-select form-select-sm');

    var detailsDiv = $('<div class="details-div card m-2 p-2"></div>');
    detailsDiv.prepend($('<h3 class="card-title">Details</h3>'))
    detailsDiv.append($('.main-div  div#content_0 > table'));
    var filesDiv = $('<div class="files-div card m-2 p-2"></div>');
    filesDiv.prepend($('<h3 class="card-title">Files</h3>'))
    filesDiv.append($('.main-div  div#content_1 > ol'));
    var tasksDiv = $('<div class="tasks-div card m-2 p-2"></div>');
    tasksDiv.prepend($('<h3 class="card-title">Tasks</h3>'))
    tasksDiv.append($('.main-div  div#content_2 form#topf'));
    $('.main-div').html('').append(titleDiv).append(tasksDiv).append(filesDiv).append(detailsDiv);
    $('.details-div > table').replaceWith(table_to_div($('.details-div > table')));

});