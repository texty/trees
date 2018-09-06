/**
 * Created by ptr_bodnar on 16.07.18.
 */
var mymap = L.map('mapid').setView([48.51, 32.25], 13);
//
// L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
//     attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
//     minZoom: 13,
//     maxZoom: 18,
//     id: 'mapbox.dark',
//     accessToken: 'pk.eyJ1IjoicHRyYmRyIiwiYSI6ImNqZG12dWdtYzBwdzgyeHAweDFueGZrYTYifQ.ZJ2tgs6E94t3wBwFOyRSBQ'
// }).addTo(mymap);

var CartoDB_Positron = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
    subdomains: 'abcd',
    minZoom: 13,
    maxZoom: 18
}).addTo(mymap);



// var color = d3.scaleLinear().domain([0, 10])
//     .range(['#ac3f00', '#33981b']);

function styleForLayer(feature) {

    if (feature.properties.was_cut == 'True') {
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
        .defer(d3.csv, "data/cleaned_tree_3.csv")
        .defer(d3.csv, "data/branch_2.csv")
        .defer(d3.csv, "data/tree_planted_2.csv")
        .await(function (err, data, branch, planted) {
            if (err) throw err;
            createMap(data, branch, planted);
            createBar(data, branch, planted);


        });







