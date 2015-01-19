define(['js/app'], function (app) {
  app.controller('home', function ($scope, $http) {

    angular.extend($scope, {
      dados: {}
    });

    $http.get('/schroeder/users/info').success(function(data) {
      angular.extend($scope, {
        dados: data
      });
    });
  });
});
