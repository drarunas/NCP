$(document).ready(function () {
    if (getContext() != "AddRevs") { return; }
    console.log('addrevs');
    var titleTable = $('.main-div > form > table#ms_brief_table');
    var titleDiv = $('<div class="msview-title"></div>');
    titleDiv.append($('<h6></h6>').html(titleTable.find('tr:first > th').html()));
    titleDiv.append($('<h6></h6>').html(titleTable.find('tr:first > td:first').html()));
    titleDiv.append($('<h6></h6>').html(titleTable.find('tr:first > td:eq(1)').html()));
    titleDiv.append($('<h3></h3>').html(titleTable.find('tr:first > td:eq(2)').html()));
    titleTable.replaceWith(titleDiv);

    
    $('input[type="submit"]').addClass('btn btn-primary mb-3');
    $('input[type="button"]').addClass('btn btn-primary mb-3');
    $('select').addClass('form-select form-select-sm mb-3');
    $('input[type="text"].not#searchInput').addClass('form-control mb-3');

    var contentDivs = $(".main-div > form > table.tabPage div.tabPage");
    console.log(contentDivs);
    var tabDiv = $('<div class="tab-div"></div>');
    $(contentDivs).each(function () {
        $(this).removeAttr('style');
        tabDiv.append($(this));
        $(this).addClass('card m-2 p-2');
    });
    $(".main-div > form > table.tabPage").replaceWith(tabDiv);

    $(window).on('load', function () {
        $(contentDivs).each(function () {
            $(this).removeAttr('style');
        });
        
    });
    $('.main-div > form > .tab-div > div > br').replaceWith('');
  
    // Reviewer Search Tab Page
    var contentDivSearch = $(".main-div > form > .tab-div > div#content_0");

    var searchDiv = $('<div class="rev-search-div card m-2 p-2"></div>').appendTo('body');
    contentDivSearch.replaceWith(searchDiv);
    searchDiv.append($('<h3 class="card-title">Search on eJP</h3>'));



    // Function to append input with title using Bootstrap 5 classes
    function appendInputWithTitle(title, attributes) {
        var $formGroup = $('<div class="mb-3 row"></div>'); // Use Bootstrap's margin bottom class and row
        var $title = $('<label class="col-sm-2 col-form-label">').text(title);
        var $inputDiv = $('<div class="col-sm-10"></div>');
        var $input = $('<input>', attributes).addClass('form-control'); // Ensure form-control class is added for Bootstrap styling

        $inputDiv.append($input);
        $formGroup.append($title, $inputDiv);
        searchDiv.append($formGroup);
    }

    // Hard code each input with original attributes and titles, using Bootstrap styling
    appendInputWithTitle('First Name:', {
        type: 'text',
        id: 'input_fname',
        name: 'input_fname',
    });

    appendInputWithTitle('Last Name:', {
        type: 'text',
        id: 'input_lname',
        name: 'input_lname',
    });

    appendInputWithTitle('ORCID ID:', {
        type: 'text',
        id: 'input_orcid_id',
        name: 'input_orcid_id',
    });
    appendInputWithTitle('Email:', {
        type: 'text',
        id: 'input_email',
        name: 'input_email',
    });

    var $btnGroup = $('<div class="mt-3"></div>'); // Use Bootstrap's margin top class for spacing
    $('<input>', {
        type: 'submit',
        value: 'Search',
        name: 'search_btn',
        class: 'btn btn-primary me-2', // Bootstrap's margin end class for spacing between buttons
        onclick: 'javascript:arnfCheckSearch();',
    }).appendTo($btnGroup);

    $('<input>', {
        type: 'button',
        value: 'Clear',
        class: 'btn btn-secondary',
        onclick: 'javascript:arnfClearSearch();',
    }).appendTo($btnGroup);

    searchDiv.append($btnGroup);




    // Reviewer Search Tab Page
    var contentDivAdd = $(".main-div > form > .tab-div > div#content_2");
    var $addDiv = $('<div class="rev-add-div card m-2 p-2"></div>');
    $addDiv.append($('<h3 class="card-title">Add new to eJP</h3>'));

    // Function to append input with title using Bootstrap 5 classes
    function appendInputWithTitleAdd(title, attributes) {
        var $formGroup = $('<div class="mb-3 row"></div>'); // Use Bootstrap's margin bottom class and row
        var $title = $('<label class="col-sm-3 col-form-label">').text(title);
        var $inputDiv = $('<div class="col-sm-9"></div>');
        var $input = $('<input>', attributes).addClass('form-control'); // Ensure form-control class is added for Bootstrap styling

        $inputDiv.append($input);
        $formGroup.append($title, $inputDiv);
        $addDiv.append($formGroup);
    }
    // Hard code each input with original attributes and titles, using Bootstrap styling
    appendInputWithTitleAdd('First Name', { type: 'text', name: 'first_nm' });
    appendInputWithTitleAdd('Last Name', { type: 'text', name: 'last_nm' });
    appendInputWithTitleAdd('Institution', { type: 'text', name: 'org' });
    appendInputWithTitleAdd('Email', { type: 'text', name: 'email' });
    appendInputWithTitleAdd('Phone #', { type: 'text', name: 'phone' });
    // Adding button with Bootstrap classes
    var addButton = $('div#content_2 input[type="button"]').clone();
   

    $addDiv.append( $('<div class="mt-3"></div>').append(addButton));

    
    removeNbsp('.main-div div');

    var addResultsTable = $('.main-div > form > .tab-div > div > table#artv_search_results_tbl');
    $($addDiv).append(addResultsTable);
    contentDivAdd.replaceWith($addDiv);




 // existing reviewers table
    var revsTableDiv =  $('.main-div > form > .tab-div > div#content_3');
    revsTableDiv.prepend($('<h3 class="card-title">Existing reviewers</h3>'));
    var revsTable = $('.main-div > form > .tab-div > div#content_3 > table');

    // Calculate the column count from the first row in the thead of revsTable
    var columnCount = revsTable.find('thead tr:first-child th').length;

    // Initialize an empty array for columnDefs
    var dataTableOptions = {
        responsive: true
    };
    dataTableOptions.columnDefs = [];

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
   
    revsTable.find('tr').each(function() {
        $(this).removeAttr('onmouseover').removeAttr('onmouseout');
    });
    // Initialize DataTables with the configured options on revsTable
    var $clonedTable = revsTable.clone().prop('id', 'clonedRevsTable');
    const priorityHeaders = ["Organization", "Email / Phone"];

    // Iterate through each header in the thead of revsTable to set column definitions
    $clonedTable.find('thead tr:first-child th').each(function (index) {
        var thText = $(this).text().trim();
        if (priorityHeaders.includes(thText)) {
            dataTableOptions.columnDefs.push({ className: 'none', targets: index, responsivePriority: 2 });
        } else {
            // Assign a default priority and ensure visibility for other columns
            dataTableOptions.columnDefs.push({ className: 'all', targets: index, responsivePriority: 1 });
        }
    });

    // Replace the original table with the cloned one
    revsTable.replaceWith($clonedTable);
    $clonedTable.DataTable(dataTableOptions);
    //revsTable.DataTable(dataTableOptions);
    $clonedTable.addClass('stripe display compact row-border');
    $clonedTable.find('textarea').addClass("form-control");


});