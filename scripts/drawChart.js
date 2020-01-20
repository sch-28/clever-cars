canvas2 = document.getElementById("chart");
ctx2 = canvas2.getContext("2d");

let inputLabels = [];
let inputData = [];
let bg = "rgba(0,0,0,0.5)";

var chart = new Chart(ctx2, {
    type: "line",
    data: {
        labels: inputLabels,
        datasets: [{
            type: "line",
            label: "Fitness",
            data: inputData,
            borderColor: "#8e5ea2",
          //  fill: false
        }/* , {
            type: "bar",
            label: "Fitness",
            data: inputData,
            backgroundColor: bg,
        } */,]
    },
    options: {
        title: {
            display: true,
            text: "Fitness des besten Genoms jeder Generationen"
        },
        legend: { display: false },
        scales: {
            yAxes: [{
                ticks: {
                    suggestedMin: 0,
                    suggestedMax: 1
                }
            }]
        }
    }

});
