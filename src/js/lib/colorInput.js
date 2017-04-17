/* global $ */

let colorInputBox;

class colorInput {
    constructor() {
        $("body").append("<div class=\"color-input-box\"><input class=\"form-control\" id=\"colorInput\"><button class=\"btn btn-block btn-primary\">Submit</button></div>");
        colorInputBox = $(".color-input-box");
    }
    activate() {
        colorInputBox.css("visibility", "visible");
    }
    disable() {
        colorInputBox.css("visibility", "hidden");
    }

}


export default colorInput;