angular.module('webRatesApp', ["firebase"])
  .factory("rateService", ["$firebase", function($firebase) {
    var ref = new Firebase("https://sweltering-fire-6680.firebaseio.com/rates");
    return $firebase(ref);
  }])
  .controller('MyCtrl', function ($scope, rateService, cleanForm) {
    $scope.data = rateService;
    $scope.newForm = cleanForm();
    var numericFields = ['age', 'experience', 'rate'];
    $scope.submitForm = function () {
      numericFields.forEach(function (field) {
        $scope.newForm[field] = parseInt($scope.newForm[field], 10);
      });
      $scope.data.$add($scope.newForm);
      $scope.newForm = cleanForm();
    };
  })
  .controller('QueryCtrl', function ($scope, rateService, $http) {

    $scope.filters = {};

    // get mock data for now
    $http.get('/scripts/mock-data.json').success(function (data) {
      $scope.filteredData = $scope.pristineData = data;
    });

    $scope.filteredData = $scope.pristineData = [];

    function filterData () {
      $scope.filteredData = $scope.pristineData.slice(0);

      Object.keys($scope.filters).forEach(function (prop) {
        $scope.filteredData = $scope.filteredData.filter(function (datum) {
          return datum[prop] === $scope.filters[prop];
        });
      });
    }

    $scope.$watch('filters', filterData, true);
  })
  .directive('wrChart', function () {
    return {
      scope: {
        wrModel: '='
      },
      restrict: 'AE',
      link: function (scope, elt, attrs) {
        scope.$watch('wrModel', renderHistogram);

        function renderHistogram(data) {
          console.log('Fetched data', data)
          debug = data

          var $container = elt;
          var width = $container.innerWidth()
          var height = $container.innerHeight()
          // space at bottom for x axis labels
          var labelHeight = 25;
          var paddingTop = 100;
          var spacing = 0.25;

          // plain list of pay rates
          var rates = data.map(function(d) {
            return d.rate
          })

          var graph = d3.select('svg')
              .attr('width', width)
              .attr('height', height)
              .append('g')

          // list of cut off points for histogram bar ranges
          // so [10, 20, 30] (I think) gives two bars taking data from the
          // ranges 10 - 20 and 20 - 30
          var thresholds = d3.range(0, 150, 15)

          console.log('thresholds', thresholds)

          // d3.layout.historgram allows us to transform a plain array of data
          // into an array of sets or 'bins' of data
          // soo, takes our pay rate list and groups all the common pay rates together
          var bins = d3.layout.histogram()
            .bins(thresholds)(rates)

          // plain list of bin sizes
          var freqs = bins.map(function(d) {
            return d.length
          })

          console.log('rates', rates)
          console.log('bins', bins)
          console.log('freqs min + max', d3.min(freqs), d3.max(freqs))

          var y = d3.scale.linear()
              .domain([d3.min(freqs), d3.max(freqs)])
              .range([1, height - paddingTop])
          yScale = y

          var x = d3.scale.ordinal()
              .domain(d3.range(0, bins.length))
              .rangeRoundBands([0, width], spacing)
          xScale = x

          var xAxis = d3.svg.axis()
              .scale(x)
              .orient('bottom');

          var barGroups = graph.selectAll('.bar')
            .data(bins)
            // each bar will be in an svg group
            .enter().append('g')
            .attr('class', 'bar')
            // translate that sucka such that rects drawn at 0, 0 are in the correct place
            .attr('transform', function(d, i) {
              return 'translate(' + x(i) + ',' +
                  (height - y(d.y) - labelHeight) + ')'
            })

          barGroups.append('rect')
              .attr('x', 1)
              .attr('width', function(d) {
                return x.rangeBand()
              })
              .attr('height', function(d) {
                return y(d.y)
              })

         var labels = graph.append('g')
            .attr('class', 'labels')
            .attr('transform', 'translate(0,' + (height) + ')')

          labels.selectAll('.label')
              .data(bins)
              .enter()
              .append('text')
              .attr('class', 'label')
              .attr('width', function(d, i) {
                return x.rangeBand()
              })
              .attr('x', function(d, i) {
                return x(i) + x.rangeBand() / 2
              })
              .text(function(d, i) {
                if (i === 0)
                  return '< $' + thresholds[i]
                else if (i === bins.length - 1)
                  return '> $' + thresholds[i]
                else
                  return '$' + thresholds[i] + ' - ' + '$' + thresholds[i + 1]
              })
        }

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
      }
    }
  })
  .constant('defaultFormData', {
    age: 30,
    experience: 2
  })
  .factory('cleanForm', function (defaultFormData) {
    return function () {
      return angular.copy(defaultFormData);
    };
  });
