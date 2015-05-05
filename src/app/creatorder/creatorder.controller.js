'use strict';

angular.module('daogou')
.controller('creatorderCtrl',function($scope,$log){

	$scope.products=[
		{name:'A商品'},
		{name:'B商品'}
	];


	$log.debug('creatorderCtrl');
})
;