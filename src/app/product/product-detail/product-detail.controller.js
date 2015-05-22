'use strict';

var product = angular.module('product',['ionic']);
product.controller('productDetailCtrl',['$scope','$log','$http',function($scope,$log,$http){
	$scope.productparam=[
		{param:'A'},
		{param:'B'},
		{param:'C'},
		{param:'D'},
		{param:'E'},
		{param:'F'},
		{param:'G'},
		{param:'H'},
		{param:'I'}
	];


	$log.debug('productDetailCtrl');

//点击导购头像出现个人中心，导购橱窗，购物车，以及关闭
	$scope.showmenu = function(){
		if(parseInt($(".daogou").css("height"))<100){
			$(".daogou").animate({"height":"180"},100);
			$(".redPoint").hide();
		}else{
			$(".daogou").animate({"height":"46"},100);
		}
	}
//打开选取商品尺寸 颜色
	$scope.propertyShow =function(){
		$(".mengban").show();
		$(".chooseProductInfoWarp").show();
	}
//关闭选取商品尺寸 颜色
	$scope.propertyClose = function(){
		$(".mengban").hide();
		$(".chooseProductInfoWarp").hide();
	}
//点击+ - 增减商品数
	$scope.delNum = function(num){
		var n = parseInt(num);
		$log.debug(n)
		n--;
		n=n>0?n:0;
		$scope.productDetailData.quantity = n;
	}
	$scope.addNum = function(num){
		var n = parseInt(num);
		$log.debug(n)
		n++;
		$scope.productDetailData.quantity = n;
		
	}

	// function apiproductDetail(id){

	// 	api("items",id);

	// 	this.success=function function_name (callback) {
	// 		callback(data);
	// 	}

	// }


	// apiproductDetail(id)
	// .success(function(){

	// })
	// error(function(){

	// })

	// $http.get("http://yunwan2.3322.org:57093/items/100030")
	$http.get("assets/testdata/product-detail.json")

	.success(function(data){
		console.log(['success',data]);
		$scope.productDetailData = data;

		$scope.productDetailData.picUrlArr =  $scope.productDetailData.pic_url.split(',');
		console.log(["$scope.productDetailData.picUrlArr",$scope.productDetailData.picUrlArr]);

		$scope.productDetailData.content = $scope.productDetailData.content.substring(6,$scope.productDetailData.content.length-7);

		$log.debug(['$scope.productDetailData',$scope.productDetailData.skus]);
		
		var propertyArr = $scope.productDetailData.skus[0].properties.split(';');//propertyArr.length参数种类
			$scope.productDetailData.specification = [];
			for(var idx in propertyArr){
				$scope.productDetailData.specification[idx] = {};
				$scope.productDetailData.specification[idx].key = "";//idx参数个数，//.key每个参数名//.val每个参数值
				$scope.productDetailData.specification[idx].val = "";
		}
		
		for(var id in $scope.productDetailData.skus){//sku个数
			var flag = true;
			var propertyArr = $scope.productDetailData.skus[id].properties.split(';');//propertyArr.length参数种类
			for(var tz in propertyArr){
				var paraArr = propertyArr[tz].split(':');//取参数名和参数值
				var iarray = $scope.productDetailData.specification[tz].val.split(" ");
				var ilength=iarray.length-1;
				for(var i=0; i<ilength;i++){
					console.log(["1111111111111111111",iarray[i]]);
					console.log(["2222222222222222222",paraArr[paraArr.length-1]]);
					if(iarray[i] === paraArr[paraArr.length-1]){
                         flag = false;
					}
					console.log(["3333333333333333333", flag]);
				}
				if(flag){
					$scope.productDetailData.specification[tz].val += paraArr[paraArr.length-1]+" ";//规格值
					$log.debug(['$scope.productDetailData.specification',$scope.productDetailData.specification]);
				}else{
					flag = true;
				}
			
				$scope.productDetailData.specification[tz].array = $scope.productDetailData.specification[tz].val.split(" ");
				$scope.productDetailData.specification[tz].array.splice($scope.productDetailData.specification[tz].array.length-1,1);
				console.log(["44444444444444444",$scope.productDetailData.specification[tz].val]);
				console.log(["55555555555555555",$scope.productDetailData.specification[tz].array]);
				$scope.productDetailData.specification[tz].key = paraArr[paraArr.length-2];//规格名
				
			}
		}
	})
	.error(function(data){
		console.log(['error',data]);
	});



}])
;