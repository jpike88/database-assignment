'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.version',
  'btford.socket-io'
])

.factory('socket', function (socketFactory) {
  return socketFactory({
    ioSocket: io.connect('52.62.15.174:8001')
  });
})

.controller('View1Ctrl', function($scope, socket, $interval, $timeout) {


	$scope.role = 'ba'


		var cy = cytoscape({
			userZoomingEnabled: false,
			zoomingEnabled: false,
			userPanningEnabled: false,
			panningEnabled: false,
		  container: document.getElementById('cy'),
		  style: cytoscape.stylesheet()
		  .selector('.trainPresent1').css({
		                        'background-image': 'images/train-icon1.png',
		                        'background-fit': 'contain',
		                        'background-color': 'white'
		                      })
		  .selector('.trainPresent2').css({
		                        'background-image': 'images/train-icon2.png',
		                        'background-fit': 'contain',
		                        'background-color': 'white'
		                      })
		  .selector('.trainPresent3').css({
		                        'background-image': 'images/train-icon3.png',
		                        'background-fit': 'contain',
		                        'background-color': 'white'
		                      }),

		});



	 $scope.switchRole = function(role){
	 	$scope.role = role;
	 	updateData();
	 }

	 $scope.addPersonToTrain = function(train, station){
	 	socket.emit('addPersonToTrain', {train:train, station:station});
	 }

	 $scope.removePersonFromTrain = function(train, station){
	 	socket.emit('removePersonFromTrain', {train:train, station:station});
	 }

	 socket.on('addPersonToTrain', function (req) {
	 	$timeout(function(){
	 		$scope.trains[req.train - 1].totalOnboard++;
	 	});
	 });

	 socket.on('removePersonFromTrain', function (req) {
	 	$timeout(function(){
	 		$scope.trains[req.train - 1].totalOnboard--;
	 	});
	 });
	 
	 // update loop
	 var updateData = function(){
	 	// queries	
	 	if($scope.role == 'ba'){
	 		// make the following calls.
	 		socket.emit('getBusinessAnalystData');
	 	}
		
		if($scope.role == 'operator'){
	 		// make the following calls.
	 		socket.emit('getOperatorData');	
	 	}

	 };
	updateData();
	$interval(updateData, 5000);

	socket.on('getBusinessAnalystData', function (data) {
	    $timeout(function(){
	    	if(data.trains.length == 3){
	    	$scope.trains = data.trains;
	    	}	
	    	$scope.analytics = data.analytics;
	    	cy.json(data.nodeMap);

	    })
	    
	 });	

	 	socket.on('getOperatorData', function (data) {
	    
	    $timeout(function(){
	    	if(data.trains.length == 3){
	    	$scope.trains = data.trains;
	    	}
	    	$scope.stations = data.stations;
	    	$scope.customers = data.customers;
	    	cy.json(data.nodeMap);
	    })
	 });	

});
