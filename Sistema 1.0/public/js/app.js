define(['angularAMD', 'angular-route'], function (angularAMD) {
  var app = angular.module("app", ['ngRoute']);

  app.factory("SweetAlert", function(){
    var swal = window.swal,
      self = {
        swal: function(arg1,arg2,arg3,arg4,arg5){
          swal(arg1,arg2,arg3,arg4,arg5)
        },
        success: function(title,message,text){
          swal(title,message,"success", text, 0)
        },
        error: function(title,message,text){
          swal(title,message,"error", text, 1)
        },
        warning:function(title,message,text){
          swal(title,message,"warning", text, 0)
        },
        info: function(title,message,text){
          swal(title,message,"info", text, 0)
        }
      };
    return self;
  });

  app.config(function ($routeProvider, $locationProvider, $httpProvider) {
  	$locationProvider.html5Mode(true);
   	$locationProvider.hashPrefix = '!';

    $routeProvider.when("/home", angularAMD.route({
      templateUrl: '/views/home/' + Math.random(),
      controller: 'home',
      controllerUrl: 'js/home/controller'
    })).when("/meus-dados", angularAMD.route({
      templateUrl: '/views/user/' + Math.random(),
      controller: 'user',
      controllerUrl: 'js/user/controller'
    })).when("/tempo-real", angularAMD.route({
      templateUrl: '/views/arduino/temporeal/' + Math.random(),
      controller: 'tempoReal',
      controllerUrl: 'js/arduino/temporeal/controller'
    })).when("/sensores", angularAMD.route({
      templateUrl: '/views/arduino/sensores/' + Math.random(),
      controller: 'sensores',
      controllerUrl: 'js/arduino/sensores/controller'
    })).when("/logs", angularAMD.route({
      templateUrl: '/views/log/' + Math.random(),
      controller: 'log',
      controllerUrl: 'js/log/controller'
    })).when("/new-acao", angularAMD.route({
      templateUrl: '/views/acao/new/' + Math.random(),
      controller: 'new-acao',
      controllerUrl: 'js/acao/new/controller'
    })).when("/acao", angularAMD.route({
      templateUrl: '/views/acao/' + Math.random(),
      controller: 'acao',
      controllerUrl: 'js/acao/controller'
    })).when("/new-sensor", angularAMD.route({
      templateUrl: '/views/sensor/new/' + Math.random(),
      controller: 'new-sensor',
      controllerUrl: 'js/sensor/new/controller'
    })).when("/sensor", angularAMD.route({
      templateUrl: '/views/sensor/' + Math.random(),
      controller: 'sensor',
      controllerUrl: 'js/sensor/controller'
    })).when("/new-token", angularAMD.route({
      templateUrl: '/views/token/new/' + Math.random(),
      controller: 'new-token',
      controllerUrl: 'js/token/new/controller'
    })).when("/token", angularAMD.route({
      templateUrl: '/views/token/' + Math.random(),
      controller: 'token',
      controllerUrl: 'js/token/controller'
    })).otherwise({redirectTo: "/home"});

    var httpStatusInterceptor = function($window){
      function success(response){
        if(response.data.error == 1){
          return error(response);
        }
        if(response.data.error == 2){
          return info(response);
        }
        return response;
      }
      function error(response) {
        return window.swal("Ops! Ocorreu algum erro.","","error", "<i class='glyphicon glyphicon-log-out'></i>&nbsp;&nbsp;Fechar", 1);
      }
      function info(response) {
        return window.swal(response.data.message,"","error", "<i class='glyphicon glyphicon-ok'></i>&nbsp;&nbsp;Ok", 0);
      }
      return function(promise) {
        return promise.then(success, error);
      }
    }
    $httpProvider.responseInterceptors.push(httpStatusInterceptor);
  });

  app.run(function($rootScope, $templateCache) {
    $rootScope.$on('$viewContentLoaded', function() {
      $templateCache.removeAll();
    });
  });



  app.controller("homeCtrl", function($scope, $window){
    $scope.sair = function(){
      $window.location.href = "/logout";
    };
  });

  return angularAMD.bootstrap(app);
});