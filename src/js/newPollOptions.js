/* global $ */

import { generateColor } from "./lib/randomColor";
import colorInput from "./lib/colorInput";

let newColorInput;

let options = 2;

let addOptionBtn = $("#addOptionBtn");
let removeOptionBtn = $("#removeOptionBtn");
let newPollOptions = $("#newPollOptions");
let newPollOptionsColors = $(".new-poll-option-colorBox-inner");

let disabled = true;

//main array of all colors
let _COLORS = [];

//Check if user is on new poll page and if so setup base colors(first 2), initialize color input box and setup bindings
(function() {
    if (newPollOptionsColors.length <= 0)
        return null;

    newColorInput = new colorInput();

    bindSetup();

    let colors = generateColor(newPollOptionsColors.length, "hex");
    _COLORS = colors;

    for (let i = 0; i < newPollOptionsColors.length; i++) {
        $(newPollOptionsColors[i]).css("background", colors[i]).text(colors[i]);
    }

})();

//Add option when creating new poll
addOptionBtn.on("click", () => {
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
removeOptionBtn.on("click", () => {
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
    return "<div class=\"new-poll-option d-flex\">" +
        "<div class=\"new-poll-option-colorBox-outer\">" +
        "<div class=\"new-poll-option-colorBox-inner\" data-color-number=" + (num - 1) + " style=\"background:" + color + "\">" + color + "</div>" +
        "</div>" +
        "<input class=\"form-control\" placeholder=\"Option " + num + "\" name=\"option" + num + "\">" +
        "</div>";
}

function bindSetup() {
    $("#newPollOptions").on("click", ".new-poll-option-colorBox-outer", function(e) {

        newColorInput.activate();

        let positionTop = $(e.currentTarget).position().top;
        newColorInput.setPositionY(positionTop);

        e.stopPropagation();
    });

    $(document).on("click", function(e) {

        newColorInput.disable();

        e.stopPropagation();
    });
}

export { getColors };