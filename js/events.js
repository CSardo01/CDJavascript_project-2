// This file contains event handlers not directly related to grid cell generation.
// It sets up user interactions, such as overall density changes, palette color changes,
// border adjustments, resets, cell clicks, keyboard shortcuts, and more.

$(function () {
    // ------------------------------
    // Overall Grid Density Change Handler
    // ------------------------------
    // When the overall small grid density input (outside the individual grids) changes,
    // update the global gridDensity variable and re-create all small grids.
    $(".grid-density").on("change", function () {
        gridDensity = parseInt($(this).val(), 10) || DEFAULT_SMALL_GRID_DENSITY;
        injectSmallGrids();
    });

    // ------------------------------
    // Border Settings Handlers
    // ------------------------------
    // Update the border color for all cells whenever the border color input changes.
    $(".border-color-picker").on("input", function () {
        $(".cell").css("border-color", $(this).val());
    });
    // Update the border thickness for all cells whenever the border thickness slider changes.
    $(".border-thickness").on("input", function () {
        $(".cell").css("border-width", $(this).val() + "px");
    });

    // ------------------------------
    // Palette Interaction Handlers
    // ------------------------------
    // Update the palette fillColors array when any palette color input changes.
    $(".palette-color-picker").on("input", updateFillColors);

    // Set the selected palette color when a palette color input is clicked.
    $(".palette-color-picker").on("click", function () {
        selectedColorIndex = $(".palette-color-picker").index(this);
        moveIndicator(selectedColorIndex);
    });

    // ------------------------------
    // Reset Button Handler
    // ------------------------------
    // When the reset button is clicked, re-inject both the small grids and the large grid.
    $(".reset-button").on("click", function () {
        injectSmallGrids();
        injectLargeGrid();
    });

    // ------------------------------
    // Small Grid Cell Click Handler
    // ------------------------------
    // Clicking a cell inside one of the small grids fills it with the selected palette color.
    $(document).on("click", ".small-grids-container .cell", function () {
        $(this).css("background-color", fillColors[selectedColorIndex]);
        $(this).data("colorIndex", selectedColorIndex);
    });

    // ------------------------------
    // Large Grid Cell Click Handler
    // ------------------------------
    // Clicking on a cell inside the large grid rotates it by 90°.
    $(document).on("click", ".large-grid-container .grid-large > .cell", function (e) {
        e.stopPropagation(); // Prevent the event from bubbling up to unintended elements.
        var rotation = $(this).data("rotation") || 0;
        rotation += 90;
        $(this).data("rotation", rotation);
        $(this).css("transform", "rotate(" + rotation + "deg)");
    });

    // ------------------------------
    // Keyboard Shortcut for Palette Colors
    // ------------------------------
    // Use the keys 1-4 to quickly select one of the palette colors.
    $(document).on("keydown", function (e) {
        if (e.key >= '1' && e.key <= '4') {
            selectedColorIndex = parseInt(e.key, 10) - 1;
            moveIndicator(selectedColorIndex);
        }
    });

    // ------------------------------
    // Right-Click Reset Handler for Cells
    // ------------------------------
    // Right-clicking any cell resets its background color, rotation, and border to the defaults.
    $(document).on("contextmenu", ".cell", function (e) {
        e.preventDefault(); // Prevent the default context menu.

        // Retrieve current slider values.
        var newColor = $('.border-color-picker').val();
        var newThickness = $('.border-thickness').val() + "px";

        // Reset background and transform, and reapply the border settings.
        $(this).removeData("colorIndex rotation");
        $(this).css({
            backgroundColor: "white",
            transform: "none",
            border: newThickness + " solid " + newColor
        });
        $(this).empty();
    });

    // ------------------------------
    // Initial Grid Injection and Settings Trigger
    // ------------------------------
    // On page load, inject the small and large grids.
    injectSmallGrids();
    injectLargeGrid();
    // Trigger updates for border settings to ensure cells have the initial border styles.
    $(".border-color-picker").trigger("input");
    $(".border-thickness").trigger("input");
});
