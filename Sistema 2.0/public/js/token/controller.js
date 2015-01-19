define(['js/app'], function (app) {
  app.controller('token', function ($scope, $http, SweetAlert) {

    $http.get('/schroeder/token/').success(function(data, status, headers, config) {
      angular.extend($scope, {
        dados: data
      });
    })

    $scope.remover = function(obj, index) {
      $http.delete('/schroeder/token/' + obj.id).success(function(data, status, headers, config) {
        SweetAlert.success("Token removido com sucesso!", "", "<i class='glyphicon glyphicon-ok'></i>&nbsp;&nbsp;Ok");
        $scope.dados.splice(index, 1);
      })
    };

  });
});
