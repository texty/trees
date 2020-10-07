/**
 * Created by ptr_bodnar on 26.07.18.
 */

function createMap(data, branch, planted) {
    d3.selectAll(".leaflet-interactive").remove();
    d3.selectAll(".leaflet-control-layers-toggle").remove();

    

    function nested_geojson(data) {

        window.result_list = [];

        function makeObjectCopy(n, obj) {
            for (var i = 0; i < n; i++) {
                result_list.push(JSON.parse(JSON.stringify(obj)));
            }
        }


        data.forEach(function(d) {
            // if (+d.number <= 1) {
            //     result_list.push(d)
            // }
            // else {
                makeObjectCopy(+d.itemQuantityPlan, d);
            // }
        });

        result_list.forEach(function (obj) {



            if (obj.itemQuantityPlan > 1) {
                obj["LatLon13"] = [+obj.longitude + (getRandomArbitrary(-0.003,0.003)),
                    +obj.latitude + (getRandomArbitrary(-0.003,0.003))];

                obj["LatLon14"] = [+obj.longitude + (getRandomArbitrary(-0.0025,0.0025)),
                    +obj.latitude + (getRandomArbitrary(-0.0025,0.0025))];

                obj["LatLon15"] = [+obj.longitude + (getRandomArbitrary(-0.002,0.002)),
                    +obj.latitude + (getRandomArbitrary(-0.002,0.002))];

                obj["LatLon16"] = [+obj.longitude + (getRandomArbitrary(-0.0015,0.0015)),
                    +obj.latitude + (getRandomArbitrary(-0.0015,0.0015))];

                obj["LatLon17"] = [+obj.longitude + (getRandomArbitrary(-0.001,0.001)),
                    +obj.latitude + (getRandomArbitrary(-0.001,0.001))];

                obj["LatLon18"] = [+obj.longitude + (getRandomArbitrary(-0.0005,0.0005)),
                    +obj.latitude + (getRandomArbitrary(-0.0005,0.0005))];

                obj.longitude = +obj.longitude + (getRandomArbitrary(-0.003,0.003));
                obj.latitude = +obj.latitude + (getRandomArbitrary(-0.003,0.003));
            }
            else {
                obj
            }
        });


        var geojson = result_list.map(function (d) {
            return {
                type: "Feature",
                properties: d,
                geometry: {
                    type: "Point",
                    coordinates: [+d.longitude, +d.latitude]
                }
            }
        });

        return geojson

    }

    geojsonLayer = L.geoJson(nested_geojson(data), {
        style: function (feature) {
            return styleForLayer(feature)
        },
        pointToLayer: function (feature, latlng) {
            return new L.CircleMarker(latlng, {radius: 4, fillOpacity: 0.75});
        }
    });


    geojsonLayerBranch = L.geoJson(nested_geojson(branch), {
        style: function (feature) {
            return styleForLayer(feature);
        },
        pointToLayer: function (feature, latlng) {
            return new L.CircleMarker(latlng, {radius: 4, fillOpacity: 0.5});
        }
    });


    geojsonLayerPlanted = L.geoJson(nested_geojson(planted), {
        style: function (feature) {
            return styleForLayer(feature);
        },
        pointToLayer: function (feature, latlng) {
            return new L.CircleMarker(latlng, {radius: 4, fillOpacity: 0.5});
        }
    });

    mymap.addLayer(geojsonLayer);
    
    overlayMaps = {
        "Видалення дерев": geojsonLayer,
        "Обрізування гілок": geojsonLayerBranch,
        // "Висадження нових дерев": geojsonLayerPlanted 
    };

    //L.control.layers(overlayMaps,null,{collapsed:false}).addTo(mymap);
    
    // Try to place control outside of the map

// Create the control and add it to the map;
    var control = L.control.layers(overlayMaps,null,{collapsed:false});
    control.addTo(mymap);


    // Call the getContainer routine.
    var htmlObject = control.getContainer();
    // Get the desired parent node.
    var a = document.getElementById('layerControl');

    // Finally append that node to the new parent, recursively searching out and re-parenting nodes.
    function setParent(el, newParent)
    {
        newParent.appendChild(el);
        //d3.selectAll('div.leaflet-control-layers').remove();
    }
    setParent(htmlObject, a);

    d3.select(".leaflet-control-layers-list").node()[0].class = 'selectedBaseLayer';

    // add Treeline legend 1
    var legend1 = L.control({position: 'topright'});

    legend1.onAdd = function (mymap) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = ["#ff005a"],
            labels = ["Видалені дерева"];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<span class="dot" style="background:' + grades[i] + '"></span> ' + " " + labels[i] +'<br>';
        }

        return div;
    };

    legend1.addTo(mymap);


    // add  legend 2
    var legend2 = L.control({position: 'topright'});
    legend2.onAdd = function (mymap) {
        var div = L.DomUtil.create('div', 'info legend'),
            grades = ["#ff005a", "#ffb74b"],
            labels = ["Обрізування здійснене","Обрізування не здійснене"];
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<span class="dot" style="background:' + grades[i] + '"></span> ' + " " + labels[i] +'<br>';
        }
        return div;
    };

    // add  legend 3
    var legend3 = L.control({position: 'topright'});
    legend3.onAdd = function (mymap) {
        var div = L.DomUtil.create('div', 'info legend'),
            grades = ["#00e13a"],
            labels = ["Висаджені дерева"];
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<span class="dot" style="background:' + grades[i] + '"></span> ' + " " + labels[i] +'<br>';
        }
        return div;
    };

    // Call the getContainer routine.
    var htmlObjectLegend = legend1.getContainer();
    // Get the desired parent node.
    var b = document.getElementById('legend');

    // Finally append that node to the new parent, recursively searching out and re-parenting nodes.
    function setParent(el, newParent)

    {
        newParent.appendChild(el);
        //d3.selectAll('div.leaflet-control-layers').remove();
    }
    setParent(htmlObjectLegend, b);

    d3.select(".mystyle").append("h3").text(
        "Що робити?"
    );

    d3.select(".mystyle").append("p").text(
        "Натискайте на точки на карті, щоб побачити детальну інформацію про конкретне дерево. " +
        "Також тисніть на стовпці, щоб відфільтрувати лише точки за один місяць."
    );




    geojsonLayer.on("click", function (d) {

        d3.select("div.mystyle").style("display", "flex");
        d3.selectAll(".mystyle *").remove();

        d3.select(".mystyle").append("h3").text(
            "Інформація про дерево: "
        );


        d3.select(".mystyle").append("p").attr("class", "total").text(
            "Адреса: " + d.layer.feature.properties.streetAddress);

        d3.select(".mystyle").append("p").attr("class", "act")
                .text(function () {
                    if (d.layer.feature.properties.customerName !== 'null'
                        && d.layer.feature.properties.customerName !== ''
                        && typeof d.layer.feature.properties.customerName !== 'undefined') {
                        return "Номер акту: " + d.layer.feature.properties.identifier
                    }
                    else {
                        d3.select("p.order").remove();
                    }
                }
        );

        d3.select(".mystyle").append("p").attr("class", "order").text(function (dd) {
                if (d.layer.feature.properties.customerName !== 'null'
                    && d.layer.feature.properties.customerName !== ''
                    && typeof d.layer.feature.properties.customerName !== 'undefined') {
                    return "Ім'я/Назва замовника: " + d.layer.feature.properties.customerName
                }
                else {
                    d3.select("p.order").remove();
                }
            }
        );

        d3.select(".mystyle").append("p")
            .attr("id", d.layer.feature.properties.itemSpecies)
            .attr("class", "tree")
            .text("Вид дерева: " + d.layer.feature.properties.itemSpecies)
            .on('mouseover', function () {
                var sel = this.id;
                geojsonLayer.setStyle(function (d) {
                    if (!(d.properties.itemSpecies == sel)) {
                        return {fillOpacity: "0.1"};
                    }
                });
                geojsonLayerBranch.setStyle(function (d) {
                    if (!(d.properties.itemSpecies == sel)) {
                        return {fillOpacity: "0.1"};
                    }
                });
                geojsonLayerPlanted.setStyle(function (d) {
                    if (!(d.properties.itemSpecies == sel)) {
                        return {fillOpacity: "0.1"};
                    }
                })
            })
            .on('mouseout', function () {
                var sel = this.id;
                geojsonLayer.setStyle(function (d) {
                    if (!(d.properties.itemSpecies == sel)) {
                        return {fillOpacity: "0.75"};
                    }
                })
                geojsonLayerBranch.setStyle(function (d) {
                    if (!(d.properties.itemSpecies == sel)) {
                        return {fillOpacity: "0.75"};
                    }
                })
                geojsonLayerPlanted.setStyle(function (d) {
                    if (!(d.properties.itemSpecies == sel)) {
                        return {fillOpacity: "0.75"};
                    }
                })
            });

        var element = d3.select(".mystyle")
            .selectAll(".element")
            .data(d.layer.feature.properties)
            .enter()
            .append("div")
            .attr("class", "element");
    });


    d3.selectAll(".leaflet-control-layers-selector").each(function(d,i) {
        if (this.checked == true) {
            console.log(this);
        }
    });


    mymap.on('baselayerchange', function (e) {
        addPopUp(e);
        d3.selectAll("#title *").remove();
        if (e.name == 'Видалення дерев') {


            d3.select("div.mystyle").style("display", "none");
            d3.selectAll(".mystyle *").remove();
            createBar(data, "Видалення дерев");
        }
        if (e.name == 'Обрізування гілок') {


            d3.select("div.mystyle").style("display", "none");
            d3.selectAll(".mystyle *").remove();
            createBar(branch, "Обрізування гілок");
        }
        if (e.name == 'Висадження нових дерев') {


            d3.select("div.mystyle").style("display", "none");
            d3.selectAll(".mystyle *").remove();
            createBar(planted, "Висадження нових дерев");
        }

    });


    // // add Treeline legend 1
    // var legend1 = L.control({position: 'topright'});
    //
    // legend1.onAdd = function (mymap) {
    //
    //     var div = L.DomUtil.create('div', 'info legend'),
    //         grades = ["#ff005a", "#ffb74b"],
    //         labels = ["Зрубані дерева","Дерева які ще зрубають"];
    //
    //     // loop through our density intervals and generate a label with a colored square for each interval
    //     for (var i = 0; i < grades.length; i++) {
    //         div.innerHTML +=
    //             '<span class="dot" style="background:' + grades[i] + '"></span> ' + " " + labels[i] +'<br>';
    //     }
    //
    //     return div;
    // };
    //
    // legend1.addTo(mymap);
    //


    mymap.on('baselayerchange', function (eventLayer) {
        // Switch to the Permafrost legend...
        if (eventLayer.name === 'Видалення дерев') {
            this.removeControl(legend2);
            this.removeControl(legend3);
            legend1.addTo(this);

            // Call the getContainer routine.
            var htmlObjectLegend = legend1.getContainer();
            // Get the desired parent node.
            var b = document.getElementById('legend');

            // Finally append that node to the new parent, recursively searching out and re-parenting nodes.
            function setParent(el, newParent)

            {
                newParent.appendChild(el);
                //d3.selectAll('div.leaflet-control-layers').remove();
            }
            setParent(htmlObjectLegend, b);
        }

        if (eventLayer.name === 'Обрізування гілок') {
            geojsonLayerBranch.setStyle(function (feature) {
                if (feature.properties.status == 'Замовлення виконано підрядником') {
                    return {fillColor: "#ff005a", color: "rgba(0, 0, 0, 0);"};
                }
                else {
                    return {fillColor: "#ffb74b", color: "rgba(0, 0, 0, 0);"} ;
                }
            });
            this.removeControl(legend1);
            this.removeControl(legend3);
            legend2.addTo(this);

            var htmlObjectLegend = legend2.getContainer();
            // Get the desired parent node.
            var b = document.getElementById('legend');

            // Finally append that node to the new parent, recursively searching out and re-parenting nodes.
            function setParent(el, newParent)

            {
                newParent.appendChild(el);
                //d3.selectAll('div.leaflet-control-layers').remove();
            }
            setParent(htmlObjectLegend, b);
        }
        if (eventLayer.name === 'Висадження нових дерев') {
            geojsonLayerPlanted.setStyle(function (feature) {
                if (feature.properties.status == 'Замовлення виконано підрядником') {
                    return {fillColor: "#00e13a", color: "rgba(0, 0, 0, 0);"};
                }
                else {
                    return {fillColor: "#00e13a", color: "rgba(0, 0, 0, 0);"} ;
                }
            });
            this.removeControl(legend1);
            this.removeControl(legend2);
            legend3.addTo(this);

            var htmlObjectLegend = legend3.getContainer();
            // Get the desired parent node.
            var b = document.getElementById('legend');

            // Finally append that node to the new parent, recursively searching out and re-parenting nodes.
            function setParent(el, newParent)

            {
                newParent.appendChild(el);
                //d3.selectAll('div.leaflet-control-layers').remove();
            }
            setParent(htmlObjectLegend, b);
        }
    });


    // Тут я працюю над тим, щоб координати змінювались разом із зумом
    mymap.on('zoomend', function () {
        //var currZoom = mymap.getZoom();

        geojsonLayer.eachLayer(function(layer){
            var currZoom = mymap.getZoom();
            if (+layer.feature.properties.itemQuantityPlan > 1) {
                layer.setLatLng({
                    lat: +layer.feature.properties['LatLon' + currZoom][1],
                    lng: +layer.feature.properties['LatLon' + currZoom][0]
                }).redraw();
            }
        });

        geojsonLayerBranch.eachLayer(function(layer){
            var currZoom = mymap.getZoom();
            if (+layer.feature.properties.itemQuantityPlan > 1) {
                layer.setLatLng({
                    lat: +layer.feature.properties['LatLon' + currZoom][1],
                    lng: +layer.feature.properties['LatLon' + currZoom][0]
                }).redraw();
            }
        });


        geojsonLayerPlanted.eachLayer(function(layer){
            var currZoom = mymap.getZoom();
            if (+layer.feature.properties.itemQuantityPlan > 1) {
                layer.setLatLng({
                    lat: +layer.feature.properties['LatLon' + currZoom][1],
                    lng: +layer.feature.properties['LatLon' + currZoom][0]
                }).redraw();
            }
        });
    });

}

