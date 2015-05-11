'use strict';

angular.module('daogou')
.controller('productDetailCtrl',['$scope','$log','$http',function($scope,$log,$http){
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

//==============================阅完可删除,若不删,留作纪念,我也不反对线====================================

	//1.是不是打算引入那个slider的jquer插件 结果没成功？ 哈哈哈哈哈哈~被我发现了！

	//不要 直接 在index.html引入文件，现在这套自动打包框架里，
	//所有引入的外部文件都在bower.json里配置的
	//要引入jquery插件得先把插件做成bower依赖的插件放到github上，
	//然后在bower.json里配置好 用命令行 baower install 自动安装才行
	//这边直接用ionic的ion-slide-box组件就行，html文件里已经替你代劳加上了

//==============================阅完可删除,若不删,留作纪念,我也不反对线====================================

	//2.记住这个命令  gulp serve:dist

	//每次做完一个功能记得commit一下
	//commit之前要记得 gulp serve:dist 或者 gulp build 一下
	//这个个命令行是用来打包发布用的，这时根目录里会多个dist文件夹  里面是最终打包发布的代码
	//不要只看gulp serve一切正常就 以为万事OK，一定要确保能成功打包发布 并且要检查一下所添功能一切正常
	//好了 就啰嗦到这里 我明天不来公司，祝明天码砖时一切顺利。

//==============================阅完可删除,若不删,留作纪念,我也不反对线====================================

	//3.再啰嗦一句  效率可以再提升下，后面活堆着呐....

//==============================阅完可删除,若不删,留作纪念,我也不反对线====================================


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

//点击导购头像出现个人中心，导购橱窗，购物车，以及关闭
	$scope.showmenu = function(){
		if(parseInt($(".daogou").css("height"))<100){
			$(".daogou").animate({"height":"180"},100)
		}else{
			$(".daogou").animate({"height":"46"},100)
		}
	}
//打开选取商品尺寸 颜色
	$scope.propertyShow =function(){
		$(".mengban").show();
		$(".chooseProductInfoWarp").show();
	}
//关闭选取商品尺寸 颜色
	$scope.propertyClose = function(){
		$(".mengban").hide();
		$(".chooseProductInfoWarp").hide();
	}
//点击+ - 增减商品数
	// $scope.addNum = function(num){
	// 	$scope.productDetailData.quantity = num--;
	// }


	$http.get('assets/testdata/product-detail.json')
	.success(function(data){
		console.log(['success',data]);

		$scope.productDetailData = data;
	})
	.error(function(){
		console.log(['error',data]);
	})


}])
;