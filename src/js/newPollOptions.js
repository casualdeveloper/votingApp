/* global $ */

let options = 2;

let addOptionBtn = $("#addOptionBtn");
let removeOptionBtn = $("#removeOptionBtn");
let newPollOptions = $("#newPollOptions");

let disabled = true;

//Add option when creating new poll
addOptionBtn.on("click", () => {
    options++;
    newPollOptions.append("<input class=\"form-control\" placeholder=\"Option " + options + "\" name=\"option" + options + "\">");
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
        if (options == 2) {
            disabled = true;
            removeOptionBtn.attr("disabled", true);
        }
    }
});