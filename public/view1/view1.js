'use strict';

angular.module('myApp.view1', ['ngRoute', 'btford.socket-io'])

.factory('socket', function (socketFactory) {
	console.log(socketFactory)
  return socketFactory({
      ioSocket: io.connect('52.62.15.174:81')
 });
})

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', [function(socketFactory) {

var socket = new socketFactory({
      ioSocket: io.connect('52.62.15.174:81')
 });

	 socket.on('some event', function () {
	    $scope.bar = moment().now();
	  });		



}]);