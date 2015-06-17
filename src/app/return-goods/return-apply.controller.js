'use strict';

angular.module('goodsReturn',['ionic'])
.controller('returnApplyCtrl',['$scope','$log','$http','checklocalimg','$stateParams','URLPort','$state',function($scope,$log,$http,checklocalimg,$stateParams,URLPort,$state){
	console.log(["$stateParams.tid",$stateParams.tid])
    var URLPort = URLPort();
    $http.get(URLPort+"/trades/"+$stateParams.tid+"/refunds")
    .success(function(data){
    	console.log(["获取可退货商品成功",data]);
    	for(var i in data.details){
    		var picArr = data.details[i].pic_path.split(",");
    		console.log(["picArr",picArr]);
    		data.details[i].pic = picArr[0];
    	}
    	$scope.refundData = data;
    	
    })
    .error(function(data){
    	console.log(["获取可退货商品失败",data])
    })
    
    $scope.goRefundState = function(){
    	$http.post(URLPort+"/refunds",{
    		"tid": "98257315768028962",
    		"shipping_type": "STORE",
    		"receive_guider_id": 51,
    		"prove_images": "http://brand-guide.b0.upaiyun.com/refund-qr-code/1434009839066_495203.jpg",
    		"buyer_memo": "就是不想要了",
    		"details": [
    		    {
    		        "oid": "982573157680289621",
    		        "num": 1
    		    }
    		]
    	})
    	.success(function(data){
    		console.log(["提交退货成功",data]);
    		for(var i in data.details){
    			var picArr = data.details[i].pic_path.split(",");
    			console.log(["picArr",picArr]);
    			data.details[i].pic = picArr[0];
    		}
    		$scope.refundData = data;
    		
    	})
    	.error(function(data){
    		console.log(["提交退货成功",data])
    	})
    	$state.go("returnOrderDetail")
    }



	$http.get('assets/testdata/cart.json')
	.success(function(data){
		$log.debug(["success data",data]);
		$scope.productData = data;
	})
	.error(function(data){
		$log.debug(["error data",data]);
	})
	$scope.uploadImg =function(id){
		checklocalimg(function(data){
			$("#"+id+"").attr("src",data.src);
		})

	}

}])
;