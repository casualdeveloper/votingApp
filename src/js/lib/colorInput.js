/* global $ */

let colorInputBox;

let colorInputBoxString = "<div class=\"color-input-box w-25\"><input class=\"form-control\" placeholder\"#fff / rgb(255,255,255)\" id=\"colorInput\"><button class=\"btn btn-block btn-primary\">Submit</button></div>";

class colorInput {
    constructor() {
        colorInputBox = $(colorInputBoxString).appendTo("body").hide();
        bind();
        this.state = false;
    }
    setPositionY(y) {
        if (!colorInputBox) {
            return null;
        }
        colorInputBox.css("top", y);
    }
    activate() {
        if (this.state)
            return null;

        colorInputBox.show();
        this.state = true;
    }
    disable() {
        if (!this.state)
            return null;

        colorInputBox.hide();
        this.state = false;
    }
}

function bind() {
    colorInputBox.on("click", function(e) {
        e.stopPropagation();
    });

}


export default colorInput;