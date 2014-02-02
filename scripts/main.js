var db = new Firebase('https://sweltering-fire-6680.firebaseio.com/rates');

function submitData(data) {
  db.push(data);
}

angular.module('webRatesApp', []).controller('MyCtrl', function ($scope, $http) {
  $scope.data = {};
  $scope.submitForm = function () {
    $http.post('/url', $scope.data);
  }
});
