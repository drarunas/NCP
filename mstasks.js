$(document).ready(function () {
    if (!getContext().includes("MSTasks")) {
        return
    }
    var $tasksButton = $('<button></button>', {
        text: 'Tasks', // Set the button text to "Tasks"
        class: 'btn btn-primary', // Assuming you want to use Bootstrap's button styling
        click: msTasks // Attach the msTasks function to the click event
    });

    // Append the new button to the .top-bar div
    $('.top-bar').append($tasksButton);
    const modalHtml = `
    <div class="modal fade" id="msTasksModal" tabindex="-1" aria-labelledby="msTasksModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="msTasksModalLabel">MS Tasks</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body"></div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
`;
    $('body').append(modalHtml);
    getMSTasks().then(result => {
        // Set the result as the modal's body content
        $('#msTasksModal .modal-body').append(result);
        $('#msTasksModal .modal-body a[href*="view_staff_notes"]').each(function () {
            var href = $(this).attr('href');
            console.log(extractQueryParams(href));
            // Extract the parameters
            const queryParams = extractQueryParams(href);
            const baseUrl = 'https://mts-ncomms.nature.com/cgi-bin/main.plex';
            const fetchUrl = `${baseUrl}?${new URLSearchParams(queryParams).toString()}`;


            fetchStaffNotes(fetchUrl).then(htmlString => {
                // Use DOMParser to create a DOM from the HTML string
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlString, "text/html");

                // Use jQuery with the parsed document
                const $doc = $(doc);

                // Find the <h3> with "General Notes" and the immediately following table
                const $notesTable = $doc.find('h3:contains("General Notes") + table');
                var notesDiv = notesToDiv($notesTable);
                var $form = $doc.find('form#add_staff_note:first');
                notesDiv.append($form);
                $form.hide();
                $('.main-div').append(notesDiv);

                $(document).on('click', '#saveNote', function() {
                    var noteText = $('#noteText').val();
                    console.log(noteText);
                    
                    storeNote(noteText);
                    window.noteModalInstance.hide(); // Hide the modal after saving
                });


            }).catch(console.error);



        });




    }).catch(error => {
        // Handle any errors
        console.error("Failed to fetch MS Tasks:", error);
    });



});

function extractQueryParams(url) {
    const queryParams = {};
    const queryString = url.split('?')[1];
    if (!queryString) {
        return queryParams;
    }
    queryString.split('&').forEach(param => {
        const [key, value] = param.split('=');
        queryParams[key] = value;
    });
    return queryParams;
}

async function fetchStaffNotes(fetchUrl) {
    const response = await fetch(fetchUrl, {
        "headers": {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-language": "en-US,en;q=0.9",
            // Add other necessary headers
        },
        "referrerPolicy": "strict-origin-when-cross-origin",
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Assuming the response is text/html
    const data = await response.text();
    return data; // Return the data so it can be logged outside
}

function notesToDiv(table) {
    // Create the container div that will hold all the content
    var containerDiv = $('<div class="card m-2 p-2"></div>');

    // Create the button with jQuery
    var $newNoteButton = $('<button>', {
        text: 'New Note', // Button text
        class: 'btn btn-primary', // Button classes
        click: newNote // Function to call on click
    });

    var buttonDiv = $('<div class=" m-2 p-2"></div>');
    buttonDiv.append($newNoteButton);
    containerDiv.append(buttonDiv);

    // Iterate over each row of the table, skipping the first one (header)
    $(table).find('tr').each(function (index) {
        // Skip the header row
        if (index === 0) return;
        var rowDiv = $('<div class="mb-3"></div>')



        rowDiv.append($('<div class="card-text h6 mx-5"]></div>').html($(this).find('td:first').html()));
        rowDiv.append($('<div class="card-text h6 mx-5"]></div>').html($(this).find('td:eq(1)').html()));
        rowDiv.append($('<div class=" card-text mb-3 mx-5" style="white-space: pre-wrap;"></div>').html($(this).find('td:eq(2)')));
        $(this).find('td  input[name="edit_note"]').addClass("btn btn-primary");
        rowDiv.append($('<div class="mx-5" ></div>').html(   $(this).find('td > form')  ) );

        containerDiv.append(rowDiv);
        const $hr = $('<div class="border-top my-3"></div>');
        containerDiv.append($hr);

    });

    var modalHTML = `
    <div class="modal fade" id="noteModal" tabindex="-1" aria-labelledby="noteModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="noteModalLabel">New Note</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <textarea class="form-control" id="noteText" rows="3"></textarea>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" id="saveNote">Save</button>
                </div>
            </div>
        </div>
    </div>
    `;
    $('body').append(modalHTML);
    // Initialize the modal
    var noteModal = new bootstrap.Modal(document.getElementById('noteModal'), {
        keyboard: false
    });
    // Store the modal instance for later use
    window.noteModalInstance = noteModal;
    // Return the containerDiv
    return containerDiv;
}

function newNote() {
    window.noteModalInstance.show();
    // Implement the action for the new note here
}

async function storeNote(notetext){
    //process add form -> html, extract add_new_form -> process
    try {
    const result = await processForm( $('.main-div form#add_staff_note')[0] );
    const parser = new DOMParser();
    const doc = parser.parseFromString(result, "text/html");
    const $doc = $(doc.body);
    const $noteForm = $doc.find('form#store_staff_note');
    $noteForm.find('textarea').val(notetext);
    console.log($noteForm.find('textarea').val());
    var submitResult = await processForm($noteForm[0]);

    } catch (error){
        console.error(error);
    }
}

async function processForm(form){

        const formData = new FormData(form);
        // Use fetch to submit the form data
        return fetch(form.action, {
            method: 'POST',
            body: formData,
            credentials: 'include'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .catch(error => {
            console.error('Error during fetch:', error);
            throw error;
        });

}