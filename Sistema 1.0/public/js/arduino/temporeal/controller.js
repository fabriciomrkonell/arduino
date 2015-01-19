define(['js/app', 'socketIO'], function (app, socketIO) {
		app.controller('tempoReal', function ($scope, $http) {


      var socket = socketIO();

      socket.on('update-sensor', function(obj){
        for(var i = 0; i < $scope.dados.length; i++){
          if($scope.dados[i].id == obj.id){
            $scope.dados[i] = obj;
          }
        }
        $scope.$apply();
      });

			$http.get('/schroeder/sensores/').success(function(data, status, headers, config) {
      	angular.extend($scope, {
	        dados: data
      	});
    	})

    	$scope.toogle = function(obj){
    		$http.put('/schroeder/sensor/' + obj.id, { password: $scope.clientePassword });
    	};

	 });
});
