webpackJsonp([0],[
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__lib_colorGenerator__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__lib_colorInput__ = __webpack_require__(14);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return getColors; });
/* global $ */




var newColorInput = void 0;

var options = 2;

// store index of color that input will change
var indexOfActiveColor = void 0;

var addOptionBtn = $("#addOptionBtn");
var removeOptionBtn = $("#removeOptionBtn");
var newPollOptions = $("#newPollOptions");
var newPollOptionsColors = $(".new-poll-option-colorBox-inner");

//temp storage for updating color in css
var lastUpdatedBox = void 0;

//ref to call submit button for color input
var colorInputSubmitButton = void 0;

//"RemoveOption" state
var disabled = true;

//main array of all colors
var _COLORS = [];

//Check if user is on new poll page and if so setup base colors(first 2), initialize color input box and setup bindings
(function () {
    if (newPollOptionsColors.length <= 0) return null;

    newColorInput = new __WEBPACK_IMPORTED_MODULE_1__lib_colorInput__["a" /* default */](); //create(still hidden) for user color input box 
    colorInputSubmitButton = newColorInput.getSubmitButton; // set reference for color input submit button
    bindSetup(); //bind events

    var colors = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__lib_colorGenerator__["a" /* generateColor */])(newPollOptionsColors.length, "hex");
    _COLORS = colors;

    for (var i = 0; i < newPollOptionsColors.length; i++) {
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
addOptionBtn.on("click", function () {
    options++;
    var tempColor = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__lib_colorGenerator__["a" /* generateColor */])(1, "hex");
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
removeOptionBtn.on("click", function () {
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

function generateNewOptionString(color) {
    var num = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : options;

    return "<div class=\"new-poll-option d-flex mb-2\">" + "<div class=\"new-poll-option-colorBox-outer mr-1\">" + "<div class=\"new-poll-option-colorBox-inner\" data-color-number=" + (num - 1) + " style=\"background:" + color + "\">" + color + "</div>" + "</div>" + "<input class=\"form-control\" placeholder=\"Option " + num + "\" name=\"option" + num + "\">" + "</div>";
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
    $("#newPollOptions").on("click", ".new-poll-option-colorBox-outer", function (e) {

        //set ref for the latest color box (used to update color in css via updateColorBox function)
        lastUpdatedBox = $(e.currentTarget).children()[0];
        //getting index and activating color box
        var tempIndex = lastUpdatedBox.dataset.colorNumber;
        indexOfActiveColor = tempIndex;
        newColorInput.activate(_COLORS[tempIndex]);

        //setting position for color input box
        var positionTop = $(e.currentTarget).position().top;
        newColorInput.setPositionY(positionTop);

        e.stopPropagation();
    });

    //bind event for submit button inside color input box
    colorInputSubmitButton.on("click", function () {
        if (newColorInput.getState) {
            disableColorInput(newColorInput.getColor);
        }
    });
    //if clicked anythere else than color input box achieves same effect as submit button
    $(document).on("click", function (e) {
        if (newColorInput.getState) {
            disableColorInput(newColorInput.getColor);
            e.stopPropagation();
        }
    });
}



/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return generateColor; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return normalizeToHex; });
// n - amount of colors to make
function generateColor() {
    var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "hex";

    var Arr = [];

    if (n <= 0) {
        Arr.push("#000000");
    }

    for (var i = 0; i < n; i++) {
        var color = void 0;
        var r = Math.round(Math.random() * 255);
        var g = Math.round(Math.random() * 255);
        var b = Math.round(Math.random() * 255);

        if (format === "hex") {
            r = fix1CharString(r.toString(16));
            g = fix1CharString(g.toString(16));
            b = fix1CharString(b.toString(16));
            color = "#" + r + g + b;
        } else if (format === "rgb") {
            color = "rgb(" + r + "," + g + "," + b + ")";
        } else if (format === "rgba") {
            color = "rgba(" + r + "," + g + "," + b + ",0)";
        } else {
            throw "Sorry color format " + format + " was not recognized.\nFormats available: hex, rgb, rgba";
        }

        Arr.push(color);
    }
    // if requested amount of colors were 1(default) return color string, otherwise return array of color strings
    return n === 1 ? Arr[0] : Arr;
}

function rgbToHex(str) {
    var regExp = /[^0-9,]/gi; //Match everyhting except numbers and ","
    str = str.replace(regExp, "");

    var strArr = str.split(",");
    for (var i = 0; i < 3; i++) {
        var strInt = parseInt(strArr[i]);
        console.log(strInt);
        if (strInt > 255 || strInt < 0) {
            return null;
        }
        strArr[i] = fix1CharString(strInt.toString(16));
        console.log(strArr[i]);
    }

    return "#" + strArr[0] + strArr[1] + strArr[2];
}

/*
Removes hash, symbols, whitespace
 if length of string is 3 of 6 string is "approved" and returned as valid Hex color
 if not returns null
*/
function checkHex(str) {
    //removes hash and whitespace
    str = str.replace(/[#\s]+/g, "");

    //remove every symbol
    str = str.replace(/[^A-Za-z0-9]+/g, "");
    if (str.length === 3 || str.length === 6) {
        return "#" + str;
    } else {
        return null;
    }
}
//changes rgb/rgba to hex besides checks if users approved hex is valid.
function normalizeToHex(str) {
    var regExpMatchWhitespace = /\s+/g;
    str = str.replace(regExpMatchWhitespace, "");
    if (str.substr(0, 3) === "rgb") {
        return rgbToHex(str);
    } else if (str.length >= 3 && str.length <= 7) {
        return checkHex(str);
    } else {
        return null;
    }
}

// Checks if hex string has only 1 char and if so adds 0 to the front
function fix1CharString(a) {
    return a.length === 1 ? "0" + a : a;
}

/* unused harmony default export */ var _unused_webpack_default_export = generateColor;


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__newPollOptions__ = __webpack_require__(0);
/* global $ */
var newPollForm = $("#newPollForm");



newPollForm.on("submit", function (e) {
    //To prevent reload
    e.preventDefault();

    //Get data from Form
    var data = newPollForm.serializeArray();

    //Extract options from Form
    var options = [];
    //begins at 1 to skip the title
    for (var i = 1; i < data.length; i++) {
        options.push(data[i].value);
    }

    //Generate colors, data.length-1 here is to subtract title from length

    data = {
        title: data[0].value,
        options: options,
        colors: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__newPollOptions__["a" /* getColors */])()
    };

    //Send data
    $.ajax({
        type: "POST",
        url: "/poll",
        data: data,
        dataType: "json",
        success: function success(data) {
            // Data here is response from server
            if (typeof data.redirect === "string") {
                // redirect 
                window.location = data.redirect;
            }
        }

    });
});

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_chart_js_dist_Chart_min_js__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_chart_js_dist_Chart_min_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_chart_js_dist_Chart_min_js__);
/* global poll */



(function () {

    var ctx = document.getElementById("myChart");
    //check if myChart exists (it only exists in page that shows chart)
    if (ctx != null) {

        var jsPoll = poll;

        var data = {
            labels: jsPoll.options,
            datasets: [{
                data: jsPoll.results,
                backgroundColor: jsPoll.colors,
                hoverBackgroundColor: jsPoll.colors
            }]
        };
        new __WEBPACK_IMPORTED_MODULE_0_chart_js_dist_Chart_min_js___default.a(ctx.getContext("2d"), {
            type: "doughnut",
            data: data,
            options: {}
        });
    }
})();

/***/ }),
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__colorGenerator__ = __webpack_require__(1);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* global $ */



var colorInputBox = void 0;

var colorInputBoxString = "<div class=\"color-input-box w-25\"><input class=\"form-control\" id=\"colorInput\"><button class=\"button btn-block button-primary custom-submit-button\">Save</button></div>";

var colorInput = function () {
    function colorInput() {
        _classCallCheck(this, colorInput);

        colorInputBox = $(colorInputBoxString).appendTo("body").hide();
        bind();
        this.inputVar = colorInputBox.children("input");
        this.state = false;
        this.submitButton = colorInputBox.children("button");
        this.prevColor; // prevColor just a placeholder for older color if "error" would occur when typing in new one
    }

    _createClass(colorInput, [{
        key: "setPositionY",
        value: function setPositionY(y) {
            if (!colorInputBox) {
                return null;
            }
            colorInputBox.css("top", y);
        }
    }, {
        key: "activate",
        value: function activate(color) {
            if (this.state) {
                this.changeInputVal(color);
                return null;
            }

            this.prevColor = color;
            this.changeInputVal(color);
            colorInputBox.show();
            this.state = true;
        }
    }, {
        key: "disable",
        value: function disable() {
            if (!this.state) return null;

            colorInputBox.hide();
            this.state = false;
        }
    }, {
        key: "changeInputVal",
        value: function changeInputVal(val) {
            this.inputVar.val(val);
        }
    }, {
        key: "getColor",
        get: function get() {
            var tempColor = this.inputVar.val();

            //if used weird value normalizeToHex should return null

            tempColor = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__colorGenerator__["b" /* normalizeToHex */])(tempColor);
            if (!tempColor) tempColor = this.prevColor;

            return tempColor;
        }
    }, {
        key: "getSubmitButton",
        get: function get() {
            return this.submitButton;
        }
    }, {
        key: "getState",
        get: function get() {
            return this.state;
        }
    }]);

    return colorInput;
}();

function bind() {
    colorInputBox.on("click", function (e) {
        e.stopPropagation();
    });
}

/* harmony default export */ __webpack_exports__["a"] = colorInput;

/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__showChart__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__newPollOptions__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__newPollPost__ = __webpack_require__(2);




/***/ })
],[15]);
//# sourceMappingURL=app.js.map