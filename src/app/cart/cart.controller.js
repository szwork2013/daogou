'use strict';

var cart = angular.module('cart',['ionic']);
cart.controller('cartCtrl',['$scope', '$log', '$http','$state','URLPort','$stateParams','daogouAPI','$rootScope', function($scope,$log,$http,$state,URLPort,$stateParams,daogouAPI,$rootScope){


//==============================阅完可删除,若不删,留作纪念,我也不反对线====================================
	//这个切换其实是2个页面 不是页面内切换的
	//一个是购物车页cart   应该是订单列表  order → order-list
//==============================阅完可删除,若不删,留作纪念,我也不反对线====================================

   


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
			for(var i in data){
				data[i].seleted = false;
			}
			$scope.cartProductListData = $scope.cartProductListData.concat(data);
                console.log(['datadatadatadatadatadatadata',data]);


            //获得当前购物车的物品属性
            var cartArr=$scope.cartProductListData[0].sku_properties_name.split(';');
            console.log(['cartArr',cartArr])
            console.log(['$scope.cartProductListData[0].sku_properties_name',$scope.cartProductListData[0].sku_properties_name])
            $scope.cartProductListData.specification=[];
            for(var idx in data){
                $scope.cartProductListData.specification[idx] = {};
                $scope.cartProductListData.specification[idx].key = "";
                $scope.cartProductListData.specification[idx].val = "";
                console.log(["SAAAAAAAAAAAAAAAA",$scope.cartProductListData.specification])
            }
            for(var id in data){//cartProductListData的数量
            var flag = true;
            var cartArr = $scope.cartProductListData[id].sku_properties_name.split(';');//cartArr.length参数种类
             console.log(['$scope.cartProductListData[id].sku_properties_name',$scope.cartProductListData[id].sku_properties_name])
            for(var tz in cartArr){//一个规格种类一个规格种类来
                var cartendArr = cartArr[tz].split(':');//取每个规格的规格名和规格值
                $scope.cartProductListData.specification[tz].val = cartendArr[cartendArr.length-1];//规格值
                $log.debug(['$scope.cartProductListData.specification',$scope.cartProductListData.specification]);
                $scope.cartProductListData.specification[tz].array = $scope.cartProductListData.specification[tz].val.split(" ");
                $scope.cartProductListData.specification[tz].array.splice($scope.cartProductListData.specification[tz].array.length-1,1);
                $scope.cartProductListData.specification[tz].key = cartendArr[cartendArr.length-2];//规格名
            }
        };


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
		$scope.cartProductListData[index].num--;
		$scope.cartProductListData[index].num = $scope.cartProductListData[index].num>0?$scope.cartProductListData[index].num:0;
	}
	$scope.addNum = function(index){
		$scope.cartProductListData[index].num++;
	}

	
   $scope.totalNum = 0;//购物车中选中商品总量
   $scope.totalFee = 0;//合计价格
   //通过点击选中圆圈选中
    $scope.changeCheck = function(index){
    	console.log(["indexindexindex",index])
    	if($scope.cartProductListData[index].seleted === true){
    		$scope.cartProductListData[index].seleted = false;
    	}else{
    		$scope.cartProductListData[index].seleted = true;
    	}
    	
    	
    	$scope.totalFee = 0;//合计价格
    	$scope.totalNum = 0;
    	$scope.ids = "";//选中商品id集合
    	
    	for(var i in $scope.cartProductListData){
    		if($scope.cartProductListData[i].seleted === true){
    			$scope.totalFee += parseFloat($scope.cartProductListData[i].total_fee);
    			$scope.totalNum++;
    			$scope.ids +=$scope.cartProductListData[i].id+",";
    		}
    		
    	}
    	$scope.ids = $scope.ids.substr(0,$scope.ids.length-1);
    	console.log(["$scope.ids",$scope.ids])
 		
 		
    }

    $scope.Allseleted = false;
     //全选全不选
    $scope.changeAll = function(){
    	console.log(["changeAll"]);
    	//选中与不选中 选中图标的转换
    	if($scope.Allseleted === false){
    		console.log("biangreen")
    		$scope.Allseleted = true;
    		for(var i in $scope.cartProductListData){
    			$scope.cartProductListData[i].seleted = true;
    			console.log(["$scope.cartProductListData[i].seleted",$scope.cartProductListData[i].seleted]);
    		}
    	}else{
    		console.log("biangray")
    		$scope.Allseleted = false;
    		for(var i in $scope.cartProductListData){
    		    $scope.cartProductListData[i].seleted = false;
    		}
    	}
    	//合计价格
    	 $scope.totalFee = 0;
    	 $scope.totalNum = 0;
    	 $scope.ids = "";//选中商品id集合
    	for(var i in $scope.cartProductListData){
    		if($scope.cartProductListData[i].seleted === true){
    			$scope.totalFee += parseFloat($scope.cartProductListData[i].total_fee);
    			$scope.totalNum++;
    			$scope.ids +=$scope.cartProductListData[i].id+",";
    		}
    		
    	}
    	$scope.ids = $scope.ids.substr(0,$scope.ids.length-1);
    	console.log(["$scope.ids",$scope.ids])
    }
    $scope.deleteCartProduct = function(){
    	console.log(["删除商品$scope.ids",$scope.ids]);
    	daogouAPI.deleteCartProduct({
			userid:userid,
			ids:$scope.ids
		},function(data, status, headers, config){
			console.log(["删除购物车商品成功",data]);
            $scope.cartProductListData = [];
            pageindex = 1;
            pagesize = 5;
            $scope.hasMoreOrder = true;
            cartProductListFunc();

		},function(data, status, headers, config){
			console.log(["删除购物车商品失败",data]);
		});
    }

    $scope.edithandle = true;
    $scope.finishhandle = false;
    console.log(["$scope.edit",$scope.edit]);
    console.log(["$scope.finish",$scope.finish]);
    $scope.edit = function(){
    	console.log(["编辑"]);
    	$scope.edithandle = false;
    	$scope.finishhandle = true;
    }
    $scope.finish = function(){
    	console.log(["完成啦"])
    	$scope.edithandle = true;
    	$scope.finishhandle = false;
    }



    //购物车 订单列表切换
    $scope.goOrderList = function(){
        console.log(["goOrderList  $stateParams.userid",$stateParams.userid]);
        $state.go("orderList",{"userid": $stateParams.userid});
    }
    
}]);