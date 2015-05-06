'use strict';

angular.module('daogou')
.controller('productDetailCtrl',function($scope,$log){
	$scope.productparam=[
		{param:'A'},
		{param:'B'},
		{param:'C'},
		{param:'D'},
		{param:'E'},
		{param:'F'},
		{param:'G'},
		{param:'H'},
		{param:'I'}
	];


	$log.debug('productDetailCtrl');

	// setTimeout(function(){
	// 			$("#sliders").touchSlider({
	// 				animatetime:300,
	// 				automatic:!0,
	// 				timeinterval:4e3,
	// 				sliderpoint:!0,
	// 				sliderpointwidth:8,
	// 				sliderpointcolor:"#fa9d00"
	// 			});
	// },200);

})
;