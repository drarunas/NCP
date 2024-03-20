$(document).ready(function () {
    if (getContext() != "Folder") { return; }


    var titleTable = $('.main-div table:first');
    var titleText = titleTable.find('tr:first span.TITLE').text();
    var folderHeader = $('<h1></h1>').text(titleText);
    var sortForm = titleTable.find('tr:eq(1)').find('form').first();
    titleTable.replaceWith($('<div class="folder-title"></div>').append(folderHeader).add($('<div class="sort-form"></div>').append(sortForm)));

    var folderTable = $('.main-div .folder_table');
    console.log(folderTable);
    //remove attributes
    folderTable.add(folderTable.find('*')).each(function () {
        var $this = $(this);
        var href = $this.is('a') ? $this.attr('href') : null;
        $.each(this.attributes, function () {
            $this.removeAttr(this.name);
        });
        if (href !== null) {
            $this.attr('href', href);
        }
    });

    // insert thead
    var firstRow = folderTable.find('tr:first');
    var thead = $('<thead></thead>').append(firstRow);
    folderTable.prepend(thead);

    // Remove the first <th> element from the table header
    folderTable.find('thead tr').each(function () {
        $(this).find('th:first').remove();
    });

    // Remove the first <td> element from each row in the table body
    folderTable.find('tbody tr').each(function () {
        $(this).find('td:first').remove();
    });
    // Responive DataTable from folderTable

    // Basic DataTables initialization options
    var dataTableOptions = {
        responsive: true
    };

    // Calculate the column count from the first row in the thead of folderTable
    var columnCount = folderTable.find('thead tr:first-child th').length;

    // Initialize an empty array for columnDefs
    dataTableOptions.columnDefs = [];

    // Prioritized headers and their target action
    const priorityHeaders = ["Circulation Editor", "Potential Reviewer", "Reviewer"];

    // Iterate through each header in the thead of folderTable to set column definitions
    folderTable.find('thead tr:first-child th').each(function (index) {
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
                        return 'Details for ' + data[0] + ' ' + data[1];
                    }
                })
            }
        };
    }

    // Initialize DataTables with the configured options on folderTable
    folderTable.DataTable(dataTableOptions);
    folderTable.addClass('stripe display compact row-border');
    $('.sort-form form').addClass('d-flex flex-wrap align-items-center');
    $('.sort-form form').children().not(':last-child').addClass('me-2');
    $(".sort-form p").children().unwrap();
    $('input[type="button"]').addClass('btn btn-primary');
    $('select').addClass('form-select form-select-sm mb-3');
    $('.sort-form').attr('id', 'collapseForm');
    // Create the toggle button
    var $toggleButton = $('<button/>', {
        text: 'Backend Sort Options', // Button text
        class: 'btn btn-primary', // Bootstrap button classes
        type: 'button',
        'data-bs-toggle': 'collapse',
        'data-bs-target': '#collapseForm',
        'aria-expanded': 'false',
        'aria-controls': 'collapseForm'
    });

    // Insert the toggle button before the .sort-form
    $('.sort-form').before($toggleButton);
    $('#collapseForm').addClass('collapse');




});


