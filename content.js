// Find the <link> element with the specified href attribute
var linkElement = document.querySelector(
    'link[href="https://mts-ncomms.nature.com/html/style.css"]'
);

// Check if the element exists before removing it
if (linkElement) {
    linkElement.remove();
}

var linkElement = document.querySelector(
    'link[href="https://mts-ncomms.nature.com/html/default_folder.css?1550611957"]'
);

// Check if the element exists before removing it
if (linkElement) {
    linkElement.remove();
}

function loadRobotoFont() {
    // Create a <link> element to import the Roboto font from Google Fonts
    var linkElement = document.createElement("link");
    linkElement.href =
        "https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap";
    linkElement.rel = "stylesheet";

    document.head.appendChild(linkElement);
}

loadRobotoFont();

$(document).ready(function () {
    // Identify the table by finding a span with class "TITLE" that contains specific text
    var spans = document.querySelectorAll("span.TITLE");
    spans.forEach(function (span) {
        if (
            span.textContent.includes("Author Tasks") ||
            span.textContent.includes("General Tasks")
        ) {
            // Find the table by traversing up from the span
            var table = span.closest("table");

            // Add a custom class to the table for styling
            if (table) {
                table.classList.add("modern-look");

                // Remove rows that are exactly <tr><td></td></tr>
                var rows = table.querySelectorAll("tr");
                rows.forEach(function (row) {
                    // Check if the row has exactly one td element that is empty
                    if (
                        row.cells.length === 1 &&
                        !row.cells[0].textContent.trim()
                    ) {
                        row.remove();
                    }
                });
                table.style.marginLeft = "auto";
                table.style.marginRight = "auto";
                table.style.display = "block";
            }
        }
    });

// Find the <tr> element with the class 'ncommsbg'
var trElement = document.querySelector('tr.ncommsbg');

// Check if the <tr> element exists
if (trElement) {
    // Navigate up to the parent <table> element
    var tableElement = trElement.closest('table');
    
    // Check if the parent <table> element exists
    if (tableElement) {
        // Remove the <table> element from the DOM
        tableElement.parentNode.removeChild(tableElement);
    }
}

    
});
