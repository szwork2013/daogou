'use strict';

var order = angular.module('orderList',['ionic']);
order.controller('orderListCtrl',['$rootScope','$scope', '$log', '$http', 'URLPort', 'daogouAPI',function($rootScope,$scope,$log,$http,URLPort,daogouAPI){


//==============================阅完可删除,若不删,留作纪念,我也不反对线====================================
	//这个切换其实是2个页面 不是页面内切换的
	//一个是购物车页cart   应该是订单列表  order → order-list
//==============================阅完可删除,若不删,留作纪念,我也不反对线====================================
var URLPort = URLPort();

// $http.get(URLPort+"/trades/users/18?page=1&per_page=10&show_orders=true")
// .success(function(data){
// 	console.log(["查询消费者的订单列表成功",data]);
// 	$scope.productListData = data;
// 	for(var i in $scope.productListData){
// 		if($scope.productListData[i].status==="WAIT_BUYER_PAY"){
// 			$scope.productListData[i].statusCN = "待付款";
// 		}
// 	}
// })
// .error(function(data){
// 	console.log(["查询消费者的订单列表失败",data]);
// })
console.log(["$rootScope.curUserID",$rootScope.curUserID]);
// $rootScope.curUserID = 18;
$scope.productListData = [];
var pageindex = 1;
var pagesize = 5;
$scope.hasMoreOrder = true;
function getOrderListFunc(){
	daogouAPI.getOrderList("/trades/users/"+$rootScope.curUserID,{
		page:pageindex,
		per_page:pagesize,
		show_orders:true
	},function(data, status, headers, config){
		console.log(["查询消费者的订单列表成功",data]);
		console.log(["hasMoreOrder",$scope.hasMoreOrder])
		console.log(["pageindex",pageindex])
		for(var i in data){
			data[i].testnummmmmmmmmm = parseInt((pageindex-1)*pagesize) + parseInt(i)+1 ; //测试后期删掉
	 		if(data[i].status==="WAIT_BUYER_PAY"){
				data[i].statusCN = "待付款";
			}
	    }

		$scope.productListData = $scope.productListData.concat(data);
		
	    console.log(["data.length",data.length])
	    if(data.length>=pagesize){
	    	pageindex++;
	    	console.log(["pageindex+++++++",pageindex])
	    }else{
	    	$scope.hasMoreOrder = false;
	    	console.log(["hasMoreOrder",$scope.hasMoreOrder])
	    }

	    $scope.$broadcast('scroll.infiniteScrollComplete');
	},function(data, status, headers, config){
		console.log(["查询消费者的订单列表失败",data]);
	});
}

getOrderListFunc();


$scope.refreshproductList = function(){
	console.log(["refreshproductList"]);
}

$scope.loadMoreData = function(){
	console.log(["loadMoreData"]);
	getOrderListFunc();
}
$scope.$on('$stateChangeSuccess', function() {
   $scope.loadMoreData();
 });

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