'use strict';

angular.module('createOrder',['ionic'])
.controller('creatorderCtrl',['$scope','$log','$http',function($scope,$log,$http){
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
.controller('goodsShopCtrl',['$scope','$log','$http',function($scope,$log,$http){
	$log.debug('goodsShopCtrl');
	$http.get('assets/testdata/cart.json')
	.success(function(data){
		$log.debug(["success data",data]);
		$scope.productData = data;
	})
	.error(function(data){
		$log.debug(["error data",data]);
	})
}])
.controller('changeReceiveInfoCtrl',['$scope','$log','$http',function($scope,$log,$http){
	$log.debug('changeReceiveInfoCtrl');
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