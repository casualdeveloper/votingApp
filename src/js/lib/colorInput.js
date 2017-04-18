/* global $ */

let colorInputBox;

let colorInputBoxString = "<div class=\"color-input-box w-25\"><input class=\"form-control\" id=\"colorInput\"><button class=\"btn btn-block btn-primary\">Submit</button></div>";

class colorInput {
    constructor() {
        colorInputBox = $(colorInputBoxString).appendTo("body").hide();
        bind();
        this.inputVar = colorInputBox.children("input");
        this.state = false;
    }
    setPositionY(y) {
        if (!colorInputBox) {
            return null;
        }
        colorInputBox.css("top", y);
    }
    activate(color) {
        if (this.state) {
            this.changeInputVal(color);
            return null;
        }

        this.changeInputVal(color);
        colorInputBox.show();
        this.state = true;
    }
    disable() {
        if (!this.state)
            return null;

        colorInputBox.hide();
        this.state = false;
    }
    changeInputVal(val) {
        this.inputVar.val(val);
    }
}

function bind() {
    colorInputBox.on("click", function(e) {
        e.stopPropagation();
    });

}


export default colorInput;