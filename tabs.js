// $(document).ready(function () {
   
//     var tabPage = $("table.tabPage").first(); // Selects the first outer-most table with class tabPage
//     if (!tabPage.length) { return }


// // Check if a form with the name 'nf_assign_rev' exists
// var form = $("form[name='nf_assign_rev']");

// // If the form exists, clone it and append the clone to the end of the body
// if (form.length > 0) {
//     form.clone().hide().appendTo('body');
// }





//     // Initialize an object to store the scripts' content based on specific keywords
//     var Scripts = {
//         History: null,
//         Email: null,
//         Notes: null
//     };

//     // Select scripts that are direct children of tabPage table
//     tabPage.find('script').each(function () {
//         var scriptContent = $(this).text(); // Get the script content

//         if (scriptContent.includes('history_already_loaded')) {
//             Scripts.History = scriptContent;

//         } else if (scriptContent.includes('email_already_loaded')) {
//             Scripts.Email = scriptContent;
//         } else if (scriptContent.includes('notes_already_loaded')) {
//             Scripts.Notes = scriptContent;
//         }
//     });

//     function extractPostBody(scriptContent) {
//         // This pattern attempts to match the postBody string directly, accounting for the continuous format
//         const pattern = /postBody:'(form_type=\w+&time'\+time\+'&j_id=\d+&ms_id=\d+&ms_rev_no=\d+&ms_id_key=\w+)'/;
//         const match = pattern.exec(scriptContent);

//         if (match && match[1]) {
//             // Found the postBody string
//             return match[1];
//         }
//         return null; // Return null if no match is found
//     }

//     if (tabPage.length) {
//         // Look for divs inside tabPage with class tabPage and ids of the form content_x
//         var contentDivs = tabPage.find("div.tabPage").filter(function () {
//             return this.id.match(/^content_\d+$/);
//         });

//         $(contentDivs).each(function () {
//             $(this).removeAttr('style');
//         });



//     }

//     if (Scripts.Email) {
//         // if MS details, not reviewer finding page:
//         document.getElementById("content_0").id = "Details";
//         document.getElementById("content_1").id = "Files";
//         document.getElementById("content_2").id = "Actions";
//         document.getElementById("content_3").id = "History";
//         document.getElementById("content_4").id = "Email";
//         document.getElementById("content_5").id = "Notes";


//         Object.keys(Scripts).forEach(key => {
//             if (Scripts[key] !== null) {
//                 var postbody = extractPostBody(Scripts[key]);
//                 // Replace '{time}' with the actual current timestamp
//                 var currentTime = Date.now(); // Gets current time in milliseconds
//                 var postBodyReplaced = postbody.replace('\'+time+\'', currentTime.toString());

//                 // Now, use this postBody in your fetch request
//                 fetch("https://mts-ncomms.nature.com/cgi-bin/main.plex", {
//                     "headers": {
//                         "accept": "text/javascript, text/html, application/xml, text/xml, */*",
//                         "accept-language": "en-US,en;q=0.9",
//                         "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
//                         "sec-ch-ua": "\"Chromium\";v=\"122\", \"Not(A:Brand\";v=\"24\", \"Google Chrome\";v=\"122\"",
//                         "sec-ch-ua-mobile": "?0",
//                         "sec-ch-ua-platform": "\"Windows\"",
//                         "sec-fetch-dest": "empty",
//                         "sec-fetch-mode": "cors",
//                         "sec-fetch-site": "same-origin",
//                         "x-prototype-version": "1.6.0.3",
//                         "x-requested-with": "XMLHttpRequest"
//                     },
//                     "referrer": "https://mts-ncomms.nature.com/cgi-bin/main.plex?form_type=view_ms&j_id=18&ms_id=483014&ms_rev_no=0&ms_id_key=ftdRFjQUQeW3dhNgbEIDt9pBA&ndt=AZA7O6eZ",
//                     "referrerPolicy": "strict-origin-when-cross-origin",
//                     "body": postBodyReplaced,
//                     "method": "POST",
//                     "mode": "cors",
//                     "credentials": "include"
//                 })
//                     .then(response => response.text()) // Assuming the response is text, adjust if it's JSON or another format
//                     .then(data => {
//                         // Use key to determine which div to update
//                         var contentId = `${key}`;
//                         var divToUpdate = document.getElementById(contentId);
//                         if (divToUpdate) {
//                             divToUpdate.innerHTML = data;
//                         }
//                     })
//                     .catch(error => console.error('Error:', error));
//             }
//         });// end if
//     }
//     else {
//         document.getElementById("content_0").id = "Search";
//         document.getElementById("content_1").id = "Results";
//         document.getElementById("content_2").id = "Add";
//         document.getElementById("content_3").id = "Existing";
//         document.getElementById("content_4").id = "Notes";
//         document.getElementById("content_5").id = "Details";
//         document.getElementById("content_6").id = "Files";
//     }


