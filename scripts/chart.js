/**
 * D3 based visualization of our cool dataz
 * @author sfrdmn
 */
;(function(root) {

  // Defaults
  CoolChart.LABEL_HEIGHT = 25
  CoolChart.PADDING_TOP = 100
  CoolChart.SPACING = 0.25
  CoolChart.RATE_MIN = 10
  CoolChart.RATE_MAX = 120
  CoolChart.BIN_WIDTH = 15
  CoolChart.CURRENCY = '$'

  function CoolChart(d3, svgEl) {
    this.d3 = d3
    this.el = svgEl
    this.$el = d3.select(svgEl)
    this.data = []
    this.init()
  }

  CoolChart.prototype.init = function() {
    // Set defaults
    this.labelHeight = CoolChart.LABEL_HEIGHT
    this.paddingTop = CoolChart.PADDING_TOP
    this.spacing = CoolChart.SPACING
    this.rateMin = CoolChart.RATE_MIN
    this.rateMax = CoolChart.RATE_MAX
    this.binWidth = CoolChart.BIN_WIDTH
    this.currency = CoolChart.CURRENCY
    // Set up graph skeleton
    this.el.innerHTML = ''
    this.graph = this.$el.append('g')
        .attr('class', 'root_group')
    this.labelGroup = this.graph.append('g')
        .attr('class', 'label_group')
        .attr('transform', translate(0, -1))
    this.update([])
  }

  /**
   * Perform necessary transformations for updated data
   */
  CoolChart.prototype.update = function(data) {
    var d3 = this.d3
    var width = this.$el.attr('width') || 0
    var height = this.$el.attr('height') || 0
    this.data = data || []

    // flat list of just pay rates
    this.rates = this.data.map(function(d) {
      return d.rate
    })
    // list of cut off points for histogram bar ranges
    // so [10, 20, 30] (I think) gives two bars taking data from the
    // ranges 10 - 20 and 20 - 30
    this.thresholds = d3.range(this.rateMin, this.rateMax, this.binWidth)
    // d3.layout.historgram allows us to transform a plain array of data
    // into an array of sets or 'bins' of data
    // soo, takes our pay rate list and groups all the common pay rates together
    this.bins = d3.layout.histogram()
        .bins(this.thresholds)(this.rates)
    // flat list of bin sizes, i.e. frequencies for histogram
    this.freqs = this.bins.map(function(d) {
      return d.length;
    })

    this.updateScale()
  }

  CoolChart.prototype.resize = function() {
    this.updateScale()
  }

  CoolChart.prototype.updateScale = function() {
    var width = this.$el.attr('width') || 0
    var height = this.$el.attr('height') || 0
    this.xScale = d3.scale.ordinal()
        .domain(d3.range(0, this.bins.length))
        .rangeRoundBands([0, width], this.spacing)
    this.yScale = d3.scale.linear()
        .domain([d3.min(this.freqs), d3.max(this.freqs)])
        .range([1, height - this.paddingTop])
  }

  CoolChart.prototype.render = function() {
    var thresholds = this.thresholds
    var bins = this.bins
    var currency = this.currency
    var graph = this.graph
    var labelGroup = this.labelGroup
    var width = this.$el.attr('width') || 0
    var height = this.$el.attr('height') || 0
    var labelHeight = this.labelHeight
    var x = this.xScale
    var y = this.yScale

    var bars = graph.selectAll('.bar').data(this.bins)
    var barsEnter = bars.enter()
    var barsExit = bars.exit()

    barsEnter
        .append('g')
        .attr('class', 'bar')
        .append('rect')
        .attr('x', 1)
    bars
        .attr('transform', function(d, i) {
          return translate(x(i), height - y(d.y) - labelHeight)
        })
        .select('rect')
        .attr('width', function(d) {
          return x.rangeBand()
        })
        .attr('height', function(d) {
          return y(d.y)
        })

    labelGroup.attr('transform', translate(0, height))
    var labels = labelGroup.selectAll('.label').data(bins)
    var labelsEnter = labels.enter()
    var labelsExit = labels.exit()

    labelsEnter
        .append('text')
        .attr('class', 'label')
    labels
        .attr('x', function(d, i) {
          return x(i) + x.rangeBand() / 2
        })
        .attr('width', function(d, i) {
          return x.rangeBand()
        })
        .text(function(d, i) {
          return getLabel(thresholds, currency, 0, bins.length - 1, i)
        })
  }

  function getLabel(thresholds, currency, min, max, i) {
    if (i === min)
      return '< ' + currency + thresholds[i]
    else if (i === max)
      return '> ' + currency + thresholds[i]
    else
      return currency + thresholds[i] + ' - ' + currency + thresholds[i + 1]
  }

  function translate(x, y) {
    return 'translate(' + x + ', ' + y + ')';
  }

  root['CoolChart'] = CoolChart

}).call(this, window);

// Keeping old line graph code around just in case
//
// function renderLineGraph(data) {
//   var x = d3.scale.linear()
//       .domain([0, data.length])
//       .range([0, width])

//   var y = d3.scale.linear()
//       .domain([0, d3.max(data.map(function(d) { return d.rate }))])
//       .range([0, width])

//   // generates function which takes array of data and returns svg path attribute nonsense
//   var line = d3.svg.line()
//       .x(function(d, i) {
//         return x(i)
//       })
//       .y(function(d) {
//         return y(d.rate)
//       })
//       // interpolation technique for smoothiness of our linez
//       .interpolate('basis')

//   // toss the entire data set at d3 and have it generate
//   // a single line out of it
//   graph.append('svg:path')
//     .datum(data)
//     .attr('class', 'line')
//     .attr('d', line)
// }
