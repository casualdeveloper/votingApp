/* global $ */

import { generateColor } from "./lib/randomColor";
import colorInput from "./lib/colorInput";

let newColorInput;

let options = 2;

let addOptionBtn = $("#addOptionBtn");
let removeOptionBtn = $("#removeOptionBtn");
let newPollOptions = $("#newPollOptions");

let disabled = true;

let _COLORS = [];

function generateNewOptionString(color, num = options) {
    return "<div class=\"new-poll-option d-flex\">" +
        "<div class=\"new-poll-option-colorBox-outer\">" +
        "<div class=\"new-poll-option-colorBox-inner\" name=\"color" + num + "\" style=\"background:" + color + "\">" + color + "</div>" +
        "</div>" +
        "<input class=\"form-control\" placeholder=\"Option " + num + "\" name=\"option" + num + "\">" +
        "</div>";
}

let newPollOptionsColors = $(".new-poll-option-colorBox-inner");

newPollOptionsColors.on("click", function() {
    newColorInput.activate();
});

(function() {
    if (newPollOptionsColors.length <= 0)
        return null;

    newColorInput = new colorInput();
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

export { getColors };