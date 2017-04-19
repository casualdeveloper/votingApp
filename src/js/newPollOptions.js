/* global $ */

import { generateColor } from "./lib/colorGenerator";
import colorInput from "./lib/colorInput";

let newColorInput;

let options = 2;

// store index of color that input will change
let indexOfActiveColor;

let addOptionBtn = $("#addOptionBtn");
let removeOptionBtn = $("#removeOptionBtn");
let newPollOptions = $("#newPollOptions");
let newPollOptionsColors = $(".new-poll-option-colorBox-inner");

//temp storage for updating color in css
let lastUpdatedBox;


//ref to call submit button for color input
let colorInputSubmitButton;


//"RemoveOption" state
let disabled = true;

//main array of all colors
let _COLORS = [];

//Check if user is on new poll page and if so setup base colors(first 2), initialize color input box and setup bindings
(function() {
    if (newPollOptionsColors.length <= 0)
        return null;

    newColorInput = new colorInput(); //create(still hidden) for user color input box 
    colorInputSubmitButton = newColorInput.getSubmitButton; // set reference for color input submit button
    bindSetup(); //bind events

    let colors = generateColor(newPollOptionsColors.length, "hex");
    _COLORS = colors;

    for (let i = 0; i < newPollOptionsColors.length; i++) {
        $(newPollOptionsColors[i]).css("background", colors[i]).text(colors[i]);
    }

})();

//Add option when creating new poll
/*
---->incr options
---->generate new color
---->add new option
---->enable "RemoveOption" button
*/
addOptionBtn.on("click", function() {
    options++;
    let tempColor = generateColor(1, "hex");
    _COLORS.push(tempColor);

    newPollOptions.append(generateNewOptionString(tempColor));

    if (disabled) {
        disabled = false;
        removeOptionBtn.attr("disabled", false);
    }
});
//Remove option when creating new poll
/*
---->decrease options (can't get lower than 2)
---->remove latest option and color
---->disable "RemoveOption" button if only 2 options are left
*/
removeOptionBtn.on("click", function() {
    if (options > 2) {
        options--;
        newPollOptions.children().last().remove();
        _COLORS.pop();

        if (options == 2) {
            disabled = true;
            removeOptionBtn.attr("disabled", true);
        }

    }
});

function getColors() {
    return _COLORS;
}

function generateNewOptionString(color, num = options) {
    return "<div class=\"new-poll-option d-flex mb-2\">" +
        "<div class=\"new-poll-option-colorBox-outer mr-1\">" +
        "<div class=\"new-poll-option-colorBox-inner\" data-color-number=" + (num - 1) + " style=\"background:" + color + "\">" + color + "</div>" +
        "</div>" +
        "<input class=\"form-control\" placeholder=\"Option " + num + "\" name=\"option" + num + "\">" +
        "</div>";
}

//making color input box invisible, setting up and applying any color changes
function disableColorInput(val) {
    newColorInput.disable();
    _COLORS[indexOfActiveColor] = val;
    updateColorBox(indexOfActiveColor);
    indexOfActiveColor = null;
}

function updateColorBox(index) {
    $(lastUpdatedBox).css("background", _COLORS[index]);
}

function bindSetup() {
    $("#newPollOptions").on("click", ".new-poll-option-colorBox-outer", function(e) {

        //set ref for the latest color box (used to update color in css via updateColorBox function)
        lastUpdatedBox = $(e.currentTarget).children()[0];
        //getting index and activating color box
        let tempIndex = lastUpdatedBox.dataset.colorNumber;
        indexOfActiveColor = tempIndex;
        newColorInput.activate(_COLORS[tempIndex]);

        //setting position for color input box
        let positionTop = $(e.currentTarget).position().top;
        newColorInput.setPositionY(positionTop);

        e.stopPropagation();
    });


    //bind event for submit button inside color input box
    colorInputSubmitButton.on("click", function() {
        if (newColorInput.getState) {
            disableColorInput(newColorInput.getColor);
        }
    });
    //if clicked anythere else than color input box achieves same effect as submit button
    $(document).on("click", function(e) {
        if (newColorInput.getState) {
            disableColorInput(newColorInput.getColor);
            e.stopPropagation();
        }

    });
}

export { getColors };