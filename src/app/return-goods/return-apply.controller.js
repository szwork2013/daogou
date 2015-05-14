'use strict';

angular.module('goodsReturn',['ionic'])
.controller('returnApplyCtrl',['$scope','$log','$http',function($scope,$log,$http){
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