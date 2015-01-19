define(['js/app'], function (app) {
  app.controller('acao', function ($scope, $http, SweetAlert) {

    $http.get('/schroeder/acao/').success(function(data, status, headers, config) {
      angular.extend($scope, {
        dados: data
      });
    });

    $scope.getStatusDestino = function(obj){
      if(obj.statusDestino == "false"){
        return obj.sensorDestino.statusOff;
      }
      return obj.sensorDestino.statusOn;
    };

    $scope.getStatusOrigem = function(obj){
      if(obj.statusDestino == "false"){
        return obj.sensorOrigem.statusOff;
      }
      return obj.sensorOrigem.statusOn;
    };

    $scope.remover = function(obj, index) {
      $http.delete('/schroeder/acao/' + obj.id).success(function(data, status, headers, config) {
        SweetAlert.success("Ação removida com sucesso!", "", "<i class='glyphicon glyphicon-ok'></i>&nbsp;&nbsp;Ok");
        $scope.dados.splice(index, 1);
      })
    };

  });
});
