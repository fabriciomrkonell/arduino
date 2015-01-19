require.config({
  baseUrl: "",
  paths: {
    'angular': 'lib/angular/angular.min',
    'angular-route': 'lib/angular-route/angular-route.min',
    'angularAMD': 'lib/angular-amd/angularAMD.min',
    'socketIO': 'lib/socketio/socket.io',
  },
  shim: {
    'angularAMD': ['angular'],
    'angular-route': ['angular']
  },
  deps: ['js/app', 'socketIO']
});