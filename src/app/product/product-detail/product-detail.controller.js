'use strict';

angular.module('daogou')
.controller('productDetailCtrl',function($scope,$log){

	$scope.productparam=[
		{param:'A'},
		{param:'B'},
		{param:'C'},
		{param:'D'},
		{param:'E'},
		{param:'F'},
		{param:'G'},
		{param:'H'},
		{param:'I'}
	];


	$log.debug('productDetailCtrl');
})
;