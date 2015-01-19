define(['js/app', 'socketIO'], function (app, socketIO) {
		app.controller('tempoReal', function ($scope, $http) {

    var socket = socketIO();

    angular.extend($scope, {
      dados: []
    });

    socket.on('new-medicao', function(obj){
      for(var i = 0; i < $scope.dados.length; i++){
        if(obj.TokenId == $scope.dados[i].id){
          $scope.dados[i].Sensor = obj;
          $scope.$apply();
        }
      }
    });

    $http.get('/medicoes').success(function(obj) {
      $scope.dados = obj;
    });

	 });
});
