/**
 * Created by ptr_bodnar on 26.07.18.
 */

 function createBar(data, branch, planted, name) {
    //
// D3 locale change
//
    d3.timeFormatDefaultLocale({
        "decimal": ".",
        "thousands": " ",
        "grouping": [3],
        "currency": ["грн", ""],
        "dateTime": "%a %b %e %X %Y",
        "date": "%d.%m.%Y",
        "time": "%H:%M:%S",
        "periods": ["AM", "PM"],
        "days": ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
        "shortDays": ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
        "months": ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
        "shortMonths": ["січ", "лют", "бер", "кві", "тра", "чер", "лип", "сер", "вер", "жов", "лис", "гру"]
    });
//
    var formatMonth = d3.timeFormat("%b");
    var formatYear = d3.timeFormat("%Y");

    // function multiFormat(date) {
    //     return (d3.timeYear(date) < date ? formatMonth : formatYear)(date);
    // }


   d3.selectAll(".bars svg").remove();



    data = data
        //.filter(function(d){return d.orderDate !== "NotYet"})
        .filter(function(d){return d.orderDate || d.datePlanted});


    var barChartData = d3.nest()
        .key(function(d) { if (d.orderDate == undefined) {
            return d.datePlanted.slice(2,-3)
        } else {
            return d.orderDate.slice(2,-3)
        }
        })
        .sortKeys(d3.ascending)
        .rollup(function(v) { return d3.sum(v, function(d) { return +d.itemQuantityPlan }); })
        .entries(data);

    barChartData.forEach(function (d) {
        d.key = swapMonthAndYear(d.key);
    });


    var margin = {top: 0, right: 0, bottom: 0, left: 0};

    var svg = d3.select(".bars").append("svg")
        .attr("width", "100%")
        .attr("class", "filter")
        .append("g");

    var width = d3.select("div.bars")._groups[0][0].getBoundingClientRect().width;
    var height = width * 0.16; // співвідношення сторін

    console.log(width);

    // var width = 450;
    // var height = 100;

    svg.attr("height", height + 'px');

// set the ranges
    var x = d3.scaleBand()
        .range([0, width])
        .padding(0.25);
    var y = d3.scaleLinear()
        .range([height, 0])


    var parseInputDate = d3.timeParse("%y.%m");
    var formatInputDate = d3.timeFormat("%y.%m");

    //
    var dateToTick = d3.timeFormat("%b %Y");
    var outputDateFormat = function(str) {
        return dateToTick(parseInputDate(str));
    };



    var minMonth = d3.max(barChartData.map(function(d){return d.key}));
    var x_domain = [];

    for (var i = 0; i < 12; i++) {
        x_domain.push(addMonths(minMonth, i));
    }

    x_domain = x_domain.sort((a,b) => a-b ) 
    x.domain(x_domain);
    y.domain([0, d3.max(barChartData, function(d) { return d.value; })]);

// append the rectangles for the bar chart


    svg.selectAll(".bar")
        .data(barChartData)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { 
            if (!x(d.key)) {
                debugger
            }
            return x(d.key); 
        })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); })
        .attr("transform", "translate(0," + 40 + ")")
        .attr("fill", "#b5b1af")
        .attr("opacity", "1")
        .attr("position", "centered")
        .on("click", function (d) {
            returnColors();
            d3.select(this).attr("class", "selectedBar");
            geojsonLayer.setStyle(function(feature){
                if (!(feature.properties.orderDate.split("-").splice(0,2).join('.').slice(2) ===  d.key))
                    return {fillColor: 'rgba(0,0,0,0)'}
            });
            geojsonLayerBranch.setStyle(function(feature){
                if (!(feature.properties.orderDate.split("-").splice(0,2).join('.').slice(2) ===  d.key))
                    return {fillColor: 'rgba(0,0,0,0)'}
            });
            geojsonLayerPlanted.setStyle(function(feature){
                if (!(feature.properties.datePlanted.split("-").splice(0,2).join('.').slice(2) ===  d.key))
                    return {fillColor: 'rgba(0,0,0,0)'}
            });
        });

    d3.select(".button")
        .on("click", function () {
        returnColors();
    });

    

    function returnColors() {

        d3.select(".selectedBar").attr("class", "bar");

        geojsonLayer.setStyle(function(feature){
            return styleForLayer(feature);
        });
        geojsonLayerBranch.setStyle(function (feature) {
            if (feature.properties.status == 'Замовлення виконано підрядником') {
                return {fillColor: "#ff005a", color: "rgba(0, 0, 0, 0);"};
            }
            else {
                return {fillColor: "#ffb74b",  color: "rgba(0, 0, 0, 0);"} ;
            }
        });

        geojsonLayerPlanted.setStyle(function(feature){
            if (feature.properties.status == 'Замовлення виконано підрядником') {
                return {fillColor: "#00e13a", color: "rgba(0, 0, 0, 0);"};
            }
            else {
                return {fillColor: "#00e13a",  color: "rgba(0, 0, 0, 0);"} ;
            }
        });
    }


// add the x Axis
    svg.append("g")
        .attr("class", "xAxis")
        .style('color', "red")
        .attr("transform", "translate(0," + 120 + ")")
        .call(d3.axisBottom(x).tickFormat(outputDateFormat))
        .selectAll(".tick text")
        .call(wrap, x.bandwidth());

// add the y Axis
    svg.append("g")
        .attr("class", "yAxis")
        .call(d3.axisLeft(y));

    function addMonths(str, n) {
        return moment(str, "YY.MM").subtract(n, "month").format("YY.MM");
    }

    function swapMonthAndYear(str) {
        var a = str.split("-");
        return a[0] + "." + a[1] ;
    }


    function wrap(text, width) {
        text.each(function () {
            var text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 1.1, // ems
                y = text.attr("y"),
                dy = parseFloat(text.attr("dy")),
                tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(" "));
                if (tspan.node().getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                }
            }
        });

    }
} 
