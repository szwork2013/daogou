'use strict';

var cart = angular.module('cart',['ionic']);
cart.controller('cartCtrl',['$scope', '$log', '$http','$state','URLPort', function($scope,$log,$http,$state,URLPort){


//==============================阅完可删除,若不删,留作纪念,我也不反对线====================================
	//这个切换其实是2个页面 不是页面内切换的
	//一个是购物车页cart   应该是订单列表  order → order-list
//==============================阅完可删除,若不删,留作纪念,我也不反对线====================================



	$scope.cart = 1;
	$scope.list = 0;
	// $scope.chooseCart=function(){
	// 	$scope.cart = 1;
	// 	$scope.list = 0;

	// }
	// $scope.chooseList=function(){
	// 	$scope.cart = 0;
	// 	$scope.list = 1;
	// 	$state.go("orderList");
	// }


	// $http.get('assets/testdata/cart.json')
	// .success(function(data){
	// 	$log.debug(["success data",data]);
	// 	$scope.productData = data;
	// })
	// .error(function(data){
	// 	$log.debug(["error data",data]);
	// })
    var URLPort = URLPort();
	$http.get(URLPort+"/accounts/current")//获得当前登录账号
	.success(function(data){
		console.log(["用户已登录,获得当前登录用户账号",data]);
        console.log(["$scope.loginhandle",$scope.loginhandle]);
        $scope.curUserId = data.id;
		$http.get(URLPort+"/users/"+$scope.curUserId+"/shopping-carts")
        .success(function(data){
        	$scope.productData = data;
        	console.log(["获取购物车列表成功",data]);
 	   	
        })
        .error(function(data){
        	console.log(["获取购物车列表失败",data]);
        })
	})
	.error(function(data){
		//如果未登录,显示登录框，进行登录
		console.log(["用户未登录,没获得当前登录用户账号",data]);
		$scope.login = true;
	})
//点击+ - 增减商品数
	$scope.delNum = function(index){
		$scope.productData[index].num--;
		$scope.productData[index].num = $scope.productData[index].num>0?$scope.productData[index].num:0;
	}
	$scope.addNum = function(index){
		$scope.productData[index].num++;
	}

   
    $scope.changeCheck = function(index){
    	console.log(["indexindexindex",index])
 		if($(".selected-img").eq(index).hasClass("graygou")){
 			console.log("biangreen")
 			$(".selected-img").eq(index).removeClass("graygou");
 			$(".selected-img").eq(index).addClass("greengou");
 		}else{
 			console.log("biangray")
 			$(".selected-img").eq(index).removeClass("greengou");
 			$(".selected-img").eq(index).addClass("graygou");
 		}
 		
    }


    $scope.edit = true;
    $scope.finish = false;

}]);