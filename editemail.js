$(document).ready(function () {
    if (!getContext().includes( "EditEmail")) { return; }
    console.log("Edit email");
    $('input[type="button"]').addClass('btn btn-primary m-2');
    $('.main-div table input[type="text"]').addClass('form-control mb-3');
    $('.main-div table input[type="text"]').removeAttr("size");
    $('.main-div > form > table textarea').addClass("form-control").removeAttr("cols");
    

    var emailDiv = $('<div class="email-div"></div>');

    // Iterate through each row of the table
    $('.main-div > form >  table:first tbody tr').each(function() {
        var title = $(this).find('th').text().trim(); // Extract title
        var value = $(this).find('td').html().trim(); // Use .html() to retain any HTML content, like input elements

        // Check if title is non-empty, indicating a valid row for extraction
        if(title) {
            // Create elements for title and value, applying Bootstrap 5 styling as needed
            var titleElement = $('<h6></h6>').text(title);
            

            // Append the title and value elements to the emailDiv
            emailDiv.append(titleElement);
            emailDiv.append(value);
        }
    });
    emailDiv.append($('.main-div > form > table:first textarea'));
    emailDiv.append($('.main-div > form > table:eq(1) a'));
    emailDiv.prepend($('.main-div > form > table:eq(2) input'));
    $('.main-div > form > table:eq(2)').replaceWith('');

    $('.main-div > form >  table:first').replaceWith(emailDiv);


   
    
    
});