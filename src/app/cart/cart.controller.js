'use strict';

angular.module('daogou')
.controller('cartCtrl',function($scope,$log){
	$scope.cart = 1;
	$scope.list = 0;
	$scope.chooseCart=function(){
		$scope.cart = 1;
		$scope.list = 0;
	}
	$scope.chooseList=function(){
		$scope.cart = 0;
		$scope.list = 1;
	}


});