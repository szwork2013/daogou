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
				});
				//通过手机号码获取验证码
				// getverificationcode($scope.mainData.telenum);
			};

	// function getverificationcode(telenum){
	// 	var templatetext=encodeURIComponent("lily商务女装：验证码：%s");
	// 	$http.post(URLPort+"/accounts/verification-code?codeType=MOBILE&account="+telenum+"&template="+templatetext)
	// 	.success(function(data){
	// 		console.log(["获取验证码成功",data]);
	// 	})
	// 	.error(function(data){
	// 		console.log(["获取验证码失败",data]);
	// 	})
	// }
			console.log(['iAttrs',iAttrs])


			//登录
			$scope.submit = function() {
				// $http.post(URLPort+"/login?username="+$scope.mainData.telenum+"&password="+$scope.mainData.verificationCode)
				daogouAPI.login($scope.logindate,function(data){
					console.log(['登录 成功',data]);
					//获取account信息
					daogouAPI.isLogin(function(accountdata) {
						console.log(['accountinfo 成功',accountdata]);
						// 获取用户信息
						daogouAPI.getUserInfo({username: $scope.logindate.username}, function(userinfo) {
							console.log(['获取用户信息 成功',userinfo])
							//登录成功 启用回调函数并传入userinfo
							successcallback(userinfo)
						},function(data){
							console.log(['获取用户信息 失败',data])
							// 添加用户信息
							daogouAPI.setUserInfo(accountdata,function(userinfo){
								console.log(['添加用户信息 成功',userinfo])
								//添加用户信息成功 启用回调函数并传入userinfo
								successcallback(userinfo)
							},function(data){
								console.log(['添加用户信息 失败',data])
								errorcallback(data)
							})
						})
					},function(data){
						console.log(['accountinfo 失败',data]);
						errorcallback(data)
					})
				},function(data){
					console.log(['登录 失败',data]);
					errorcallback(data)
				})
			};

			function successcallback(data){
				var getter=$parse(iAttrs.loginsuccess);
				var loginsuccess=getter($scope);
				loginsuccess(data);
			}

			function errorcallback(data){
				var getter=$parse(iAttrs.loginerror)
				var loginerror=getter($scope);
				loginerror(data);
			}
		}
	};
});













