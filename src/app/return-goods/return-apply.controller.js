'use strict';

angular.module('goodsReturn',['ionic'])
.controller('returnApplyCtrl',['$scope','$log','$http','checklocalimg','$stateParams','URLPort','$state',function($scope,$log,$http,checklocalimg,$stateParams,URLPort,$state){
	console.log(["$stateParams.oid",$stateParams.oid])
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
    	for(var i in $scope.refundData.details){
    		$scope.refundData.details[i].selectedOid=false;
    	}
    })
    .error(function(data){
    	console.log(["获取可退货商品失败",data])
    })

    $scope.shippingData = [
    	{"shipping_typeCN":"门店退货","shippingtype":"STORE"},
    	{"shipping_typeCN":"快递","shippingtype":"EXPRESS"},
    	{"shipping_typeCN":"直接退款","shippingtype":"IMMEDIATE"}
    ]
    $scope.refundInputInfo = {
    	"shipping_type":"",
    	"buyer_memo": "",
    	"prove_images": "http://brand-guide.b0.upaiyun.com/refund-qr-code/1434009839066_495203.jpg"
    }
    
  
    $scope.goRefundState = function(){
    	var detailsData = [];
    	var k = 0;
    	 for(var i in $scope.refundData.details){
    	 	if($scope.refundData.details[i].selectedOid===true){
    	 		detailsData[k]={
    	 			"oid": $scope.refundData.details[i].oid,
    	 			"num": $scope.refundData.details[i].item_num
    	 		}
    	 		k++;
    	 	}
    	 }
    	 console.log(["detailsData",detailsData]);
    	 var picUrls = "";
    	  console.log($("#img1").attr("src"))
    	  for(var i = 1;i<4;i++){
    	  	if($("#img"+i).attr("src")!=="assets/images/addImg.png"){
    	  		picUrls +=$("#img"+i).attr("src")+",";
    	  	}
    	  }

    	 console.log(["picUrls",picUrls]);
    	$http.post(URLPort+"/refunds",{
    		"tid": $stateParams.tid,
    		"shipping_type": $scope.refundInputInfo.shipping_type.shippingtype,
    		"buyer_user_id": 4,
    		"brand_id":$scope.refundData.brand_id,
    		"buyer_memo": $scope.refundInputInfo.buyer_memo,
    		"details": detailsData,
    		"prove_images":"assets/images/addImg.png,assets/images/pic1.png"
    	})
    	.success(function(data){
    		console.log(["提交退货成功",data]);
    		console.log(["退货编号data.id",data.id])
    		data.id =  "33914552763954000";
    		$state.go("returnOrderDetail",{"id":data.id});
    		
    	})
    	.error(function(data){
    		console.log(["提交退货成功",data])
    	})
 	// 	var fid="33914552763954000";
		// $state.go("returnOrderDetail",{"id":fid})
    	
    }



   $scope.changeCheck = function(index){
   	console.log(["indexindexindex",index])
		if($(".selected-img").eq(index).hasClass("graygou")){
			console.log("biangreen")
			$(".selected-img").eq(index).removeClass("graygou");
			$(".selected-img").eq(index).addClass("greengou");
			$scope.refundData.details[index].selectedOid = true;
		}else{ 
			console.log("biangray")
			$(".selected-img").eq(index).removeClass("greengou");
			$(".selected-img").eq(index).addClass("graygou");
			$scope.refundData.details[index].selectedOid = false;
		}
		
   }
	$scope.uploadImg =function(id){
		checklocalimg(function(data){
			$("#"+id+"").attr("src",data.src);
		})

	}

}])



