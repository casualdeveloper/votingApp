webpackJsonp([0],[
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__lib_randomColor__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__lib_colorInput__ = __webpack_require__(13);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return getColors; });
/* global $ */




var newColorInput = void 0;

var options = 2;

var addOptionBtn = $("#addOptionBtn");
var removeOptionBtn = $("#removeOptionBtn");
var newPollOptions = $("#newPollOptions");
var newPollOptionsColors = $(".new-poll-option-colorBox-inner");

var disabled = true;

//main array of all colors
var _COLORS = [];

//Check if user is on new poll page and if so setup base colors(first 2), initialize color input box and setup bindings
(function () {
    if (newPollOptionsColors.length <= 0) return null;

    newColorInput = new __WEBPACK_IMPORTED_MODULE_1__lib_colorInput__["a" /* default */]();

    bindSetup();

    var colors = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__lib_randomColor__["a" /* generateColor */])(newPollOptionsColors.length, "hex");
    _COLORS = colors;

    for (var i = 0; i < newPollOptionsColors.length; i++) {
        $(newPollOptionsColors[i]).css("background", colors[i]).text(colors[i]);
    }
})();

//Add option when creating new poll
addOptionBtn.on("click", function () {
    options++;
    var tempColor = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__lib_randomColor__["a" /* generateColor */])(1, "hex");
    _COLORS.push(tempColor);

    newPollOptions.append(generateNewOptionString(tempColor));

    if (disabled) {
        disabled = false;
        removeOptionBtn.attr("disabled", false);
    }
});
//Remove option when creating new poll
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

    return "<div class=\"new-poll-option d-flex\">" + "<div class=\"new-poll-option-colorBox-outer\">" + "<div class=\"new-poll-option-colorBox-inner\" data-color-number=" + (num - 1) + " style=\"background:" + color + "\">" + color + "</div>" + "</div>" + "<input class=\"form-control\" placeholder=\"Option " + num + "\" name=\"option" + num + "\">" + "</div>";
}

function bindSetup() {
    $("#newPollOptions").on("click", ".new-poll-option-colorBox-outer", function (e) {

        newColorInput.activate();

        var positionTop = $(e.currentTarget).position().top;
        newColorInput.setPositionY(positionTop);

        e.stopPropagation();
    });

    $(document).on("click", function (e) {

        newColorInput.disable();

        e.stopPropagation();
    });
}



/***/ }),
/* 1 */
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
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_chart_js_dist_Chart_min_js__ = __webpack_require__(6);
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
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* global $ */

var colorInputBox = void 0;

var colorInputBoxString = "<div class=\"color-input-box w-25\"><input class=\"form-control\" placeholder\"#fff / rgb(255,255,255)\" id=\"colorInput\"><button class=\"btn btn-block btn-primary\">Submit</button></div>";

var colorInput = function () {
    function colorInput() {
        _classCallCheck(this, colorInput);

        colorInputBox = $(colorInputBoxString).appendTo("body").hide();
        bind();
        this.state = false;
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
        value: function activate() {
            if (this.state) return null;

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
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return generateColor; });
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

// Checks if hex string has only 1 char if it does adds 0 to the end
function fix1CharString(a) {
    return a.length === 1 ? a + "0" : a;
}



/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__showChart__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__newPollOptions__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__newPollPost__ = __webpack_require__(1);




/***/ })
],[15]);
//# sourceMappingURL=app.js.map