// Instantiate the MutationObserver
const observer = new MutationObserver((mutationsList, observer) => {
    mutationsList.forEach((mutation) => {
        //console.log("Mutation setcolor.js");
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach((node) => {
                // Check if the added node is a .stickynote or contains .stickynote
                if (node.nodeType === 1 && node.matches(".stickynote")) {
                    var stickyManagerInstance = StickyManager; // Assuming StickyManager() is correct
                    stickyManagerInstance.setMaxHeightWidth("1000", "1000");
                    stickyManagerInstance._notes.forEach(function (note) {
                       
                    });
                }
            });
        }
    });
});

// Observer configuration
const config = { childList: true, subtree: true };
// Start observing the document body
observer.observe(document.body, config);
