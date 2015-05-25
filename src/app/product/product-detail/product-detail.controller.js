'use strict';

var product = angular.module('product',['ionic']);
product.controller('productDetailCtrl',['$scope','$log','$http',function($scope,$log,$http){
	// $http.get("http://yunwan2.3322.org:57093/items/100030")
	$http.get("assets/testdata/product-detail.json")

	.success(function(data){
		console.log(['success',data]);
		$scope.productDetailData = data;
		$scope.productDetailData.buynum = 0;//买家购买数
		$scope.productDetailData.realquantity = 0;//剩余库存数量
		$scope.productDetailData.picUrlArr =  $scope.productDetailData.pic_url.split(',');//轮播图片url获取
		console.log(["$scope.productDetailData.picUrlArr",$scope.productDetailData.picUrlArr]);

		$scope.productDetailData.content = $scope.productDetailData.content.substring(6,$scope.productDetailData.content.length-7);//content中间内容获取

		$log.debug(['$scope.productDetailData',$scope.productDetailData.skus]);
		
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
					console.log(["1111111111111111111",iarray[i]]);
					console.log(["2222222222222222222",paraArr[paraArr.length-1]]);
					if(iarray[i] === paraArr[paraArr.length-1]){//paraArr[paraArr.length-1]要加入的参数，
                         flag = false;
					}
					console.log(["3333333333333333333", flag]);
				}
				if(flag){
					$scope.productDetailData.specification[tz].val += paraArr[paraArr.length-1]+" ";//规格值
					$log.debug(['$scope.productDetailData.specification',$scope.productDetailData.specification]);
				}else{
					flag = true;//当取同一个sku时，后面的规格需要把flag置为true
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
	$scope.propertyShow =function(){
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
//关闭选取商品尺寸 颜色
	$scope.propertyClose = function(){
		$(".mengban").hide();
		$(".chooseProductInfoWarp").hide();
	}
//点击+ - 增减商品数
	$scope.delNum = function(num){
		console.log(["$scope.productDetailData.realquantity",$scope.productDetailData.realquantity]);
		console.log(["$scope.productDetailData.buynum",$scope.productDetailData.buynum]);
		if($scope.productDetailData.buynum>0){
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
		    						for(var ee in $scope.productDetailData.skus){//如果该sku里含有传递过来的name且含有其他参数值，查询器剩余数量？？？这儿好像有问题
		    							if(($scope.productDetailData.skus[ee].properties.indexOf(name)>0)&&$scope.productDetailData.skus[ee].properties.indexOf($scope.productDetailData.specification[cc].array[dd])>0){
		    								total +=parseInt($scope.productDetailData.skus[ee].real_quantity);
		    							}
		    						}

		    						if(total === 0){
		    								$("input").each(function(){
		    									if($(this).val()===$scope.productDetailData.specification[cc].array[dd]){
		    										console.log("youyouyou");
		    										console.log("$(this).val():"+$(this).val());
		    										console.log($scope.productDetailData.specification[cc].array[dd]);
		    										$(this).attr({"disabled":"disabled"});
		    										$(this).next().addClass("invalid");
		    									}
		    								})
		    						}
		    					}

    						}
    			}
    			
    		}

            var remain = true;
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
						$scope.productDetailData.buynum = 0;
					}
				}
					
				
    		}
    	}

    	// for(var ii in $scope.productDetailData.skus){
    	// 	if($scope.productDetailData.skus[ii].properties.indexOf(name)>0){
    	// 		// if()
    	// 		;
    	// 	}
    	// }


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

	



}])
;