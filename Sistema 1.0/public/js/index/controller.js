angular.module('schroeder', ['ngResource']).controller('schroederCtrl', ['$scope', 'Login', '$window', '$timeout', 'User', '$http', function ($scope, Login, $window, $timeout, User, $http) {

  angular.extend($scope, {
    view: 1,
    email: "",
    password: "",
    nomeRegister: "",
    emailRegister: "",
    passwordRegister: "",
    showMessagem: false,
    btnLogin: false,
    btnRegister: false,
    error: ""
  })

  $scope.voltar = function(){
    angular.extend($scope, {
      view: 1,
      email: "",
      password: "",
      nomeRegister: "",
      emailRegister: "",
      passwordRegister: "",
      showMessagem: false,
      btnLogin: false,
      btnRegister: false,
      error: ""
    });
  };

  $scope.irRegistrar = function(){
    angular.extend($scope, {
      view: 2,
      email: "",
      password: "",
      nomeRegister: "",
      emailRegister: "",
      passwordRegister: "",
      showMessagem: false,
      btnLogin: false,
      btnRegister: false,
      error: ""
    });
  };

  $scope.logar = function(){
    angular.extend($scope, {
      btnLogin: true
    });
    Login.save({ username: $scope.email, password: $scope.password },
    function (data) {
      if(!!data.success){
        $window.location.href = "/home";
      }else{
        angular.extend($scope,{
          showMessagem: true,
          error: "Usuário inválido!"
        });
        $timeout(function(){
          angular.extend($scope,{
            showMessagem: false,
            btnLogin: false,
            error: ""
          });
        }, 3000)
      }
    });
  };

  $scope.registrar = function(){
     angular.extend($scope, {
      btnRegister: true
    });
    User.save({ nome: $scope.nomeRegister, email: $scope.emailRegister, password: $scope.passwordRegister },
    function (data) {
      if(data.error){
        angular.extend($scope,{
          showMessagem: true,
          error: data.error
        });
        $timeout(function(){
          angular.extend($scope,{
            showMessagem: false,
            btnRegister: false,
            error: ''
          });
        }, 3000)
      }else{
        $scope.voltar();
      }
    });
  };
}]).factory('Login', ['$resource', function ($resource) {
  return $resource('schroeder/login/');
}]).factory('User', ['$resource', function ($resource) {
  return $resource('schroeder/users/');
}]);
