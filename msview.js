$(document).ready(function () {
    if (getContext() != "MSView") {
        return
    }

    var titleTable = $('.main-div > table#ms_brief_table');
    var titleDiv = $('<div class="msview-title"></div>');
    titleDiv.append($('<h6></h6>').html(titleTable.find('tr:first > th').html()));
    titleDiv.append($('<h6></h6>').html(titleTable.find('tr:first > td:first').html()));
    titleDiv.append($('<h6></h6>').html(titleTable.find('tr:first > td:eq(1)').html()));
    titleDiv.append($('<h3></h3>').html(titleTable.find('tr:first > td:eq(2)').html()));
    titleTable.replaceWith(titleDiv);

    var Scripts = {
        History: null,
        Email: null,
        Notes: null
    };

    //   /html/body/div[1]/table/tbody/tr[2]/td/table/tbody/tr/td[2]/script[1]
    var tabTable = $('.main-div > table.tabPage');
    tabTable.find('tbody > tr > td > table > tbody > tr > td > script').each(function () {
        var scriptContent = $(this).text();
        if (scriptContent.includes('history_already_loaded')) {
            Scripts.History = scriptContent;
        } else if (scriptContent.includes('email_already_loaded')) {
            Scripts.Email = scriptContent;
        } else if (scriptContent.includes('notes_already_loaded')) {
            Scripts.Notes = scriptContent;
        }
    });
    function extractPostBody(scriptContent) {
        // This pattern attempts to match the postBody string directly, accounting for the continuous format
        const pattern = /postBody:'(form_type=\w+&time'\+time\+'&j_id=\d+&ms_id=\d+&ms_rev_no=\d+&ms_id_key=\w+)'/;
        const match = pattern.exec(scriptContent);
        if (match && match[1]) {
            return match[1];
        }
        return null;
    }
    var contentDivs = tabTable.find("tbody > tr > td > table > tbody > tr > td > div.tabPage").filter(function () {
        return this.id.match(/^content_\d+$/);
    });

    $(contentDivs).each(function () {
        $(this).removeAttr('style');
        $(".main-div").append($(this));
    });

});