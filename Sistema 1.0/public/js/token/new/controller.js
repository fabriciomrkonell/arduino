define(['js/app'], function (app) {
  app.controller('new-token', function ($scope, $http, SweetAlert) {

    angular.extend($scope, {
      dados: {}
    });

    $scope.saveToken = function(){
      $http.post('/schroeder/token/', $scope.dados).success(function(data, status, headers, config) {
        SweetAlert.success(data.message, "", "<i class='glyphicon glyphicon-ok'></i>&nbsp;&nbsp;Ok");
        angular.extend($scope, {
          dados: {}
        });
      })
    };

  });
});
