'use strict';

var cart = angular.module('cart',['ionic']);
cart.controller('cartCtrl',['$scope', '$log', '$http','$state','URLPort','$stateParams','daogouAPI', function($scope,$log,$http,$state,URLPort,$stateParams,daogouAPI){


//==============================阅完可删除,若不删,留作纪念,我也不反对线====================================
	//这个切换其实是2个页面 不是页面内切换的
	//一个是购物车页cart   应该是订单列表  order → order-list
//==============================阅完可删除,若不删,留作纪念,我也不反对线====================================



	$scope.cart = 1;
	$scope.list = 0;
    var URLPort = URLPort();

    $scope.cartProductListData = [];
    var pageindex = 1;
    var pagesize = 5;
    $scope.hasMoreOrder = true;
    var userid = $stateParams.userid;
    var brandid = $stateParams.brandid;
    console.log(["userid",userid]);
    console.log(["brandid",brandid]);
	function cartProductListFunc(){
		daogouAPI.shopcart({
			userid:userid,
			brand_id:brandid,
			page:pageindex,
			per_page:pagesize
		},function(data, status, headers, config){
			console.log(["查询导购商品列表成功",data]);
			console.log(["hasMoreOrder",$scope.hasMoreOrder])
			console.log(["pageindex",pageindex]);
			$scope.cartProductListData = $scope.cartProductListData.concat(data);
			
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
			console.log(["查询导购商品列表失败",data]);
		});
	}

	cartProductListFunc();

	$scope.loadMoreData = function(){
		console.log(["loadMoreData"]);
		cartProductListFunc();
	}

	$scope.$on('$stateChangeSuccess', function() {
		 if(pageindex>2){
	   		$scope.loadMoreData();
	   	 }
	 });

	$http.get(URLPort+"/brands/"+brandid)
	.success(function(data){
		console.log(["获取品牌信息成功",data]);
		$scope.brandData = data;
	})
	.error(function(data){
		console.log(["获取品牌信息失败",data])
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