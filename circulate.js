$(document).ready(function () {
    if (getContext() != "Circulate") { return; }
    var titleTable = $('.main-div > table#ms_brief_table');
    var titleDiv = $('<div class="msview-title"></div>');
    titleDiv.append($('<h6></h6>').html(titleTable.find('tr:first > th').html()));
    titleDiv.append($('<h6></h6>').html(titleTable.find('tr:first > td:first').html()));
    titleDiv.append($('<h6></h6>').html(titleTable.find('tr:first > td:eq(1)').html()));
    titleDiv.append($('<h3></h3>').html(titleTable.find('tr:first > td:eq(2)').html()));
    titleTable.replaceWith(titleDiv);

    var textArea = $('.main-div > form#none > textarea[name="circulation_comment_to_other_editors"]');
    console.log(textArea);
    $.each(textArea[0].attributes, function () {
        // If the attribute is not 'name', remove it
        if (this.name !== 'name') {
            textArea.removeAttr(this.name);
        }
    });
    $('textarea[name="circulation_comment_to_other_editors"]').addClass('form-control shadow').attr('rows', '15'); 
    $('select[name="template"]').addClass('form-control');
    $('select[name="editor_list"]').attr('data-live-search', 'true').attr('data-width', 'fit').attr("data-actions-box", "true").addClass('selectpicker');
    $('select[name="editor_list"]').attr("data-style", "btn-info");

    $('input[type="submit"]').addClass('btn btn-primary');
    $('input[type="checkbox"]').addClass("form-check-input");

    $('.main-div br').remove();
   // $('.main-div font').remove();
    $('.main-div span.TITLE').remove();


    $('select[name="editor_list"]').selectpicker();
    $('select[name="editor_list"]').selectpicker('deselectAll');







});