.controller('returnOrderDetailCtrl',['$scope','$log','$http','checklocalimg','$stateParams','URLPort','$state',function($scope,$log,$http,checklocalimg,$stateParams,URLPort,$state){
	//退货编号22514566335310000
	 var URLPort = URLPort();
	 $scope.fetchAddress = false;//退货地址 门店
	 $scope.fetchQRcode = false;//退货二维码 门店
	 $scope.expressAddress = false;//退货地址 快递
	 $scope.logisticInfo = false;//物流信息 快递
	 $scope.fetchSuccess = false;//退货成功模块 门店
	 $scope.refundReason = false;//退款原因
	 $scope.refundpics = false;//证明图片
	 $scope.cancelRefundInputlogis = false;//footer 取消退货 填写物流信息 快递
	 $scope.cancelRefund = false;//footer 取消退货
	 $scope.changeLogistic = false;//footer 修改物流信息 快递

	 console.log(["$stateParams.id",$stateParams.id]);
	$http.get(URLPort+"/refunds/"+$stateParams.id+"?show_orders=true")
	.success(function(data){
		console.log(["获取订单的退货信息成功",data]);
		for(var i in data.details){
			var picArr = data.details[i].pic_path.split(",");
			console.log(["picArr",picArr]);
			data.details[i].pic = picArr[0];
		}
		if(data.buyer_memo!==""){
			 $scope.refundReason = true;
		}
		if(typeof(data.prove_images)!=="undefined"){
			 $scope.refundpics = true;
			 $scope.refundpicUrls = data.prove_images.split(","); 
		}

		if(data.status==="WAIT_SELLER_CONFIRM_GOODS"){
			data.statusCN = "等待卖家同意";
			$scope.cancelRefund = true;//footer 取消退货
		}else if(data.status==="WAIT_BUYER_REFUND"){
			data.statusCN = "卖家已同意，等待退货";
			if(data.shipping_type==="EXPRESS"){
				 $scope.expressAddress = true;//退货地址 快递
				 $scope.cancelRefundInputlogis = true;//footer 取消退货 填写物流信息 快递
			}else{
				 $scope.fetchAddress = true;//退货地址 门店
				 $scope.fetchQRcode = true;//退货二维码 门店
				 $scope.cancelRefund = true;//footer 取消退货
			}

		}else if(data.status==="WAIT_SELLER_CONFIRM_REFUND"){
			data.statusCN = "买家已退货，等待卖家确认";
			$scope.expressAddress = true;//退货地址 快递
			$scope.logisticInfo = true;//物流信息 快递
			$scope.changeLogistic = true;//footer 修改物流信息 快递
		}else if(data.status==="BUYER_CLOSED"){
			data.statusCN = "买家关闭退货";
			if(data.shipping_type==="EXPRESS"){
				 $scope.expressAddress = true;//退货地址 快递
			}else{
				 $scope.fetchAddress = true;//退货地址 门店
				 $scope.fetchQRcode = true;//退货二维码 门店
			}
		}else if(data.status==="SELLER_CLOSED"){
			data.statusCN = "卖家关闭退货";
			if(data.shipping_type==="EXPRESS"){
				 $scope.expressAddress = true;//退货地址 快递
			}else{
				 $scope.fetchAddress = true;//退货地址 门店
				 $scope.fetchQRcode = true;//退货二维码 门店
			}
		}else if(data.status==="FINISHED"){
			data.statusCN = "已完成";
			if(data.shipping_type==="EXPRESS"){
				 $scope.expressAddress = true;//退货地址 快递
				 $scope.logisticInfo = true;//物流信息 快递
			}else{
				$scope.fetchSuccess = true;//退货成功模块 门店
			}
		}


		$scope.refundOrderData = data;
		
	})
	.error(function(data){
		console.log(["获取订单的退货信息失败",data])
	})


	//根据导购编号和品牌编号获取导购名和工作号
	if(data.receive_guider_id){
		$http.get(URLPort+"/brands/"+data.brand_id+"/guiders/"+data.receive_guider_id+"/details")
		.success(function(data){
			console.log(["获取导购信息成功",data]);
			$scope.guiderData = data;
		})
		.error(function(data){
			console.log(["获取导购信息失败",data])
		})
	}
	

}])

;