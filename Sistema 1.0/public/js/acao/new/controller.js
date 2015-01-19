define(['js/app'], function (app) {
  app.controller('new-acao', function ($scope, $http, SweetAlert) {

    angular.extend($scope, {
      sensores: {},
      dados: {
        statusOrigem: "true",
        statusDestino: "true",
        sensorDestino: null
      }
    });

    $http.get('/schroeder/sensores/').success(function(data, status, headers, config) {
      if(data.length > 0){
        $scope.dados.sensorOrigem = data[0].id;
        if(data.length > 1){
          $scope.dados.sensorDestino = data[1].id;
        }
      }
      angular.extend($scope, {
        sensores: data
      });
    });

    $scope.mudarSensorOrigem = function(id){
      var passouOrigem = false;
      var passouDestino = false;
      for(var i = 0; i < $scope.sensores.length; i++){
        if($scope.sensores[i].id == id){
          passouOrigem == true;
          if(passouDestino == true){
            i = $scope.sensores.length;
          }
        }else{
          if(passouDestino == false){
            $scope.dados.sensorDestino = $scope.sensores[i].id;
            passouDestino = true;
            if(passouOrigem == true){
              i = $scope.sensores.length;
            }
          }
        }
      }
    };

    $scope.getStatusOrigemOn = function(){
      for(var i = 0; i< $scope.sensores.length; i++){
        if($scope.sensores[i].id == $scope.dados.sensorOrigem){
          return $scope.sensores[i].statusOn;
        }
      }
    };

    $scope.getStatusOrigemOff = function(){
      for(var i = 0; i< $scope.sensores.length; i++){
        if($scope.sensores[i].id == $scope.dados.sensorOrigem){
          return $scope.sensores[i].statusOff;
        }
      }
    };

    $scope.getStatusDestinoOn = function(){
      for(var i = 0; i< $scope.sensores.length; i++){
        if($scope.sensores[i].id == $scope.dados.sensorDestino){
          return $scope.sensores[i].statusOn;
        }
      }
    };

    $scope.getStatusDestinoOff = function(){
      for(var i = 0; i< $scope.sensores.length; i++){
        if($scope.sensores[i].id == $scope.dados.sensorDestino){
          return $scope.sensores[i].statusOff;
        }
      }
    };


    $scope.saveAcao = function(){
      $http.post('/schroeder/acao/', $scope.dados).success(function(data, status, headers, config) {
        SweetAlert.success(data.message, "", "<i class='glyphicon glyphicon-ok'></i>&nbsp;&nbsp;Ok");
      })
    };

  });
});
