'use strict';

angular.module('daogou')
.directive('login', function($rootScope,daogouAPI){
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
				username:'',
				password:''
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
						console.log(['注册成功',data])
					},function(data){
						console.log(['注册失败',data])
					});

					//注册accountinfo
					daogouAPI.registerInfo({id:"用户信息"},function(data){
						console.log(['注册成功',data])
					},function(data){
						console.log(['注册失败',data])
					});


					// saveUserInfo(telenum);//注册后第一次注册accountinfo
				});
				//通过手机号码获取验证码
				// getverificationcode($scope.mainData.telenum);
			};
			//判断手机号是否已经注册account账户
			// function verifyUserNameExist(telenum,callBack,errorCallBack){
			// 	$http.get(URLPort+"/accounts/exists?username="+telenum)
			// 	.success(function(data){
			// 		console.log(["手机号已经注册account",data]);
			// 		callBack(telenum);
			// 	})
			// 	.error(function(data){
			// 		console.log(["手机号未注册account",data]);
			// 		errorCallBack(telenum);
			// 	})
			// }

			// //注册account
			// function register(telenum){
			// 	$http.post(URLPort+"/accounts/register",{"username": telenum,"password": "admin","enabled": true})
			// 	.success(function(data){
			// 		console.log(["注册成功",data]);
			// 	})
			// 	.error(function(data){
			// 		console.log(["注册失败",data]);
			// 	})
			// }
			// 	//注册以后第一次保存用户信息 注册accountinfo
			// function saveUserInfo(telenum){
			// 	$http.post(URLPort+"/accounts/register/info",{"id": 1,"username": telenum, //required
			// 	"name": "管理员",
			// 	"nick": "管理员",
			// 	"weixin": "weixin",
			// 	"weixinName": "weixin nick",
			// 	"mobile": telenum,
			// 	"email": "fjdk@dkfj.com",
			// 	"accountId": 1,
			// 	"birthday": null,
			// 	"gender": "FEMALE"})
			// 	.success(function(data){
			// 		console.log(["注册accountinfo成功",data]);
			// 	})
			// 	.error(function(data){
			// 		console.log(["注册accountinfo失败",data]);
			// 	})
			// }

			// //通过手机号码获取验证码
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



			//获取登录账号（手机号）获取User信息
			function getUserInfo(telenum, callBack, errorCallBack) {
				$http.get(URLPort + "/users/mobiles/" + telenum) //根据手机号码来获取用户信息，检测用户是否存在，如果不存在要先注册
					.success(function(data) {
						console.log(["获取用户User信息,用户存在", data]);
						var currentUserId = data.id;
						callBack(currentUserId);
					})
					.error(function(data) {
						console.log(["获取用户User信息,用户不存在", data]);
						errorCallBack();
					})
			}

			//登录
			$scope.submit = function() {
				// $http.post(URLPort+"/login?username="+$scope.mainData.telenum+"&password="+$scope.mainData.verificationCode)
				console.log(0)
				daogouAPI.login($scope.logindate,function(data){
					console.log(['登录成功',data]);
				},function(data){
					console.log(['登录失败',data]);
				})
				// console.log(15026590036)
				// $http({
				// 		method: 'POST',
				// 		url: URLPort + '/login',
				// 		headers: {
				// 			'Content-Type': 'application/x-www-form-urlencoded'
				// 		},
				// 		transformRequest: function(obj) {
				// 			var str = [];
				// 			for (var p in obj) str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				// 			return str.join("&");
				// 		},
				// 		data: {
				// 			username: $scope.mainData.telenum,
				// 			password: $scope.mainData.verificationCode
				// 		}
				// 	})
				// 	.success(function(data) {
				// 		console.log(["登录成功", data]);
				// 		//获得当前登录账号
				// 		$http.get(URLPort + "/accounts/current")
				// 			.success(function(data) {
				// 				console.log(["获得当前登录用户账号,已经登录", data]);
				// 				var currentUserName = data.username;
				// 				var currentAccountId = data.accountId;
				// 				var saveUserMobile = data.mobile;
				// 				$scope.curUserId = data.id;
				// 				$rootScope.curUserId = data.id;
				// 				console.log(["$rootScope.curUserId", $rootScope.curUserId])
				// 					// $rootScope.curUserInfo

				// 				console.log(["$scope.curUserId", $scope.curUserId])
				// 					//获取登录账号（手机号）获取User信息
				// 				getUserInfo(currentUserName,
				// 					function(currentUserId) { //User存在  根据用户id修改信息
				// 						$http.put(URLPort + "/users/" + currentUserId + "", {
				// 								"id": currentUserId,
				// 								"account_id": currentAccountId,
				// 								"name": "老3",
				// 								"gender": 1,
				// 								"nick": "zhang3",
				// 								"email": "zy3@qq.com",
				// 								"birthday": 1420017957000,
				// 								"mobile": saveUserMobile,
				// 								"weixin_no": "zy3@qq.com",
				// 								"weixin_nick": "老3就是我",
				// 								"avatar": "http://brand-guide.b0.upaiyun.com/avatar.jpg"
				// 							})
				// 							.success(function(data) {
				// 								console.log(["更新User信息成功", data]);
				// 							})
				// 							.error(function(data) {
				// 								console.log(["更新User信息失败", data]);
				// 							})

				// 					},
				// 					function() { //User不存在
				// 						$http.post(URLPort + "/users", {
				// 								"account_id": currentAccountId,
				// 								"name": "老5",
				// 								"name_py": "lao5",
				// 								"gender": 1,
				// 								"nick": "zhang",
				// 								"email": "zy@qq.com",
				// 								"birthday": 1420017957000,
				// 								"mobile": saveUserMobile,
				// 								"weixin_no": "zy@qq.com",
				// 								"weixin_nick": "老5就是我",
				// 								"avatar": "http://brand-guide.b0.upaiyun.com/avatar.jpg"
				// 							})
				// 							.success(function(data) {
				// 								console.log(["新增User信息成功", data]);
				// 							})
				// 							.error(function(data) {
				// 								console.log(["新增User信息失败", data]);
				// 							})
				// 					})

				// 				//登录成功，登录模块隐藏，地址模块不影藏
				// 				$scope.loginhandle = true;
				// 				$scope.alladdress = false;
				// 				$scope.shopaddress = false;
				// 				//查询用户的收获地址信息

				// 				$http.get(URLPort + "/users/" + $scope.curUserId + "/shipping-addresses")
				// 					.success(function(data) {

				// 						if (data.length > 0) {
				// 							console.log(["当前用户有收货地址，选择收获地址", data]);
				// 							$scope.firstBuyerAddress = true; //隐藏填写第一个地址模块，显示选择地址模块
				// 							$scope.buyeraddress = false;
				// 							$scope.weixinpay = false;
				// 							for (var i in data) { //选出默认收货地址
				// 								if (data[i].is_default === 1) {
				// 									$scope.defaultAddressdata = data[i];
				// 								}
				// 							}

				// 						} else {
				// 							console.log(["当前用户没有收货地址，请填写第一个收货地址", data]);
				// 							$scope.shopaddress = false; //显示用户地址，隐藏实体店地址
				// 							$scope.allbuyeraddress = true;
				// 							$scope.firstBuyerAddress = false; //隐藏选择地址模块，显示填写第一个地址模块
				// 							$scope.buyeraddress = true;
				// 							$scope.searchProvinces();

				// 						}

				// 					})
				// 					.error(function(data) {
				// 						console.log(["当前用户没有收货地址，请填写第一个收货地址", data]);

				// 						$scope.shopaddress = false; //显示用户地址，隐藏实体店地址
				// 						$scope.allbuyeraddress = true;

				// 						$scope.firstBuyerAddress = false; //隐藏选择地址模块，显示填写第一个地址模块
				// 						$scope.buyeraddress = true;

				// 						$scope.searchProvinces();

				// 					})

				// 			})
				// 			.error(function(data) {
				// 				console.log(["没获得当前登录用户账号，未登录", data]);
				// 			})

				// 	})
				// 	.error(function(data) {
				// 		console.log(["登录失败", data]);
				// 	})
			}


		}
	};
});












