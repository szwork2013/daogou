'use strict';

angular.module('goodsReturn',['ionic'])
.controller('returnApplyCtrl',['$scope','$log','$http','checklocalimg',function($scope,$log,$http,checklocalimg){
	$http.get('assets/testdata/cart.json')
	.success(function(data){
		$log.debug(["success data",data]);
		$scope.productData = data;
	})
	.error(function(data){
		$log.debug(["error data",data]);
	})
	$scope.uploadImg =function(id){
		checklocalimg(function(data){
			$("#"+id+"").attr("src",data.src);
		})

	}
}])
;