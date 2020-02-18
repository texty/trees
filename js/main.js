/**
 * Created by ptr_bodnar on 16.07.18.
 */
var mymap = L.map('mapid').setView([48.51, 32.25], 13);
//


var CartoDB_Positron = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
    subdomains: 'abcd',
    minZoom: 13,
    maxZoom: 18
}).addTo(mymap);



// var color = d3.scaleLinear().domain([0, 10])
//     .range(['#ac3f00', '#33981b']);

function styleForLayer(feature) {

    if (feature.properties.status == 'Замовлення виконано підрядником') {
        return {fillColor: "#ff005a", color: "rgba(0, 0, 0, 0);", fillOpacity: "0.75"};
    }
    else {
        return {fillColor: "#ffb74b", color: "rgba(0, 0, 0, 0);", fillOpacity: "0.75"};
    }
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}




    d3.queue()
        .defer(d3.csv, "data/vydalennja.csv")
        .defer(d3.csv, "data/obrizkaZN.csv")
        .defer(d3.csv, "data/vysadzennja.csv")
        .defer(d3.csv, "vydalennia_new.csv")
        .await(function (err, data, branch, planted, newD) {
            if (err) throw err;


            ///////////////////////////////////////////////////////////////////////

            var newestDate = data.sort((a, b) => new Date(b.reportDate) - new Date(a.reportDate))[0].reportDate
            var oldestDate = moment(newestDate, "YYYY-MM-DD").subtract(11, 'month').format("YYYY-MM-DD");

            var filteredData = data.filter(d => {
    
                // moment(str, "YY.MM.DD").subtract(n, "year").format("YY.MM");
                return ((d.latitude != 'null') & (d.reportDate > oldestDate))
            })

            //////////////////////////////////////////////////////////////////////////

            var newestDateBranch = branch.sort((a, b) => new Date(b.reportDate) - new Date(a.reportDate))[0].orderDate
            var oldestDateBranch = moment(newestDateBranch, "YYYY-MM-DD").subtract(11, 'month').format("YYYY-MM-DD");

            var filteredDataBranch = branch.filter(d => {
    
                // moment(str, "YY.MM.DD").subtract(n, "year").format("YY.MM");
                return ((d.latitude != 'null') & (d.reportDate > oldestDateBranch))
            })



            //////////////////////////////////////////////////////////////////////////

            var newestDatePlanting = planted.sort((a, b) => new Date(b.datePlanted) - new Date(a.datePlanted))[0].datePlanted
            var oldestDatePlanting = moment(newestDatePlanting, "YYYY-MM-DD").subtract(11, 'month').format("YYYY-MM-DD");



            var filteredDataPlanted = planted.filter(d => {
    
                // moment(str, "YY.MM.DD").subtract(n, "year").format("YY.MM");
                return ((d.latitude != 'null') & (d.datePlanted > oldestDatePlanting))
            })

            // var total = data.concat(filteredData)


            createMap(filteredData, filteredDataBranch, filteredDataPlanted);
            createBar(filteredData, filteredDataBranch, filteredDataPlanted);


        });







