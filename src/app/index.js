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

angular.module('daogou',['ionic'])
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
	$ionicConfigProvider.views.maxCache(0);
	$ionicConfigProvider.views.forwardCache(false);
	$ionicConfigProvider.templates.maxPrefetch(0);

	$stateProvider
	.state('home', {
		url: '/',
		templateUrl: 'app/main/main.html',
		controller: 'MainCtrl'
	});
	;

	$urlRouterProvider.otherwise('/');
	// $urlRouterProvider.otherwise('/login');
//http://codepen.io/ahsx/pen/mDcEd
}]);
