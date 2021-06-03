// this function takes the timestamps and converts it to ISO 8601 standard 
function toiso(ts) {
    dt = ts.split(' '); // separate date and time
    date = dt[0].replaceAll('.', '-'); // replace the dots with - in the date to meet standard
    time = dt[1];
    res = "20" + date + "T" + time + "+00:00"; // put everything together
    return res;
}
var isSaveIm = false;
function saveim() {
    console.log("saving the image.")
    if (isSaveIm == true) {
        a = document.createElement('a');
        a.href = myChart.toBase64Image();
        a.download = 'myChart.png';
        a.click(); //snaps the shot
    }
}
// converts between nm and Thz
function convert(chart, o) {
    console.log("converting nm <-> Thz")
    //f = C/lambda
    // assuming that m is dependant on speed of light
    const C = 299792458; //speed of light
    if (o.xu == "nm") {
        o.xu = "Thz";
        o.xl = "Frequency";
        var scale = Math.pow(10, -3);
        //convert and scale
        for (var i = 0; i < o.xd.length; i++) {
            o.xd[i] = (C / o.xd[i]) * scale;
        }
    }
    else {
        o.xu = "nm"
        o.xl = "Wavelength"
        var scale = Math.pow(10, 3)
        //convert and scale
        for (var i = 0; i < o.xd.length; i++) {
            o.xd[i] = o.xd[i] * scale;
            o.xd[i] = (C / o.xd[i]);
        }
    }
    //update the x axis
    chart.data.labels = o.xd;
    //update the title of the xaxis
    chart.options.scales.x.title = {
        display: true,
        text: o.xl + " [" + o.xu + "]"
    }
    chart.update();
}

//initialization of variables

var date = toiso(timestamp);
// needed an object to change the data in the function
var obj = {
    xu: xunits,
    xl: xlabel,
    xd: x
}
// convert meters to nanometers
for (var i = 0; i < x.length; i++) {
    x[i] = x[i] * Math.pow(10, 9);
    obj.xu = "nm";

}

console.log("Chart is loading")

//all the chartjs initalization -------
const data = {
    labels: x,
    datasets: [{
        label: date, //title
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        data: y, 
    }]
};
const config = {
    type: 'line',
    data,
    options: {
        animation: { //lets me know when the graph has been loaded
            onComplete: function () {
                console.log("Chart is loaded")
                isSaveIm = true;
            }
        },
        scales: {
            y: {
                min: -80,
                max: -30,
                title: {
                    display: true,
                    text: ylabel + " [" + yunits + "]"
                },

            },
            x: {
                title: {
                    display: true,
                    text: obj.xl + " [" + obj.xu + "]"
                },
                ticks: {
                    autoSkip: true,
                    maxTicksLimit: 7,
                    
                }
            }
        }
    }
};
//create the chart
var myChart = new Chart(
    document.getElementById('myChart'),
    config
);
