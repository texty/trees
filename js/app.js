/**
 * Created by ptr_bodnar on 26.07.18.
 */

var app5 = new Vue({
    el: '#app',
    data: {
        message: 'Привет, Vue.js!'
    },
    methods: {
        filterTime: function (event) {
            d3.queue()
                .defer(d3.csv, "data/cleaned_tree.csv")
                .defer(d3.csv, "data/branch.csv")
                .defer(d3.csv, "data/tree_planted.csv")
                .await(function (err, data, branch, planted) {
                    if (err) throw err;

                    console.log(event);
                    // createMap(data, branch, planted);
                    // createBar(data);

                })
        }
    }
})