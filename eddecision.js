$(document).ready(function () {
    if (!getContext().includes( "EdDecision") ){
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

    $('.main-div > form > br').remove();
    $('.main-div > br').remove();
    removeNbsp('.main-div');
    $('.main-div > form#review_form_loader > p:contains("Reviewer #")').each(function() {
        if ($(this).next().is('table')) {
            var $p = $(this);
            var $table = $p.next();
            var $commentsDiv = $('<div class="comments card m-4"></div>');

            $commentsDiv.append($('<div class="card-header h4"></div>').text($p.text()));
            $table.find('tr:not(:first)').each(function() {
                var $sectionDiv = $('<div class="card-body"></div>');
                var $row = $(this);
                var headerText = $row.find('th').first().text(); // Assuming first <th> is the header
                var valueText = $row.find('td').first().html(); // Assuming first <td> is the value

                var $headerDiv = $('<div class="h6 card-subtitle text-muted mb-2"></div>').text(headerText);
                var $valueDiv = $('<div class="card-text mb-3"></div>').html(valueText);
                $sectionDiv.append($headerDiv, $valueDiv);
                var $input = $row.find('input');

                if ($input.length>0) {
                    var $title = $('<h6 class="h6 card-subtitle text-muted mb-2">Send to Authors</h6>');
                    $sectionDiv.append($title).append($input);
                }
            $commentsDiv.append($sectionDiv);
            });


            // Insert .comments div after the <p>
            $p.after($commentsDiv);

            // Remove original <p> and <table>
            $p.remove();
            $table.remove();
        }
    });
    $('.main-div a[target="print_rev_comments"]').remove();
    $('.main-div > form > table:has(th:contains("Reviewer information"))').remove();
    $('.main-div > form > b').remove();
    $('.main-div > table:first').remove();

    $('p:contains("Circulation Comments")').each(function(){
        if ($(this).next().is('table')){
            var circTable = $(this).next();
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
                $circDiv.append($('<div></div>').addClass('comment card m-2 p-2').html(comment));
            });
        
            circTable.replaceWith($circDiv);
            $(this).replaceWith('<div class="h4">Editor Comments</di>');

        }
    })
    $('a[target="print_circ_comments"]').remove();

    var decisionTable = $('.main-div > form > table:has(div.rev_long_title_question, td.form-question)');
    console.log(decisionTable);
    var decisionDiv = $('<div class="card decision-div m-2 p-2"></div>');
    var selectDiv = $('<div class="mb-2"></div>');
    selectDiv.append(decisionTable.find('tbody>tr>td>select:first')).append(decisionTable.find('div#transfer_options select#transfer_option'));
    selectDiv.append(decisionTable.find('select#transfer_journal_name'));
    selectDiv.append(decisionTable.find('tr> td >select[name="template"]'));
    selectDiv.append(decisionTable.find('tr>td>input'));
    selectDiv.find('input').addClass('btn btn-primary');
    selectDiv.find('select').removeAttr('class').addClass("form-select mb-2");
    decisionDiv.append(selectDiv);
    $('.main-div > form').prepend(decisionDiv);
    var emailDiv = $('<div></div>');
    $('.main-div > form > input[name="1_msg_subj"]').addClass("form-control mb-2");
    $('.main-div > form > textarea[name="1_msg_txt"]').addClass("form-control mb-2");
    emailDiv.append($('.main-div > form > input[name="1_msg_subj"]'));
    emailDiv.append($('.main-div > form > textarea[name="1_msg_txt"]'));
    $('.main-div > form > input#submit_dec_button').addClass("btn btn-primary")
    emailDiv.append($('.main-div > form > input#submit_dec_button'));

    decisionDiv.append(emailDiv);
    decisionTable.remove();





});