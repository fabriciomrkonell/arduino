define(['js/app'], function (app) {
  app.controller('new-sensor', function ($scope, $http, SweetAlert) {

    angular.extend($scope, {
      dados: {}
    });

    $scope.saveSensor = function(){
      $http.post('/schroeder/sensor/', $scope.dados).success(function(data, status, headers, config) {
        SweetAlert.success(data.message, "", "<i class='glyphicon glyphicon-ok'></i>&nbsp;&nbsp;Ok");
        angular.extend($scope, {
          dados: {}
        });
      })
    };

  });
});
