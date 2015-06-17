'use strict';

// angular.module('daogou', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ui.router'])
//   .config(function ($stateProvider, $urlRouterProvider) {
//     $stateProvider
//       .state('home', {
//         url: '/',
//         templateUrl: 'app/main/main.html',
//         controller: 'MainCtrl'
//       });

//     $urlRouterProvider.otherwise('/');
//   })
// ;

angular.module('daogou',['ionic','servicesFactory','product','cart','order','orderList','createOrder','goodsReturn','payWay','guide'])
.run(['$ionicPlatform', function($ionicPlatform){
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
.config(['$stateProvider','$urlRouterProvider','$ionicConfigProvider',function($stateProvider,$urlRouterProvider,$ionicConfigProvider) {
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
		url: '/cart',
		templateUrl: 'app/cart/cart.html',
		controller: 'cartCtrl'
	})
	.state('orderList', {
		url: '/orderList',
		templateUrl: 'app/order/order-list/order-list.html',
		controller: 'orderListCtrl'
	})
	.state('orderDetail', {
		url: '/orderDetail/:tid',
		templateUrl: 'app/order/order-detail/order-detail.html',
		controller: 'orderDetailCtrl'
	})
	.state('returnApply', {
		url: '/returnApply/:tid',
		templateUrl: 'app/return-goods/return-apply.html',
		controller: 'returnApplyCtrl'
	})
	.state('returnOrderDetail', {
		url: '/returnOrderDetail',
		templateUrl: 'app/return-goods/return-order-detail.html',
		controller: 'orderListCtrl'
	})
	.state('logisticsInfo', {
		url: '/logisticsInfo',
		templateUrl: 'app/return-goods/logisticsInfo.html'
	})
	.state('creatorder', {
		url: '/creatorder/:title/:price/:skudetail/:skuid/:num/:freight/:brandid',
		templateUrl: 'app/creatorder/creatorder.html',
		controller: 'creatorderCtrl'
	})
	.state('goodsShop', {
		url: '/goodsShop',
		templateUrl: 'app/creatorder/goods-shop.html',
		controller: 'goodsShopCtrl'
	})
	.state('changeReceiveInfo', {
		url: '/changeReceiveInfo',
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
		url: '/newAddress',
		templateUrl: 'app/creatorder/new-address.html',
		controller: 'creatorderCtrl'
	})
	.state('guide', {
		url: '/guide',
		templateUrl: 'app/guide/guide.html',
		controller: 'guideCtrl'
	})
	;

	$urlRouterProvider.otherwise('productDetail/100030');
	// $urlRouterProvider.otherwise('/login');
//http://codepen.io/ahsx/pen/mDcEd
}]);
