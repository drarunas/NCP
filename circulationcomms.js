$(document).ready(function () {
    if (!getContext().includes( "CirculationComms")) { return; }

    var titleTable = $('.main-div > table#ms_brief_table');
    var titleDiv = $('<div class="msview-title"></div>');
    titleTable.replaceWith(titleDiv);
    titleDiv.append($('<h6 class="badge m-1 text-bg-info"></h6>').html(titleTable.find('tr:first > th').html()));
    titleDiv.append($('<h6 class="badge m-1 text-bg-info"></h6>').html(titleTable.find('tr:first > td:first').html()));
    titleDiv.append($('<h6 class="badge m-1 text-bg-secondary"></h6>').html(titleTable.find('tr:first > td:eq(1)').html()));

    getMSDetails().then(msDetails => {
        //titleDiv.append($('<h6></h6>').html(msDetails["Corresponding Author"]));
        titleDiv.append($('<h3></h3>').html(msDetails["Title"]));

    }).catch(error => {
        console.error("Failed to get manuscript details:", error);
    });


    $('input[type="submit"]').addClass('btn btn-primary mb-3');
    $('input[type="button"]').addClass('btn btn-primary mb-3');
    $('select').addClass('form-select form-select-sm mb-3');
    $('input[type="text"].not#searchInput').addClass('form-control m-2');

    $('.main-div > br').replaceWith('');
    $('.main-div > form > br').replaceWith('');
    $('.main-div > form > p > br').replaceWith('');
    $('span.MSG').replaceWith('');
    removeNbsp('.main-div');
    $('.main-div textarea').addClass("form-control mb-2");

    var circTable = $('.main-div > form > table:first');
    var $circDiv = $('<div></div>').addClass('circDiv');
    circTable.find('tbody > tr').each(function (index) {
        // Skip the header row
        if (index === 0) return;
        // Extract name, date, and comment from the columns
        var name = $(this).find('th:eq(0)').text();
        var date = $(this).find('td:eq(0)').text();
        var comment = $(this).find('td:eq(1)').html(); // Use html() to retain formatting
        $circDiv.append($('<div></div>').addClass('name badge m-1 text-bg-info').text(name));
        $circDiv.append($('<div></div>').addClass('date badge m-1 text-bg-secondary').text(date));
        $circDiv.append($('<div></div>').addClass('comment card mb-2 p-2').html(comment));
    });

    circTable.replaceWith($circDiv);
    $('.main-div > table:first').remove();





});