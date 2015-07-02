'use strict';

// angular.module('daogou', ['ionic','ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ui.router'])
//   .config(function ($stateProvider, $urlRouterProvider) {
//     $stateProvider
//       .state('home', {
//         url: '/',
//         templateUrl: 'app/main/main.html',
//         controller: 'MainCtrl'
//       });

//     $urlRouterProvider.otherwise('/');
//     console.log(0)
//   })
// ;

angular.module('daogou', ['ionic', 'product', 'cart', 'order', 'orderList', 'createOrder', 'goodsReturn', 'payWay', 'guide'])
.run(['$ionicPlatform', function($ionicPlatform) {
	$ionicPlatform.ready(function() {
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if (window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		if (window.StatusBar) {
			// org.apache.cordova.statusbar required
			StatusBar.styleDefault();
		}
	});
}])
.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

	// wxconfig();

	// $ionicConfigProvider.backButton.text("返回");
	// $ionicConfigProvider.views.maxCache(0);
	// $ionicConfigProvider.views.forwardCache(false);
	// $ionicConfigProvider.templates.maxPrefetch(0);

	$stateProvider
		.state('productDetail', {
			url: '/productDetail/:detailId',
			templateUrl: 'app/product/product-detail/product-detail.html',
			controller: 'productDetailCtrl'
		})
		.state('productList', {
			url: '/productList',
			templateUrl: 'app/product/product-list/product-list.html',
			controller: 'productListCtrl'
		})
		.state('cart', {
			url: '/cart/:userid/:brandid',
			templateUrl: 'app/cart/cart.html',
			controller: 'cartCtrl'
		})
		.state('orderList', {
			url: '/orderList/:userid',
			templateUrl: 'app/order/order-list/order-list.html',
			controller: 'orderListCtrl'
		})
		.state('orderDetail', {
			url: '/orderDetail/:tid',
			templateUrl: 'app/order/order-detail/order-detail.html',
			controller: 'orderDetailCtrl'
		})
		.state('returnApply', {
			url: '/returnApply/:tid/:oid',
			templateUrl: 'app/return-goods/return-apply.html',
			controller: 'returnApplyCtrl'
		})
		.state('returnOrderDetail', {
			url: '/returnOrderDetail/:id',
			templateUrl: 'app/return-goods/return-order-detail.html',
			controller: 'returnOrderDetailCtrl'
		})
		.state('logisticsInfo', {
			url: '/logisticsInfo',
			templateUrl: 'app/return-goods/logisticsInfo.html'
		})
		.state('creatorder', {
			// url: '/creatorder/:title/:price/:skudetail/:skuid/:num/:freight/:brandid',
			url: '/creatorder',
			templateUrl: 'app/creatorder/creatorder.html',
			controller: 'creatorderCtrl'
		})
		.state('goodsShop', {
			url: '/goodsShop/:userid/:brandid/:lng/:lat',
			templateUrl: 'app/creatorder/goods-shop.html',
			controller: 'goodsShopCtrl'
		})
		.state('changeReceiveInfo', {
			url: '/changeReceiveInfo/:userid',
			templateUrl: 'app/creatorder/change-receive-info.html',
			controller: 'changeReceiveInfoCtrl'
		})
		.state('payWay', {
			url: '/payWay',
			templateUrl: 'app/pay/pay-way.html',
			controller: 'payWayCtrl'
		})
		.state('successPay', {
			url: '/successPay',
			templateUrl: 'app/pay/success-pay.html',
			controller: 'successPayCtrl'
		})
		.state('newAddress', {
			url: '/newAddress/:userid/:addressid',
			templateUrl: 'app/creatorder/new-address.html',
			controller: 'newAddressCtrl'
		})
		.state('guide', {
			url: '/guide/:guideid/:brandid',
			templateUrl: 'app/guide/guide.html',
			controller: 'guideCtrl'
		});

	$urlRouterProvider.otherwise('productDetail/100030');

	// $urlRouterProvider.otherwise('/login');

	//http://codepen.io/ahsx/pen/mDcEd

})
.controller('configCtrl', function($rootScope,$scope, wxconfig, pay) {

	/*
	https://open.weixin.qq.com/connect/oauth2/authorize?
	appid=wx520c15f417810387&
	redirect_uri=http%3A%2F%2Fchong.qq.com%2Fphp%2Findex.php%3Fd%3D%26c%3DwxAdapter%26m%3DmobileDeal%26showwxpaytitle%3D1%26vb2ctag%3D4_2030_5_1194_60
	&response_type=code&
	scope=snsapi_base&
	state=123#wechat_redirect
	
	*/



	wxconfig(1, function(configdata) {
		console.log(['微信config', configdata]);
		


// 		var url='https://open.weixin.qq.com/connect/oauth2/authorize?'+
// 			'appid='+$rootScope.WXINFO.appid+
// 			'&redirect_uri='+encodeURIComponent(window.location.href)+
// 			'&response_type=code'+
// 			'&scope=snsapi_base'+
// 			'#wechat_redirect';
// console.log(url)


		wx.config({
			debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
			appId: configdata.appId, // 必填，公众号的唯一标识
			timestamp: configdata.timestamp, // 必填，生成签名的时间戳
			nonceStr: configdata.nonceStr, // 必填，生成签名的随机串
			signature: configdata.signature, // 必填，签名，见附录1
			jsApiList: [
					'onMenuShareTimeline',
					'onMenuShareAppMessage',
					'onMenuShareQQ',
					'onMenuShareWeibo',
					'startRecord',
					'stopRecord',
					'onVoiceRecordEnd',
					'playVoice',
					'pauseVoice',
					'stopVoice',
					'onVoicePlayEnd',
					'uploadVoice',
					'downloadVoice',
					'chooseImage',
					'previewImage',
					'uploadImage',
					'downloadImage',
					'translateVoice',
					'getNetworkType',
					'openLocation',
					'getLocation',
					'hideOptionMenu',
					'showOptionMenu',
					'hideMenuItems',
					'showMenuItems',
					'hideAllNonBaseMenuItem',
					'showAllNonBaseMenuItem',
					'closeWindow',
					'scanQRCode',
					'chooseWXPay',
					'openProductSpecificView',
					'addCard',
					'chooseCard',
					'openCard'
				] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
		});


	});


})


;