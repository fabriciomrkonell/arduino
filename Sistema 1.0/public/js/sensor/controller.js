define(['js/app'], function (app) {
  app.controller('sensor', function ($scope, $http, SweetAlert) {

    $http.get('/schroeder/sensores/').success(function(data, status, headers, config) {
      angular.extend($scope, {
        dados: data
      });
    })

    $scope.remover = function(obj, index) {
      $http.delete('/schroeder/sensor/' + obj.id).success(function(data, status, headers, config) {
        SweetAlert.success("Sensor removido com sucesso!", "", "<i class='glyphicon glyphicon-ok'></i>&nbsp;&nbsp;Ok");
        $scope.dados.splice(index, 1);
      })
    };

    $scope.favorito = function(obj, index) {
      $http.put('/schroeder/sensor/favorito/' + obj.id).success(function(data, status, headers, config) {
        angular.extend($scope, {
          dados: data
       });
      })
    };

  });
});
