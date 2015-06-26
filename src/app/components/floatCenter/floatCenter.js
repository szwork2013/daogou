'use strict';

angular.module('daogou')
.directive('floatCenter',  function(){
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

	//点击导购头像出现个人中心，导购橱窗，购物车，以及关闭
		$scope.showmenu = function(){
			if(parseInt($(".daogou").css("height"))<100){
				$(".daogou").animate({"height":"180"},100);
				$(".redPoint").hide();
			}else{
				$(".daogou").animate({"height":"46"},100);
			}
		}
			
		}
	};
})