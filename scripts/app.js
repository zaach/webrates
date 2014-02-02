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
  .constant('defaultFormData', {
    age: 30,
    experience: 2
  })
  .factory('cleanForm', function (defaultFormData) {
    return function () {
      return angular.copy(defaultFormData);
    };
  });
