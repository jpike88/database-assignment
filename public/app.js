'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.version',
  'btford.socket-io'
])

.factory('socket', function (socketFactory) {
  return socketFactory({
    ioSocket: io.connect('52.62.15.174:81')
  });
})

.controller('View1Ctrl', function($scope, socket) {


		var cy = cytoscape({
		  container: document.getElementById('cy'),
		  style: cytoscape.stylesheet()
		  .selector('.trainPresent').css({
		                        'background-image': 'images/train-icon.png',
		                        'background-fit': 'contain',
		                        'background-color': 'white'
		                      }),

		});


	 socket.on('some event', function (msg) {
	    $scope.bar = moment.now();
	    cy.json(msg.nodeMap);
	 });		



});
