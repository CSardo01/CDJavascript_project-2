// ------------------------------
// Global Configuration Variables
// ------------------------------
var DEFAULT_SMALL_GRID_DENSITY = 3; // Default density for small grids.
var DEFAULT_LARGE_GRID_DENSITY = 20; // Default density for the large grid.
var DEFAULT_BORDER_COLOR = "#e8e8e8"; // Default border color for cells.
var fillColors = ["#ff5938", "#ffd138", "#63a2ff", "#d1edff"]; // Array of palette colors.
var selectedColorIndex = 0; // Tracks which palette color is selected.
var gridDensity = DEFAULT_SMALL_GRID_DENSITY; // Global setting for overall small grid density.

// ------------------------------
// Utility Functions for Grid and Palette
// ------------------------------

// Updates the fillColors array based on current values of palette color inputs.
function updateFillColors() {
    fillColors = $(".palette-color-picker").map(function () {
        return $(this).val();
    }).get();
}

// Moves the visual indicator (e.g., underline) beneath the selected palette color.
// The offset is based on the index of the selected color.
function moveIndicator(index) {
    var offset = index * 38;
    $('.color-indicator').css('left', offset + 'px');
}

// ------------------------------
// Grid Generation Functions
// ------------------------------

// Generates and returns the HTML string for a grid's cells given its density.
// For example, for a density of 3, returns a string containing 9 cell divs.
function cellGeneration(density) {
    // new Array(n+1).join('...') repeats the provided string n times.
    return new Array(density * density + 1).join('<div class="cell"></div>');
}

// Sets up the draggable functionality for cells in small grids.
// This enables the cells (or an entire small grid) to be dragged.
function initializeDraggable() {
    $(".grid-small").draggable({
        helper: "clone",
        appendTo: "body",
        revert: "invalid",
        scroll: false,
        zIndex: 10000
    });
}

// Sets up droppable functionality for each cell in the large grid.
// When a draggable small grid or cell is dropped, it clones the element into the target cell.
function initializeDroppable() {
    $(".grid-large .cell").droppable({
        accept: ".grid-small",
        drop: function (event, ui) {
            var clone = ui.draggable.clone().css({
                margin: 0,
                gap: 0,
                width: "100%",
                height: "100%",
                border: "none"
            });
            $(this).empty().css("border", "none").append(clone);
        }
    });
}

// ------------------------------
// Grid Injection Functions
// ------------------------------

// Injects the large grid into the DOM using the default large grid density.
// The grid layout is defined via the CSS class "grid-large".
function injectLargeGrid() {
    var density = DEFAULT_LARGE_GRID_DENSITY;
    var cells = cellGeneration(density);
    // Create the grid HTML; note that the CSS rules for .grid-large control the layout.
    var gridHTML = `<div class="grid-large">${cells}</div>`;
    $(".large-grid-container").html(`<div class="grid-container">${gridHTML}</div>`);
    initializeDroppable(); // Enable dropping on the new large grid cells.
}

// Injects four small grids into the DOM.
// Each small grid includes an individual density input and uses the global gridDensity for its cell layout.
function injectSmallGrids() {
    // Remove any existing small grid containers to avoid duplication.
    $('.small-grids-container .grid-container').remove();

    // Create 4 small grids.
    for (var i = 0; i < 4; i++) {
        var density = gridDensity;
        var cells = cellGeneration(density);
        // Inline style sets the grid dimensions and layout based on density.
        var style = `width: var(--grid-small-size); 
                     height: var(--grid-small-size); 
                     grid-template-columns: repeat(${density}, 1fr); 
                     grid-template-rows: repeat(${density}, 1fr);`;
        // Each small grid container includes a label with an input for changing its density.
        var smallGridHTML = `
            <div class="grid-container small-grid">
                Density: <input type="number" class="individual-density" value="${density}" min="2" max="10">
                <div class="grid-small" style="${style.trim()}">
                    ${cellGeneration(density)}
                </div>
            </div>`;
        $(".small-grids-container").append(smallGridHTML);
    }
    initializeDraggable(); // Enable dragging for the new small grids.
}

// ------------------------------
// Grid Update Function for Individual Density Changes
// ------------------------------

// When a user changes the density of an individual small grid via its input field,
// this function is triggered to update that grid's cell layout.
function updateIndividualGridDensity() {
    // Convert the input value to an integer; fallback to default if the conversion fails.
    var newDensity = parseInt($(this).val(), 10) || DEFAULT_SMALL_GRID_DENSITY;
    // Find the closest container that holds both the density input and its associated grid.
    var container = $(this).closest(".grid-container");
    // Generate new inline styles based on the updated density.
    var style = `width: var(--grid-small-size); 
                 height: var(--grid-small-size); 
                 grid-template-columns: repeat(${newDensity}, 1fr); 
                 grid-template-rows: repeat(${newDensity}, 1fr);`;
    // Replace the existing small grid with the updated grid (cells generated via cellGeneration).
    container.find('.grid-small').replaceWith(
        `<div class="grid-small" style="${style.trim()}">
             ${cellGeneration(newDensity)}
         </div>`
    );
    // Reinitialize draggable so that the updated grid's cells remain draggable.
    initializeDraggable();
}

// Register the event handler for changes to individual grid density inputs.
// This ensures that when the density value is modified, the corresponding grid updates immediately.
$(document).on("change", ".individual-density", updateIndividualGridDensity);
