'use strict';

angular.module('daogou')
.directive('floatCenter',  function($rootScope,daogouAPI,$stateParams){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		// scope: {}, // {} = isolate, true = child, false/undefined = no change
		// controller: function($scope, $element, $attrs, $transclude) {},
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		// restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
		// template: '',
		templateUrl: 'app/components/floatCenter/floatCenter.html',
		// replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function($scope, iElm, iAttrs, controller) {
			//默认情况下个人中心小红点是没显示的
			$(".redPoint").hide();
			//检测用户是否登录，如果登录了购物车中有物品，显示小红点，没有物品不显示小红点
			daogouAPI.isLogin(function(){
				$(".redPoint").show();
			},function(){
				$(".redPoint").hide();

			})
	//点击导购头像出现个人中心，导购橱窗，购物车，以及关闭
		$scope.showmenu = function(){
			daogouAPI.isLogin(function(){
				$(".redPoint").show();
			},function(){
				$(".redPoint").hide();
				$scope.login = true;

			})
			if(parseInt($(".daogou").css("height"))<100){
				$(".daogou").animate({"height":"210"},100);
			}else{
				$(".daogou").animate({"height":"46"},100);
			}
		}

		$scope.loginsuccess=function(data){
			console.log(['float成功回调',data]);
			//回调成功检测用户信息是否登录
			function checkuseinfo(){
				if($rootScope.USERINFO === undefined){
					console.log(["用户未登录,没获得当前登录用户账号"]);
					//打开登录界面
					// $scope.login = true;
				}else{
					//若有用户信息，显示小红点
					$(".redPoint").show();
				}
			}
		checkuseinfo();
			$scope.login = false; //是否显示登录页面

		};
		$scope.loginerror=function(data){
			console.log(['float失败回调',data])

		};
		}
	};
})