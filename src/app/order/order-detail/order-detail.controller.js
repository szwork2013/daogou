'use strict';

var order = angular.module('order',['ionic']);
order.controller('orderDetailCtrl',['$scope', '$log', '$http','URLPort', 'daogouAPI', '$state', '$stateParams',function($scope,$log,$http,URLPort,daogouAPI,$state,$stateParams){


//==============================阅完可删除,若不删,留作纪念,我也不反对线====================================
	//这个切换其实是2个页面 不是页面内切换的
	//一个是购物车页cart   应该是订单列表  order → order-list
//==============================阅完可删除,若不删,留作纪念,我也不反对线====================================
var URLPort = URLPort();
console.log(["$stateParams.tid",$stateParams.tid]);
$scope.expressReceiver = false;//快递方式收货人地址模块
$scope.fetchReceiver = false;//门店自取收货人地址模块
$scope.fetchshop = false;//门店自取门店地址信息
$scope.fetchQRcode = false;//门店自取二维码信息
$scope.logistics = false;//物流信息
$scope.payWay = false;//付款方式
$scope.payNo = false;//交易号
$scope.deleteOrder = false;//删除订单
$scope.cancelpayOrder = false;//取消订单，立即付款
$scope.cancelOrder = false;//取消订单
$scope.refund = false;//商品列表上的退款按钮
$scope.refunding = false;//商品列表上的退款中按钮
$http.get(URLPort+"/trades/"+$stateParams.tid+"?show_orders=true")
.success(function(data){
	console.log(["获取订单详情成功",data]);
	if(data.pay_type === "WEIXIN"){
		data.pay_typeCN = "微信支付";
	}

	// shipping_type: "express"
	if(data.status==="WAIT_BUYER_PAY"){
		data.statusCN = "待付款";
		if(data.shipping_type==="EXPRESS"){
			$scope.expressReceiver = true;
		}else if(data.shipping_type==="FETCH"){
			$scope.fetchReceiver = true;
		}
		$scope.cancelpayOrder = true;

	}else if(data.status==="SELLER_CONSIGNED_PART"){
		data.statusCN = "已部分发货";
	}else if(data.status==="WAIT_SELLER_SEND_GOODS"){
		data.statusCN = "待卖家发货（快递发货 买家已付款）";
		$scope.expressReceiver = true;//快递方式收货人地址模块
		$scope.cancelOrder = true;//取消订单
		// $scope.refund = true;//商品列表上的退款按钮
		// $scope.refunding = true;//商品列表上的退款中按钮
		$scope.payWay = true;//付款方式
		$scope.payNo = true;//交易号
	}else if(data.status==="WAIT_BUYER_CONFIRM_GOODS"){
		data.statusCN = "已发货（快递发货）";
		$scope.expressReceiver = true;//快递方式收货人地址模块
		$scope.logistics = true;//物流信息
		$scope.cancelOrder = true;//取消订单
		$scope.refund = true;//商品列表上的退款按钮
		// $scope.refunding = true;//商品列表上的退款中按钮
		$scope.payWay = true;//付款方式
		$scope.payNo = true;//交易号

	}else if(data.status==="WAIT_BUYER_FETCH_GOODS"){
		data.statusCN = "待取货（店铺取货）";
		$scope.fetchReceiver = true;
		$scope.fetchQRcode = true;
		$scope.payWay = true;//付款方式
		$scope.payNo = true;//交易号
		$scope.cancelOrder = true;
	}else if(data.status==="TRADE_FINISHED"){
		data.statusCN = "已完成";
		if(data.shipping_type==="EXPRESS"){
			$scope.expressReceiver = true;
			$scope.logistics = true;//物流信息
		}else if(data.shipping_type==="FETCH"){
			$scope.fetchReceiver = true;
			$scope.fetchshop = true;//门店自取门店地址信息
		}
		$scope.deleteOrder = true;//删除订单
		$scope.refund = true;//商品列表上的退款按钮
		// $scope.refunding = true;//商品列表上的退款中按钮
		$scope.payWay = true;//付款方式
		$scope.payNo = true;//交易号
	}else if((data.status==="TRADE_CLOSED_BY_SYSTEM")||(data.status==="TRADE_CLOSED_BY_SELLER")||(data.status==="TRADE_CLOSED_BY_BUYER")||(data.status==="TRADE_CLOSED_BY_SPLIT")){
		data.statusCN = "已关闭";
		if(data.shipping_type==="EXPRESS"){
			$scope.expressReceiver = true;
			$scope.logistics = true;//物流信息
		}else if(data.shipping_type==="FETCH"){
			$scope.fetchReceiver = true;
			$scope.fetchshop = true;//门店自取门店地址信息
			console.log(["typeof(data.receive_guider_id)",typeof(data.receive_guider_id)])
			if(typeof(data.receive_guider_id)==="undefined"){
				$scope.fetchshop = false;//门店自取门店地址信息
			}
		}
		$scope.deleteOrder = true;//删除订单
		$scope.payWay = true;//付款方式
		$scope.payNo = true;//交易号
	}

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
	


	$scope.orderDetailData = data;

})
.error(function(data){
	console.log(["获取订单详情失败",data]);
})


$scope.refundfunc = function(tid,oid){
	console.log(["oid",oid])
	$state.go("returnApply",{tid:tid,oid:oid});
}



}]);