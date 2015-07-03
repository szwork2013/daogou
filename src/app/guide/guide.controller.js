'use strict';

angular.module('guide',['ionic'])
.controller('guideCtrl',
function($rootScope,$scope,$log,$http,$state,$stateParams,daogouAPI,URLPort){
	// $log.debug('creatorderCtrl');
	// $http.get('assets/testdata/cart.json')
	// .success(function(data){
	// 	$log.debug(["success data",data]);
	// 	$scope.productData = data;
	// })
	// .error(function(data){
	// 	$log.debug(["error data",data]);
	// })

	var URLPort = URLPort();
	$scope.daogouProductListData = [];
	var pageindex = 1;
	var pagesize = 5;
	var guiderId = $rootScope.GUIDID;
	// var guiderId = 145;
	var brandId = $stateParams.brandid;
	// var brandId = 1;
	$scope.hasMoreOrder = true;

	$http.get(URLPort+"/brands/"+brandId+"/guiders/"+guiderId+"/details")
	.success(function(data){
		console.log(["获取导购信息成功",data]);
		if(data.full_name.length>10){
			console.log("超长");
			data.full_name = data.full_name.substring(0,7);
			data.full_name +="...";
		}
		$scope.guiderData = data;
	})
	.error(function(data){
		console.log(["获取导购信息失败",data])
	})

	$http.get(URLPort+"/brands/"+brandId)
	.success(function(data){
		console.log(["获取品牌信息成功",data]);
		$scope.brandData = data;
	})
	.error(function(data){
		console.log(["获取品牌信息失败",data])
	})



	function daogouProductListFunc(){
		daogouAPI.daogouProductList("/guider-shopwindows",{
			guiderId:guiderId,
			brandId:brandId,
			page:pageindex,
			per_page:pagesize
		},function(data, status, headers, config){
			console.log(["查询导购商品列表成功",data]);
			console.log(["hasMoreOrder",$scope.hasMoreOrder])
			console.log(["pageindex",pageindex]);
			$scope.daogouProductListData = $scope.daogouProductListData.concat(data);
			
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

	daogouProductListFunc();

	$scope.loadMoreData = function(){
		console.log(["loadMoreData"]);
		daogouProductListFunc();
	}

	$scope.$on('$stateChangeSuccess', function() {
		 if(pageindex>2){
	   		$scope.loadMoreData();
	   	 }
	 });



	$scope.productDetail = function(id){
		$state.go("productDetail",{detailId:id});
	}
})
;