//  // Assuming contentDivs is already defined
// // Convert contentDivs to a real array for manipulation
// var contentDivsArray = $.makeArray(contentDivs);

// // Find the index of the div with the ID 'Actions'
// var index = contentDivsArray.findIndex(function(div) {
//     return div.id === 'Actions';
// });

// // If found, move the div to the first position
// if (index !== -1) {
//     var actionsDiv = contentDivsArray.splice(index, 1)[0]; // Remove the Actions div from its current position
//     contentDivsArray.unshift(actionsDiv); // Prepend it to the beginning of the array
// }

// // Convert the array back to a jQuery object if needed
// contentDivs = $(contentDivsArray);

//     console.log(contentDivs);
//     // Create the tab list and content container
//     var $tabList = $('<ul class="nav nav-pills" role="tablist"></ul>');
//     var $tabContent = $('<div class="tab-content"></div>');

//     // Assuming contentDivs is already defined
//     contentDivs.each(function (index) {
//         var $div = $(this);
//         var id = $div.attr('id');
//         var tabId = `tab-${id}`;
//         var paneId = `pane-${id}`;

//         // Create the tab item and link
//         var $tabItem = $('<li class="nav-item" role="presentation"></li>');
//         var $tabLink = $(`<a class="nav-link" id="${tabId}" data-bs-toggle="tab" href="#${paneId}" role="tab" aria-controls="${paneId}" aria-selected="${index === 0 ? 'true' : 'false'}">${id}</a>`);

//         // Append the link to the item, and the item to the list
//         $tabItem.append($tabLink);
//         $tabList.append($tabItem);

//         // Wrap the div in a pane div if not already and add it to the tab content
//         if (!$div.parent().hasClass('tab-pane')) {
//             $div.wrap(`<div class="tab-pane fade" id="${paneId}" role="tabpanel" aria-labelledby="${tabId}"></div>`);
//         }
//         $tabContent.append($div.parent());

//         // Activate the first tab and its content
//         if (id === "Actions") {
//             $tabLink.addClass('active');
//             $div.parent().addClass('show active');
//         }
//     });
//     // Create a container for both the tab list and tab content
//     var $tabsContainer = $('<div class="tabsDiv"></div>');
//     $tabsContainer.append($tabList).append($tabContent);

//     // Insert the container with both elements after 'tabPage'
//     tabPage.after($tabsContainer);
//    //tabPage.remove();


//     const mainTable = $('table').first(); // Adjust this selector if the main table has a more specific identifier.
//     const titleTable = $('#ms_brief_table');
//     const navDiv = $('.nav-pills');
//     const tabsDiv = $('.tab-content');

//     // Ensure elements exist
//     if (titleTable.length && tabsDiv.length && mainTable.length) {
//         // Insert 'titleTable' and 'tabsDiv' directly above the main table without cloning,
//         // since jQuery handles the movement of elements implicitly.
//         mainTable.before(titleTable);
//         mainTable.before(navDiv);
//         mainTable.before(tabsDiv);


//         // Remove the main table
//        // mainTable.remove();
//     } else {
//         console.error('One or more elements could not be found.');
//     }


// });