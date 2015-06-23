'use strict';

var product = angular.module('product',['ionic']);
product.controller('productDetailCtrl',function($rootScope,$scope,$log,$http,$state,$stateParams,URLPort){
	// $rootScope.URLPort = "http://yunwan2.3322.org:57095";
	var URLPort = URLPort();


	$http.get(URLPort+"/items/"+$stateParams.detailId)
	
	// $http.get(URLPort+"/items/100003")

	// $http.get("assets/testdata/product-detail.json")

	.success(function(data){
		console.log(['获得商品详情成功',data]);
		$scope.productDetailData = data;
		$scope.productDetailData.buynum = 0;//买家购买数
		$scope.productDetailData.realquantity = 0;//剩余库存数量
		$scope.productDetailData.picUrlArr =  $scope.productDetailData.pic_url.split(',');//轮播图片url获取
		console.log(["$scope.productDetailData.picUrlArr",$scope.productDetailData.picUrlArr]);

		//$scope.productDetailData.content = $scope.productDetailData.content.substring(6,$scope.productDetailData.content.length-7);//content中间内容获取


		$log.debug(['$scope.productDetailData',$scope.productDetailData.skus]);
		
		console.log(["$scope.productDetailData.skus.length",$scope.productDetailData.skus.length])
		var propertyArr = $scope.productDetailData.skus[0].properties.split(';');//propertyArr.length规格种类
			$scope.productDetailData.specification = [];//$scope上添加的存放规格种类以及内容的数组。
			for(var idx in propertyArr){
				$scope.productDetailData.specification[idx] = {};
				$scope.productDetailData.specification[idx].key = "";//idx规格种类个数，//.key每个规格名//.val每个规格的值
				$scope.productDetailData.specification[idx].val = "";
		}
		
		for(var id in $scope.productDetailData.skus){//sku个数
			var flag = true;
			var propertyArr = $scope.productDetailData.skus[id].properties.split(';');//propertyArr.length参数种类
			$scope.productDetailData.realquantity += $scope.productDetailData.skus[id].real_quantity;//累加所有商品数量
			for(var tz in propertyArr){//一个规格种类一个规格种类来
				var paraArr = propertyArr[tz].split(':');//取每个规格的规格名和规格值
				var iarray = $scope.productDetailData.specification[tz].val.split(" ");
				var ilength=iarray.length-1;
				for(var i=0; i<ilength;i++){//检测新加入的规格值是否已经存在，如果存在则不加入，避免重复
					if(iarray[i] === paraArr[paraArr.length-1]){//paraArr[paraArr.length-1]要加入的参数，
                         flag = false;
					}
				}
				if(flag){
					$scope.productDetailData.specification[tz].val += paraArr[paraArr.length-1]+" ";//规格值
					$log.debug(['$scope.productDetailData.specification',$scope.productDetailData.specification]);
				}else{
					flag = true;//当取同一个sku时，后面的规格需要把flag置为true
				}
			
				$scope.productDetailData.specification[tz].array = $scope.productDetailData.specification[tz].val.split(" ");
				$scope.productDetailData.specification[tz].array.splice($scope.productDetailData.specification[tz].array.length-1,1);
				$scope.productDetailData.specification[tz].key = paraArr[paraArr.length-2];//规格名
				
			}
		}

		$scope.productDetailData.buynum = $scope.productDetailData.realquantity;
	})
	.error(function(data){
		console.log(['获得商品详情失败',data]);
	});


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
//打开选取商品尺寸 颜色，初始化商品规格状态，有些已经无货了，控件就不可选
    function propertyMenu(){
    	$(".mengban").show();
    	$(".chooseProductInfoWarp").show();
    	for(var ii in $scope.productDetailData.specification){
    		console.log($scope.productDetailData.specification[ii].array);
    		for(var cc in $scope.productDetailData.specification[ii].array){
    			var total = 0;
    			console.log($scope.productDetailData.specification[ii].array[cc]);

    			for(var dd in $scope.productDetailData.skus){
    				if($scope.productDetailData.skus[dd].properties.indexOf($scope.productDetailData.specification[ii].array[cc])>0){
    					//检测商品每个skus 是否包含 规格值，如果包含查其库存，库存总量为0 则不可选
    					console.log("real_quantity:"+$scope.productDetailData.skus[dd].real_quantity);
    					total += parseInt($scope.productDetailData.skus[dd].real_quantity);
    					console.log("total:"+total);
    				}
    			}

    			if(total === 0){
    					$("input").each(function(){
    						if($(this).val()===$scope.productDetailData.specification[ii].array[cc]){
    							console.log("youyouyou");
    							console.log("$(this).val():"+$(this).val());
    							console.log($scope.productDetailData.specification[ii].array[cc]);
    							$(this).attr({"disabled":"disabled"});
    							$(this).next().addClass("invalid");
    						}
    					})
    			}

    		}   
    	}
    }
//当点击购物车时让设置goCart 和 goOrder 的参数使参数面板的下一步 跳转到购物车还是生成订单
	$scope.propertyShowCart =function(){
		propertyMenu();
		$scope.goCart = false;
		$scope.goOrder = true;
	}
	$scope.propertyShowOrder =function(){
		propertyMenu();
		$scope.goCart = true;
		$scope.goOrder = false;
	}


//关闭选取商品尺寸 颜色
	$scope.propertyClose = function(){
		$(".mengban").hide();
		$(".chooseProductInfoWarp").hide();
	}
//点击+ - 增减商品数
	$scope.delNum = function(num){
		console.log(["$scope.productDetailData.realquantity",$scope.productDetailData.realquantity]);
		console.log(["$scope.productDetailData.buynum",$scope.productDetailData.buynum]);
		if($scope.productDetailData.buynum>1){
			$scope.productDetailData.realquantity++;
			$scope.productDetailData.buynum--;
		}
	}
	$scope.addNum = function(num){
		console.log(["$scope.productDetailData.realquantity",$scope.productDetailData.realquantity]);
		console.log(["$scope.productDetailData.buynum",$scope.productDetailData.buynum]);
		if($scope.productDetailData.realquantity>0){
			$scope.productDetailData.realquantity--;
			$scope.productDetailData.buynum++;
		}
	}
//选择产品规格，显示是否有剩余
    $scope.checkSku = function(name,index){//name传递过来input的规格如 M L, index传递过来的规格项目名称 如尺码 颜色
    	// console.log($("input[name="+name+"]:checked").val());
    	console.log("name:"+name);
    	console.log("index:"+index);
    	for(var bb in $scope.productDetailData.specification){
    		if($scope.productDetailData.specification[bb].key===index){
    			for(var cc in $scope.productDetailData.specification){
		    				if(bb!=cc){
		    					console.log("cc:"+cc);
		    					console.log($scope.productDetailData.specification[cc].array);
		    					var key = $scope.productDetailData.specification[cc].key;
		    						console.log("key:"+key);
		    						$("input[name="+key+"]").removeAttr("disabled");
		    						$("input[name="+key+"]").next().removeClass("invalid");
		    					for(var dd in $scope.productDetailData.specification[cc].array){
		    						var total = 0;
		    						for(var ee in $scope.productDetailData.skus){//如果该sku里含有传递过来的name且含有其他参数值，查询器剩余数量？？？这儿好像有问题,暂时不支持3种规格，前面有选中的呢
		    							if(($scope.productDetailData.skus[ee].properties.indexOf(name)>0)&&($scope.productDetailData.skus[ee].properties.indexOf($scope.productDetailData.specification[cc].array[dd])>0)){
		    								total += parseInt($scope.productDetailData.skus[ee].real_quantity);
		    							}
		    						}

		    						if(total === 0){
		    								$("input").each(function(){
		    									if($(this).val()===$scope.productDetailData.specification[cc].array[dd]){
		    										console.log("youyouyou");
		    										console.log("$(this).val():"+$(this).val());
		    										console.log($scope.productDetailData.specification[cc].array[dd]);
		    										$(this).attr({"disabled":"disabled"});
		    										$(this).next().removeClass("ichoosed").addClass("invalid");
		    									}
		    								})
		    						}
		    					}

    						}
    			}
    			
    		}

            var remain = true;//所有的都选中，在sku.properties中找到和所选中条件相同的,特出现存量
            var strInput = "";
    		for(var nn in $scope.productDetailData.specification){
    			console.log("numnum"+$("input[name="+$scope.productDetailData.specification[nn].key+"]:checked").val());
    			if($("input[name="+$scope.productDetailData.specification[nn].key+"]:checked").val()==="undefined"){
    				remain = false;
    			}else{
    				strInput +=$("input[name="+$scope.productDetailData.specification[nn].key+"]:checked").val();
    			}
    			console.log("strInput:"+strInput);
    		}
    		if(remain){	
				
				for(var id in $scope.productDetailData.skus){//sku个数
					var strSku ="";
					var propertyArr = $scope.productDetailData.skus[id].properties.split(';');//propertyArr.length参数种类
					for(var tz in propertyArr){
						var paraArr = propertyArr[tz].split(':');//取参数名和参数值
						strSku+=paraArr[paraArr.length-1];
					}
					if(strSku===strInput){
						$scope.productDetailData.realquantity = $scope.productDetailData.skus[id].real_quantity;
						$scope.productDetailData.skuid = $scope.productDetailData.skus[id].sku_id;
						$scope.productDetailData.buynum = 0;
						$scope.productDetailData.skudetail = "";
						var skuArray = $scope.productDetailData.skus[id].properties.split(";");
						for (var ff in skuArray){
							var skuffArray = skuArray[ff].split(":");
							$scope.productDetailData.skudetail += skuffArray[skuffArray.length-2]+":"+skuffArray[skuffArray.length-1]+";";
						}
						$scope.productDetailData.skudetail=$scope.productDetailData.skudetail.substring(0,$scope.productDetailData.skudetail.length-1);
						console.log(["$scope.productDetailData.skudetail",$scope.productDetailData.skudetail]);

					}
				}
					 
				
    		}
    	}


    }
	
	$scope.goToOrder = function(){
		console.log(["$scope.productDetailData.brand_id111",$scope.productDetailData.brand_id])
		$state.go("creatorder",{
			title:$scope.productDetailData.title,
			price:$scope.productDetailData.price,
			skudetail:$scope.productDetailData.skudetail,
			skuid:$scope.productDetailData.skuid,
			num:$scope.productDetailData.buynum,
			freight:$scope.productDetailData.freight,
			brandid:$scope.productDetailData.brand_id
		});
	}




})

;