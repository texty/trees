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
                .defer(d3.csv, "vydalennia_new.csv")
                .await(function (err, data, branch, planted, vydalennia) {
                    if (err) throw err;

                    console.log(data)
                    console.log('gdgd')
                    // console.log(vydalennia);
                    // createMap(data, branch, planted);
                    // createBar(data);

                })
        }
    }
})