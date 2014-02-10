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
      template: [
        '<svg class="graph" xmlns="http://www.w3.org/2000/svg" version="1.1">',
        '</svg>'
      ].join(),
      replace: true,
      restrict: 'AE',
      controller: function($scope, $element, $attrs) {
        $scope.$containerEl = $element.parent();
        $scope.initChart = function() {
          $scope.chart = new CoolChart(d3, $element[0])
          window.chart = $scope.chart
          $scope.onResize() // triggers initial render
        }
        /**
         * We want graph size to depend on container size so we can
         * delegate sizing logic to container CSS
         */
        $scope.onResize = function() {
          $($scope.chart.el).attr('width', $($scope.$containerEl).width());
          $($scope.chart.el).attr('height', $($scope.$containerEl).height());
          $scope.chart.resize();
          $scope.chart.render();
        }
        $scope.bindListeners = function() {
          $(window).resize($scope.onResize);
        }
      },
      link: function (scope, elt, attrs) {
        scope.initChart();
        scope.$watch('wrModel', function(data) {
          scope.chart.update(data);
          scope.chart.render();
        });
        scope.bindListeners();
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

