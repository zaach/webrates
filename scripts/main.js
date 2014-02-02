$(function() {

d3.json('/scripts/mock-data.json', function(err, data) {

  console.log('Fetched data', data)
  debug = data

  var $container = $('.container_graph')
  var width = $container.innerWidth()
  var height = $container.innerHeight()

  var rates = data.map(function(d) {
    return d.rate
  })

  var graph = d3.select('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')

  var x = d3.scale.linear()
      .domain([d3.min(rates), d3.max(rates)])
      .range([0, width])

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  // list of cut off points for histogram bar ranges
  // so [10, 20, 30] (I think) gives two bars taking data from the
  // ranges 10 - 20 and 20 - 30
  var thresholds = d3.range(10, 200, 10)

  console.log('thresholds', thresholds)

  // d3.layout.historgram allows us to transform a plain array of data
  // into an array of sets or "bins" of data
  // soo, takes our pay rate list and groups all the common pay rates together
  var bins = d3.layout.histogram()
    .bins(thresholds)(rates)

  // plain list of bin sizes
  var frequency = bins.map(function(d) {
    return d.length
  })

  console.log('rates', rates)
  console.log('bins', bins)

  var y = d3.scale.linear()
      .domain([d3.min(frequency), d3.max(frequency)])
      .range([0, height])


  var barGroups = graph.selectAll('.bar')
    .data(bins)
    // each bar will be in an svg group
    .enter().append("g")
    .attr("class", "bar")
    // translate that sucka such that rects drawn at 0, 0 are in the correct place
    .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")" })

  var barWidth = width / bins.length

  barGroups.append('rect')
      .attr("x", 1)
      .attr("width", function(d) {
        return barWidth
      })
      .attr("height", function(d) {
        console.log('data point', d)
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
