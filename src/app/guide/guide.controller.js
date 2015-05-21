'use strict';

angular.module('guide',['ionic'])
.controller('guideCtrl',['$scope','$log','$http',function($scope,$log,$http){
	$log.debug('creatorderCtrl');
	$http.get('assets/testdata/cart.json')
	.success(function(data){
		$log.debug(["success data",data]);
		$scope.productData = data;
	})
	.error(function(data){
		$log.debug(["error data",data]);
	})
}])
;