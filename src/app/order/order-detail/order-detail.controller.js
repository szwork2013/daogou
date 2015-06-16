'use strict';

var order = angular.module('order',['ionic']);
order.controller('orderDetailCtrl',['$scope', '$log', '$http','URLPort', 'daogouAPI', '$state', '$stateParams',function($scope,$log,$http,URLPort,daogouAPI,$state,$stateParams){


//==============================阅完可删除,若不删,留作纪念,我也不反对线====================================
	//这个切换其实是2个页面 不是页面内切换的
	//一个是购物车页cart   应该是订单列表  order → order-list
//==============================阅完可删除,若不删,留作纪念,我也不反对线====================================
var URLPort = URLPort();
console.log(["$stateParams.tid",$stateParams.tid])
$http.get(URLPort+"/trades/"+$stateParams.tid)
.success(function(data){
	console.log(["获取订单详情成功",data]);

})
.error(function(data){
	console.log(["获取订单详情失败",data]);
})



$http.get('assets/testdata/cart.json')
.success(function(data){
	$log.debug(["success data",data]);
	$scope.productData = data;
})
.error(function(data){
	$log.debug(["error data",data]);
})


}]);