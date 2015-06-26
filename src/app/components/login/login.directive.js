'use strict';

angular.module('daogou')
.directive('login', function($parse,daogouAPI){
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
		templateUrl: 'app/components/login/login.html',
		// replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function($scope, iElm, iAttrs, controller) {
			$scope.logindate={
				username:'15026590036',
				password:'123456'
			};
			//获取验证码
			$scope.verify=function(){
				// console.log("hihihi");
				// console.log("$scope.mainData.telenum:"+$scope.mainData.telenum);
				// console.log("$scope.mainData.verificationCode:"+$scope.mainData.verificationCode);
				$(".yanzhengma").addClass("clickdown");

				//判断是否注册用户  非注册用户需帮用户注册
				daogouAPI.isRegistered($scope.logindate.username,function(data){
					console.log(["U乃注册用户",data]);

				},function(data){
					console.log(["非注册用户",data]);

					//注册account
					daogouAPI.register($scope.logindate.username,function(data){
						console.log(['注册account成功',data])
					},function(data){
						console.log(['注册account失败',data])
					});

					//注册accountinfo
					daogouAPI.registerInfo($scope.logindate,function(data){
						console.log(['注册accountinfo成功',data])
					},function(data){
						console.log(['注册accountinfo失败',data])
					});


					// saveUserInfo(telenum);//注册后第一次注册accountinfo
				});
				//通过手机号码获取验证码
				// getverificationcode($scope.mainData.telenum);
			};

			//获取登录账号（手机号）获取User信息
			// function getUserInfo(telenum, callBack, errorCallBack) {
			// 	$http.get(URLPort + "/users/mobiles/" + telenum) //根据手机号码来获取用户信息，检测用户是否存在，如果不存在要先注册
			// 		.success(function(data) {
			// 			console.log(["获取用户User信息,用户存在", data]);
			// 			var currentUserId = data.id;
			// 			callBack(currentUserId);
			// 		})
			// 		.error(function(data) {
			// 			console.log(["获取用户User信息,用户不存在", data]);
			// 			errorCallBack();
			// 		})
			// }

			console.log(['iAttrs',iAttrs])

			//登录
			$scope.submit = function() {
				// $http.post(URLPort+"/login?username="+$scope.mainData.telenum+"&password="+$scope.mainData.verificationCode)
				daogouAPI.login($scope.logindate,function(data){


					//获取当前用户信息
					daogouAPI.isLogin(function(data) {

						var getter=$parse(iAttrs.loginsuccess);
						var loginsuccess=getter($scope);
						loginsuccess(data)

						//获取用户信息
						// daogouAPI.getuserinfo({username: $scope.logindate.username}, function(data) {

						// },function(data){

						// })

					})


				},function(data){

					var getter=$parse(iAttrs.loginerror)
					var loginerror=getter($scope);
					loginerror(data)

				})
			}

		}
	};
});













