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

angular.module('daogou',['ionic','order'])
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
		url: '/productDetail',
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
	.state('creatorder', {
		url: '/creatorder',
		templateUrl: 'app/creatorder/creatorder.html',
		controller: 'creatorderCtrl'
	});

	$urlRouterProvider.otherwise('productDetail');
	// $urlRouterProvider.otherwise('/login');
//http://codepen.io/ahsx/pen/mDcEd
}]);
