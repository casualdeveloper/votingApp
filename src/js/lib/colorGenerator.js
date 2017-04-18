// n - amount of colors to make
function generateColor(n = 1, format = "hex") {
    let Arr = [];

    if (n <= 0) {
        Arr.push("#000000");
    }

    for (let i = 0; i < n; i++) {
        let color;
        let r = Math.round(Math.random() * 255);
        let g = Math.round(Math.random() * 255);
        let b = Math.round(Math.random() * 255);

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
            throw ("Sorry color format " + format + " was not recognized.\nFormats available: hex, rgb, rgba");
        }

        Arr.push(color);
    }
    // if requested amount of colors were 1(default) return color string, otherwise return array of color strings
    return (n === 1) ? Arr[0] : Arr;
}

function rgbToHex(str) {
    let regExp = /[^0-9,]/gi; //Match everyhting except numbers and ","
    str = str.replace(regExp, "");

    let strArr = str.split(",");
    for (let i = 0; i < 3; i++) {
        let strInt = parseInt(strArr[i]);
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
    let regExpMatchWhitespace = /\s+/g;
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
    return (a.length === 1) ? "0" + a : a;
}

export default generateColor;
export { generateColor, normalizeToHex };