;$(function() {

var db = new Firebase('https://sweltering-fire-6680.firebaseio.com/rates');

function submitData(data) {
  db.push(data);
}

angular.module('webRatesApp', [])

.controller('MyCtrl', function ($scope, $http) {
  $scope.data = {};
  $scope.submitForm = function () {
    $http.post('/url', $scope.data);
  }
});

d3.json('/scripts/mock-data.json', function(err, data) {

  console.log('Fetched data', data)
  debug = data

  var width = 800
  var height = 400

  var rates = data.map(function(d) {
    return d.rate
  })

  var graph = d3.select('svg')
      .append('g')

  var x = d3.scale.linear()
      .domain([d3.min(rates), d3.max(rates)])
      .range([0, width])

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var thresholds = d3.range(10, 200, 10)
  console.log('thresholds', thresholds)

  // d3.layout.historgram allows us to transform a plain array of data
  // into an array of sets or "bins" of data
  // soo, takes out pay rate list and groups all the common pay rates together
  var bins = d3.layout.histogram()
    .bins(thresholds)(rates)

  console.log('rates', rates)
  console.log('bins', bins)

  var y = d3.scale.linear()
      .domain([0, 50])
      .range([0, height])


  var barGroups = graph.selectAll('.bar')
    .data(bins)
    .enter().append("g")
    .attr("class", "bar")
    .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")" })

  barGroups.append('rect')
      .attr("x", 1)
      .attr("width", function(d) {
        return d.dx
      })
      .attr("height", function(d) {
        console.log('height', height - y(d.y))
        return height - y(d.y)
      })

 graph.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  function renderLineGraph(data) {
    var x = d3.scale.linear()
        .domain([0, data.length])
        .range([0, width])

    var y = d3.scale.linear()
        .domain([0, d3.max(data.map(function(d) { return d.rate }))])
        .range([0, width])

    // generates function which takes array of data and returns svg path attribute nonsense
    var line = d3.svg.line()
        .x(function(d, i) {
          return x(i)
        })
        .y(function(d) {
          return y(d.rate)
        })
        // interpolation technique for smoothiness of our linez
        .interpolate('basis')

    // toss the entire data set at d3 and have it generate
    // a single line out of it
    graph.append('svg:path')
      .datum(data)
      .attr('class', 'line')
      .attr('d', line)
  }

});

});
