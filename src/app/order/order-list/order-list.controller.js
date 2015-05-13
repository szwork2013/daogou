'use strict';

var order = angular.module('order',['ionic']);
order.controller('orderListCtrl',['$scope', '$log', '$http', function($scope,$log,$http){


//==============================阅完可删除,若不删,留作纪念,我也不反对线====================================
	//这个切换其实是2个页面 不是页面内切换的
	//一个是购物车页cart   应该是订单列表  order → order-list
//==============================阅完可删除,若不删,留作纪念,我也不反对线====================================



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
	$http.get('assets/testdata/cart.json')
	.success(function(data){
		$log.debug(["success data",data]);
		$scope.productData = data;
	})
	.error(function(data){
		$log.debug(["error data",data]);
	})
//点击+ - 增减商品数
	$scope.delNum = function(cls){
		var n = parseInt($("."+cls+"").val());
		$log.debug(n)
		n--;
		n=n<0?0:n;
		$("."+cls+"").val(n);
	}
	$scope.addNum = function(cls){
		var n = parseInt($("."+cls+"").val());
		$log.debug(n)
		n++;
		$("."+cls+"").val(n);
	}

    $scope.choose = false;
    $log.debug(['choooose',$scope.choose])


}]);