/* global $ */
import { generateColor } from "./randomColor";

let newPollForm = $("#newPollForm");

newPollForm.on("submit", (e) => {
    //To prevent reload
    e.preventDefault();

    //Get data from Form
    let data = newPollForm.serializeArray();

    //Extract options from Form
    let options = [];
    //begins at 1 to skip the title
    for (let i = 1; i < data.length; i++) {
        options.push(data[i].value);
    }

    //Generate colors, data.length-1 here is to subtract title from length
    let colors = generateColor(data.length - 1, "hex");

    data = {
        title: data[0].value,
        options: options,
        colors: colors
    };

    //Send data
    $.ajax({
        type: "POST",
        url: "/poll",
        data: data,
        dataType: "json",
        success: function(data) { // Data here is response from server
            if (typeof(data.redirect) === "string") {
                // redirect 
                window.location = data.redirect;
            }
        },

    });

});