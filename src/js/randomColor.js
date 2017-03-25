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


// Checks if hex string has only 1 char if it does adds 0 to the end
function fix1CharString(a) {
    return (a.length === 1) ? a + "0" : a;
}

export { generateColor }