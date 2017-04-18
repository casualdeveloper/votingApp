/* global $ */

import { normalizeToHex } from "./colorGenerator";

let colorInputBox;

let colorInputBoxString = "<div class=\"color-input-box w-25\"><input class=\"form-control\" id=\"colorInput\"><button class=\"btn btn-block btn-primary\">Submit</button></div>";

class colorInput {
    constructor() {
        colorInputBox = $(colorInputBoxString).appendTo("body").hide();
        bind();
        this.inputVar = colorInputBox.children("input");
        this.state = false;
        this.submitButton = colorInputBox.children("button");
        this.prevColor; // prevColor just a placeholder for older color if "error" would occur when typing in new one

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

        this.prevColor = color;
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
    get getColor() {
        let tempColor = this.inputVar.val();

        //if used weird value normalizeToHex should return null

        tempColor = normalizeToHex(tempColor);
        if (!tempColor)
            tempColor = this.prevColor;

        return tempColor;
    }
    get getSubmitButton() {
        return this.submitButton;
    }
    get getState() {
        return this.state;
    }
}

function bind() {
    colorInputBox.on("click", function(e) {
        e.stopPropagation();
    });

}


export default colorInput;