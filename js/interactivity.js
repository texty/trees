function addPopUp(e) {

    geojsonLayer.setStyle(function(feature){
        return styleForLayer(feature);
    });
    geojsonLayerBranch.setStyle(function (feature) {
        if (feature.properties.was_cut == 'true') {
            return {fillColor: "#ff005a", color: "rgba(0, 0, 0, 0);"};
        }
        else {
            return {fillColor: "#ffb74b",  color: "rgba(0, 0, 0, 0);"} ;
        }
    });

    geojsonLayerPlanted.setStyle(function(feature){
        if (feature.properties.was_cut == 'true') {
            return {fillColor: "#00e13a", color: "rgba(0, 0, 0, 0);"};
        }
        else {
            return {fillColor: "#00e13a",  color: "rgba(0, 0, 0, 0);"} ;
        }
    });

    e.layer.on("click", function (d) {
        d3.select("div.mystyle").style("display", "flex");
        d3.selectAll(".mystyle *").remove();

        d3.select(".mystyle").append("h3").text(
            "Інформація про дерево: "
        );

        d3.select(".mystyle").append("p").attr("class", "total").text(
            "Адреса: " + d.layer.feature.properties.tree_adress_shorten);

        d3.select(".mystyle").append("p").attr("class", "act").text(function (dd) {
            if (typeof d.layer.feature.properties.act_number !== 'undefined') {
                return "Номер акту: " + d.layer.feature.properties.act_number
            }
            else {
                d3.select("p.act").remove();
            }
            }
        );

        d3.select(".mystyle").append("p").attr("class", "order").text(function (dd) {
                if (d.layer.feature.properties.name_who_ordered !== 'unknown'
                    && typeof d.layer.feature.properties.name_who_ordered !== 'undefined') {
                    return "Ім'я/Назва замовника: " + d.layer.feature.properties.name_who_ordered
                }
                else {
                    d3.select("p.order").remove();
                }
            }
        );


        d3.select(".mystyle")
            .append("p")
            .attr("class", "tree")
            .attr("id", d.layer.feature.properties.tree_characteristics)
            .text("Вид дерева: " + d.layer.feature.properties.tree_characteristics)
            .on('mouseover', function (d) {
                var sel = this.id;
                geojsonLayer.setStyle(function (d) {
                    if (!(d.properties.tree_characteristics == sel)) {
                        return {fillOpacity: "0.1"};
                    }
                });
                geojsonLayerBranch.setStyle(function (d) {
                    if (!(d.properties.tree_characteristics == sel)) {
                        return {fillOpacity: "0.1"};
                    }
                });
                geojsonLayerPlanted.setStyle(function (d) {
                    if (!(d.properties.tree_characteristics == sel)) {
                        return {fillOpacity: "0.1"};
                    }
                })
            })
            .on('mouseout', function () {
                var sel = this.id;
                geojsonLayer.setStyle(function (d) {
                    if (!(d.properties.tree_characteristics == sel)) {
                        return {fillOpacity: "0.75"};
                    }
                });
                geojsonLayerBranch.setStyle(function (d) {
                    if (!(d.properties.tree_characteristics == sel)) {
                        return {fillOpacity: "0.75"};
                    }
                });
                geojsonLayerPlanted.setStyle(function (d) {
                    if (!(d.properties.tree_characteristics == sel)) {
                        return {fillOpacity: "0.75"};
                    }
                })
            });

    });
}


