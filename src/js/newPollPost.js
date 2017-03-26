/* global $ */

let newPollForm = $("#newPollForm");

newPollForm.on("submit", (e) => {
    // to prevent reload
    e.preventDefault();

    //get data from Form
    let data = newPollForm.serializeArray();
    // send data
    $.ajax({
        type: "POST",
        url: "/poll",
        data: data,
        dataType: "json",
        success: function() {
            console.log("yay");
        },

    });

});