/* global poll */

import Chart from "chart.js/dist/Chart.min.js";

(function() {

    let ctx = document.getElementById("myChart");
    //check if myChart exists (it only exists in page that shows chart)
    if (ctx != null) {

        let jsPoll = poll;

        let data = {
            labels: jsPoll.options,
            datasets: [{
                data: jsPoll.results,
                backgroundColor: jsPoll.colors,
                hoverBackgroundColor: jsPoll.colors
            }]
        };
        let myDoughnutChart = new Chart(ctx.getContext("2d"), {
            type: 'doughnut',
            data: data,
            options: {}
        });
    }
})();