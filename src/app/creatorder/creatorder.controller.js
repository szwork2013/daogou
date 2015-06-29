'use strict';

var createOrder=angular.module('createOrder',['ionic']);
createOrder.controller('creatorderCtrl',function($rootScope,$scope,$log,$http,$state,URLPort,$stateParams,daogouAPI){
	$log.debug('creatorderCtrl');
	$scope.buytitle = $stateParams.title;
	$scope.buyprice = $stateParams.price;
	$scope.buyskudetail = $stateParams.skudetail;
	$scope.buyskuid = $stateParams.skuid;
	$scope.buynum = $stateParams.num;
	$scope.buyfreight = $stateParams.freight;
	$scope.totalprice = $stateParams.price*$stateParams.num;
	$scope.totalcost = $scope.totalprice + parseFloat($scope.buyfreight);
	console.log(["$stateParams.title",$stateParams.title])

	$scope.mainData = {
		telenum : "",
		verificationCode: ""
	}

    $scope.weixinpay = true;
	$scope.loginhandle = true;//初始让登录模块隐藏
   	$scope.alladdress = true;//初始让地址模块隐藏

   	$scope.buyeraddress = true;
   	$scope.firstBuyerAddress = true;
	$scope.allbuyeraddress = true;
	$scope.shopaddress = true;


	$scope.postway = function(){
		$scope.allbuyeraddress = true;
		$scope.shopaddress = false;
	}
	$scope.shopway = function(){
		$scope.allbuyeraddress = false;
		$scope.shopaddress = true;
		 if (window.navigator.geolocation) {
            // var options = {
            //      enableHighAccuracy: true,
            //  };
             console.log("浏览器支持html5来获取地理位置信息")
             window.navigator.geolocation.getCurrentPosition(handleSuccess, handleError,{timeout:2000});
         } else {
              console.log("浏览器不支持html5来获取地理位置信息");
         }

	   	function handleSuccess(position){
           // 获取到当前位置经纬度  本例中是chrome浏览器取到的是google地图中的经纬度
           var lng = position.coords.longitude;
           var lat = position.coords.latitude;
           console.log(["geolocation lng",lng]);
           console.log(["geolocation lat",lat]);
	     }
		           
       function handleError(error){
       	console.log("geolocation error")
       
       }

      $scope.user_id = $scope.curUserId || $stateParams.userid;
      daogouAPI.shopAddress("/brands/"+$stateParams.brandid+"/stores/store-fetch",{
      		user_id:$scope.curUserId,
      		longitude:121.399411,
      		latitude:31.168323
      	},function(data, status, headers, config){
      		console.log(["查询门店列表成功",data]);
      		$scope.shopaddressData = data;
      		var flag = false;
      		var defaultIndex = 0;
      		for(var i in $scope.shopaddressData){
      			if($scope.shopaddressData[i].is_default===1){
      				flag = true;//如果有默认地址 flag为true
      				defaultIndex = i;
      			}
      		}
      		if(flag === true){//有默认地址
      			console.log("有默认地址");
      			$scope.minDistance=$scope.shopaddressData[defaultIndex];
      		}else{//没有默认地址
      			console.log("无有默认地址");
      			var minIndex = 0;
      			for(var i=0;i<data.length-1;i++){
      				if(parseFloat(data[i+1].distance)>parseFloat(data[i].distance)){
      					minIndex = i+1;
      				}
      			}
      			$scope.minDistance = data[minIndex]; 
      		}
      		
      	    
      	},function(data, status, headers, config){
      		console.log(["查询门店列表失败",data]);
      	});

	}


	
	//判断是否登录
	judgeLogin();

	var URLPort = URLPort();

	function judgeLogin(){
		daogouAPI.isLogin(function(data) {
			//如果已经登录，查询用户是否有收货地址，若果有显示默认收货地址，如果没有显示添加收货地址
			console.log(["用户已登录,获得当前登录用户账号", data]);
			$scope.loginhandle = true; //已经登录让 登录模块隐藏
			$scope.alladdress = false; //让地址模不隐藏
			$scope.shopaddress = false; //默认显示用户地址，隐藏实体店地址
			$scope.allbuyeraddress = true;
			console.log(["$scope.loginhandle", $scope.loginhandle]);
			$scope.curUserId = data.id;
			$rootScope.curUserId = data.id;
		}, function(data) {
			//如果未登录,显示登录框，进行登录
			console.log(["用户未登录,没获得当前登录用户账号", data]);
			$scope.loginhandle = false; //未登录让 登录模块不隐藏
			$scope.alladdress = true; //让地址模隐藏
		})
	} 
	// //判断手机号是否已经注册account账户
 //    function verifyUserNameExist(telenum,callBack,errorCallBack){
 //    	$http.get(URLPort+"/accounts/exists?username="+telenum)
 //    	.success(function(data){
 //    		console.log(["手机号已经注册account",data]);
 //    		callBack(telenum);
 //    	})
 //    	.error(function(data){
 //    		console.log(["手机号未注册account",data]);
 //    		errorCallBack(telenum);
 //    	})
 //    }
	// //注册account
 //    function register(telenum){
 //    	$http.post(URLPort+"/accounts/register",{"username": telenum,"password": "admin","enabled": true})
 //    	.success(function(data){
 //    		console.log(["注册成功",data]);
 //    	})
 //    	.error(function(data){
 //    		console.log(["注册失败",data]);
 //    	})
 //    }
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
 //    //通过手机号码获取验证码
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
	//获取验证码
	// $scope.verify=function(){
	// 	console.log("hihihi");
	// 	console.log("$scope.mainData.telenum:"+$scope.mainData.telenum);
	// 	console.log("$scope.mainData.verificationCode:"+$scope.mainData.verificationCode);
	// 	$(".yanzhengma").addClass("clickdown");

	// 	//判断手机号是否已经注册account账户
	// 	verifyUserNameExist($scope.mainData.telenum,
	// 	function(telenum){//如果用户名存在则读取用户信息
	// 	},
	// 	function(telenum){//手机号未注册account则注册
	// 		register(telenum);//注册account
	// 		saveUserInfo(telenum);//注册后第一次注册accountinfo
	// 	});

	// 	//通过手机号码获取验证码
	// 	getverificationcode($scope.mainData.telenum);
	// }

 //   //获取登录账号（手机号）获取User信息
	// function getUserInfo(telenum,callBack,errorCallBack){
	// 	$http.get(URLPort+"/users/mobiles/"+telenum)//根据手机号码来获取用户信息，检测用户是否存在，如果不存在要先注册
	// 	.success(function(data){
	// 		console.log(["获取用户User信息,用户存在",data]);
	// 		var currentUserId =data.id;
	// 		callBack(currentUserId);
	// 	})
	// 	.error(function(data){
	// 		console.log(["获取用户User信息,用户不存在",data]);
	// 		errorCallBack();
	// 	})
	// }

	// //登录
	// $scope.submit=function(){
	// 	// $http.post(URLPort+"/login?username="+$scope.mainData.telenum+"&password="+$scope.mainData.verificationCode)
	// 	$http({
	// 		method: 'POST',
	// 		url: URLPort+'/login',
	// 		headers: {'Content-Type': 'application/x-www-form-urlencoded'},
	// 		transformRequest: function(obj) {
	// 			var str = [];
	// 			for(var p in obj) str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
	// 			return str.join("&");
	// 		},
	// 		data: {username:$scope.mainData.telenum, password: $scope.mainData.verificationCode}
	// 	})
	// 	.success(function(data){
	// 		console.log(["登录成功",data]);
	// 		//获得当前登录账号
	// 	   	$http.get(URLPort+"/accounts/current")
	// 	   	.success(function(data){
	// 	   		console.log(["获得当前登录用户账号,已经登录",data]);
	// 	   		var currentUserName = data.username;
	// 	   		var currentAccountId = data.accountId;
	// 	   		var saveUserMobile = data.mobile;
	// 	   		$scope.curUserId = data.id;
	// 	   		$rootScope.curUserId = data.id;
	// 	   		console.log(["$rootScope.curUserId",$rootScope.curUserId])
 //                // $rootScope.curUserInfo

	// 	   		console.log(["$scope.curUserId",$scope.curUserId])
 //                //获取登录账号（手机号）获取User信息
	// 	   		getUserInfo(currentUserName,
	// 	   			function(currentUserId){//User存在  根据用户id修改信息
	// 	   				$http.put(URLPort+"/users/"+currentUserId+"",{
	// 	   		              "id": currentUserId,
	// 	   		              "account_id": currentAccountId,
	// 	   		              "name": "老3",
	// 	   		              "gender": 1,
	// 	   		              "nick": "zhang3",
	// 	   		              "email": "zy3@qq.com",
	// 	   		              "birthday": 1420017957000,
	// 	   		              "mobile": saveUserMobile,
	// 	   		              "weixin_no": "zy3@qq.com",
	// 	   		              "weixin_nick": "老3就是我",
	// 	   		              "avatar":"http://brand-guide.b0.upaiyun.com/avatar.jpg"})
	// 	   				.success(function(data){
	// 	   					console.log(["更新User信息成功",data]);
	// 	   				})
	// 	   				.error(function(data){
	// 	   					console.log(["更新User信息失败",data]);
	// 	   				})

	// 	   			},
	// 	   			function(){//User不存在
	// 	   				$http.post(URLPort+"/users",{"account_id": currentAccountId,
	// 	   		            "name" : "老5",
	// 	   		            "name_py": "lao5",
	// 	   		            "gender": 1,
	// 	   		            "nick": "zhang",
	// 	   		            "email": "zy@qq.com",
	// 	   		            "birthday": 1420017957000,
	// 	   		            "mobile": saveUserMobile,
	// 	   		            "weixin_no": "zy@qq.com",
	// 	   		            "weixin_nick":"老5就是我",
	// 	   		            "avatar":"http://brand-guide.b0.upaiyun.com/avatar.jpg"})
	// 	   				.success(function(data){
	// 	   					console.log(["新增User信息成功",data]);
	// 	   				})
	// 	   				.error(function(data){
	// 	   					console.log(["新增User信息失败",data]);
	// 	   				})
	// 	   			})

	// 			   	//登录成功，登录模块隐藏，地址模块不影藏
	// 			   	$scope.loginhandle = true;
	// 			   	$scope.alladdress = false;
	// 			   	$scope.shopaddress = false;
	// 			   	//查询用户的收获地址信息

	// 			   	$http.get(URLPort+"/users/"+$scope.curUserId+"/shipping-addresses")
	// 			   	.success(function(data){
		            	
	// 	            	if(data.length>0){
	// 	            		console.log(["当前用户有收货地址，选择收获地址",data]);
	// 	            		$scope.firstBuyerAddress = true;//隐藏填写第一个地址模块，显示选择地址模块
	// 	            		$scope.buyeraddress = false;
	// 	            		$scope.weixinpay = false;
	// 	            		for(var i in data){//选出默认收货地址
	// 	            			if(data[i].is_default===1){
	// 	            				$scope.defaultAddressdata = data[i];
	// 	            			}
	// 	            		}

	// 	            	}else{
 //    				   		console.log(["当前用户没有收货地址，请填写第一个收货地址",data]);
 //    				   		$scope.shopaddress = false;//显示用户地址，隐藏实体店地址
 //    				   		$scope.allbuyeraddress = true;
 //    				   		$scope.firstBuyerAddress = false;//隐藏选择地址模块，显示填写第一个地址模块
 //    		            	$scope.buyeraddress = true;
 //    		            	$scope.searchProvinces();

	// 	            	}
		            	
	// 			   	})
	// 			   	.error(function(data){
	// 			   		console.log(["当前用户没有收货地址，请填写第一个收货地址",data]);

	// 			   		$scope.shopaddress = false;//显示用户地址，隐藏实体店地址
	// 			   		$scope.allbuyeraddress = true;
				   		
	// 			   		$scope.firstBuyerAddress = false;//隐藏选择地址模块，显示填写第一个地址模块
	// 	            	$scope.buyeraddress = true;

	// 	            	$scope.searchProvinces();

	// 			   	})

	// 	   	})
	// 	   	.error(function(data){
	// 	   		console.log(["没获得当前登录用户账号，未登录",data]);
	// 	   	})
			
	// 	})
	// 	.error(function(data){
	// 		console.log(["登录失败",data]);
	// 	})
	// }


	$scope.loginsuccess=function(data){
		console.log(['登录成功回调',data])
		var currentUserName = data.username;
		var currentAccountId = data.accountId;
		var saveUserMobile = data.mobile;
		$scope.curUserId = data.id;
		$rootScope.curUserId = data.id;
		console.log(["$rootScope.curUserId", $rootScope.curUserId])
			// $rootScope.curUserInfo

		console.log(["$scope.curUserId", $scope.curUserId])
			//获取登录账号（手机号）获取User信息

		// daogouAPI.getUserInfo({username: data.username}, function(currentUserId) { //User存在  根据用户id修改信息
		// 	console.log(['currentUserId',currentUserId])
		// 	$http.put(URLPort + "/users/" + currentUserId + "", {
		// 			"id": currentUserId,
		// 			"account_id": currentAccountId,
		// 			"name": "老3",
		// 			"gender": 1,
		// 			"nick": "zhang3",
		// 			"email": "zy3@qq.com",
		// 			"birthday": 1420017957000,
		// 			"mobile": saveUserMobile,
		// 			"weixin_no": "zy3@qq.com",
		// 			"weixin_nick": "老3就是我",
		// 			"avatar": "http://brand-guide.b0.upaiyun.com/avatar.jpg"
		// 		})
		// 		.success(function(data) {
		// 			console.log(["更新User信息成功", data]);
		// 		})
		// 		.error(function(data) {
		// 			console.log(["更新User信息失败", data]);
		// 		})

		// 	},
		// 	function() { //User不存在
		// 		$http.post(URLPort + "/users", {
		// 				"account_id": currentAccountId,
		// 				"name": "老5",
		// 				"name_py": "lao5",
		// 				"gender": 1,
		// 				"nick": "zhang",
		// 				"email": "zy@qq.com",
		// 				"birthday": 1420017957000,
		// 				"mobile": saveUserMobile,
		// 				"weixin_no": "zy@qq.com",
		// 				"weixin_nick": "老5就是我",
		// 				"avatar": "http://brand-guide.b0.upaiyun.com/avatar.jpg"
		// 			})
		// 			.success(function(data) {
		// 				console.log(["新增User信息成功", data]);
		// 			})
		// 			.error(function(data) {
		// 				console.log(["新增User信息失败", data]);
		// 			})
		// 	})

		// getUserInfo(currentUserName,
		// 	function(currentUserId) { //User存在  根据用户id修改信息
		// 		$http.put(URLPort + "/users/" + currentUserId + "", {
		// 				"id": currentUserId,
		// 				"account_id": currentAccountId,
		// 				"name": "老3",
		// 				"gender": 1,
		// 				"nick": "zhang3",
		// 				"email": "zy3@qq.com",
		// 				"birthday": 1420017957000,
		// 				"mobile": saveUserMobile,
		// 				"weixin_no": "zy3@qq.com",
		// 				"weixin_nick": "老3就是我",
		// 				"avatar": "http://brand-guide.b0.upaiyun.com/avatar.jpg"
		// 			})
		// 			.success(function(data) {
		// 				console.log(["更新User信息成功", data]);
		// 			})
		// 			.error(function(data) {
		// 				console.log(["更新User信息失败", data]);
		// 			})

		// 	},
		// 	function() { //User不存在
		// 		$http.post(URLPort + "/users", {
		// 				"account_id": currentAccountId,
		// 				"name": "老5",
		// 				"name_py": "lao5",
		// 				"gender": 1,
		// 				"nick": "zhang",
		// 				"email": "zy@qq.com",
		// 				"birthday": 1420017957000,
		// 				"mobile": saveUserMobile,
		// 				"weixin_no": "zy@qq.com",
		// 				"weixin_nick": "老5就是我",
		// 				"avatar": "http://brand-guide.b0.upaiyun.com/avatar.jpg"
		// 			})
		// 			.success(function(data) {
		// 				console.log(["新增User信息成功", data]);
		// 			})
		// 			.error(function(data) {
		// 				console.log(["新增User信息失败", data]);
		// 			})
		// 	})

		//登录成功，登录模块隐藏，地址模块不影藏
		$scope.loginhandle = true;
		$scope.alladdress = false;
		$scope.shopaddress = false;
		//查询用户的收获地址信息

		$http.get(URLPort + "/users/" + $scope.curUserId + "/shipping-addresses")
			.success(function(data) {

				if (data.length > 0) {
					console.log(["当前用户有收货地址，选择收获地址", data]);
					$scope.firstBuyerAddress = true; //隐藏填写第一个地址模块，显示选择地址模块
					$scope.buyeraddress = false;
					$scope.weixinpay = false;
					for (var i in data) { //选出默认收货地址
						if (data[i].is_default === 1) {
							$scope.defaultAddressdata = data[i];
						}
					}

				} else {
					console.log(["当前用户没有收货地址，请填写第一个收货地址", data]);
					$scope.shopaddress = false; //显示用户地址，隐藏实体店地址
					$scope.allbuyeraddress = true;
					$scope.firstBuyerAddress = false; //隐藏选择地址模块，显示填写第一个地址模块
					$scope.buyeraddress = true;
					$scope.searchProvinces();

				}

			})
			.error(function(data) {
				console.log(["当前用户没有收货地址，请填写第一个收货地址", data]);

				$scope.shopaddress = false; //显示用户地址，隐藏实体店地址
				$scope.allbuyeraddress = true;

				$scope.firstBuyerAddress = false; //隐藏选择地址模块，显示填写第一个地址模块
				$scope.buyeraddress = true;

				$scope.searchProvinces();

			})
	};
	$scope.loginerror=function(data){
		console.log(["登录失败回调",data])

	};

	$scope.getAddresses = function(){

	}
   //新增用户第一个收货地址信息
    $scope.firstAddressInput = {
    	name:"",
    	mobile:"",
    	provinceInfo : '',
    	cityInfo:'',
    	districtInfo:'',
    	address:"",
    	zip:""
    };

	$scope.addAddress = function(defaultAddress){
		console.log(["$scope.firstAddressInput.provinceInfo", $scope.firstAddressInput.provinceInfo]);

		$http.post(URLPort+"/users/"+$scope.curUserId+"/shipping-addresses",{
			"user_id": $scope.curUserId,
			"name": $scope.firstAddressInput.name,
			"state": $scope.firstAddressInput.provinceInfo.name,
			"state_code": $scope.firstAddressInput.provinceInfo.code,
			"city": $scope.firstAddressInput.cityInfo.name,
			"city_code":  $scope.firstAddressInput.cityInfo.code,
			"district": $scope.firstAddressInput.districtInfo.name,
			"district_code": $scope.firstAddressInput.districtInfo.code,
			"address": $scope.firstAddressInput.address,
			"zip": $scope.firstAddressInput.zip,
			"mobile": $scope.firstAddressInput.mobile,
			"is_default": defaultAddress
		})
		.success(function(data){
			console.log(["增加新地址成功",data]);//新增地址成功，跳转到地址模块，刚才加的地址为默认地址
			$scope.defaultAddressdata = data;
			$scope.loginhandle = true;
			$scope.alladdress = false;
			$scope.shopaddress = false;
			$scope.firstBuyerAddress = true;//隐藏填写第一个地址模块，显示选择地址模块
			$scope.buyeraddress = false;
			$scope.weixinpay = false;
		})
		.error(function(data){
			console.log(["增加新地址失败",data]);//弹出失败提示 停在原页
		})
	}
	//根据选择的省查询市
	$scope.provinceSelect = function(dataobj){
	   	console.log(["selectpinyin",dataobj.pinyin])
	   	
		$http.get(URLPort+"/provinces/"+dataobj.pinyin+"/cities")
	   	.success(function(data){
	    	console.log(["查询省下市成功",data]);
	    	$scope.citiesdata = data;
	   	})
	   	.error(function(data){
	   		console.log(["查询省下市失败",data]);

	   	})
	}

	//根据选择的市查询地区
	$scope.citySelect = function(dataobj1,dataobj2){
		console.log(["selectpinyin1",dataobj1.pinyin])
		console.log(["selectpinyin2",dataobj2.pinyin])

		$http.get(URLPort+"/provinces/"+dataobj1.pinyin+"/cities/"+dataobj2.pinyin+"/districts")
		.success(function(data){
			console.log(["查询市下地区成功",data]);
			$scope.districtsdata = data;
		})
		.error(function(data){
			console.log(["查询市下地区失败",data]);

		})
	}

		
	$scope.deleteAddress = function(){
		$http.delete(URLPort+"/users/"+$scope.curUserId+"/shipping-addresses/18")
		.success(function(){
			console.log("删除地址成功");
			$scope.firstBuyerAddress = true;//隐藏填写第一个地址模块，显示选择地址模块
			$scope.buyeraddress = false;
		})
		.error(function(){
			console.log("删除新地址失败");

			$scope.shopaddress = false;//显示用户地址，隐藏实体店地址
			$scope.allbuyeraddress = true;

			$scope.firstBuyerAddress = false;//隐藏选择地址模块，显示填写第一个地址模块
			console.log(["$scope.firstBuyerAddress!!!!!!",$scope.firstBuyerAddress])
			$scope.buyeraddress = true;

		})
	}
	//查询省
   $scope.searchProvinces = function(){
		$http.get(URLPort+"/provinces")
		.success(function(data){
		$scope.provincesdata = data;
		console.log(["查询省份成功",data]);
		})
		.error(function(data){
		console.log(["查询省份失败",data]);
		})
   }

	$scope.buyerMessage ={
		"buyer_memo":""
	}

	$scope.submitOrder = function(){
		console.log("提交订单");
		console.log(["$stateParams.brandid",$stateParams.brandid]);
		$http.post(URLPort+"/trades",
			{
			"buyer_user_id": $scope.curUserId,
			"bring_guider_id": 12,
			"brand_id": parseInt($stateParams.brandid),
			"buyer_memo": $scope.buyerMessage.buyer_memo,
			"pay_type": "WEIXIN",
			"shipping_type": "express",
			"receiver_state": $scope.defaultAddressdata.state,
			"receiver_state_code": $scope.defaultAddressdata.state_code,
			"receiver_city": $scope.defaultAddressdata.city,
			"receiver_city_code": $scope.defaultAddressdata.city_code,
			"receiver_district": $scope.defaultAddressdata.district,
			"receiver_district_code": $scope.defaultAddressdata.district_cod,
			"receiver_address": $scope.defaultAddressdata.address,
			"receiver_name": $scope.defaultAddressdata.name,
			"receiver_zip": $scope.defaultAddressdata.zip,
			"receiver_mobile": $scope.defaultAddressdata.mobile,
			// "fetch_name": "西门庆",
			// "fetch_store_id": "145",
			// "fetch_store_name": "老西门店",
			// "fetch_state": "上海",
			// "fetch_state_code": "310000",
			// "fetch_city": "上海市",
			// "fetch_city_code": "310100",
			// "fetch_district": "黄浦区",
			// "fetch_district_code": "310101",
			// "fetch_address": "中华路555号",
			// "fetch_subscribe_begin_time": "2015-05-14T11:00:50+0800",
			// "fetch_subscribe_end_time": "2015-05-14T13:00:50+0800",
			"orders": [
			     {
			         "sku_id": $stateParams.skuid,
			         "num": parseInt($stateParams.num),
			         "bring_guider_id": 12
			     }
			 ]
			}
		)
		.success(function(data){
			console.log(["提交订单成功",data]);
			$state.go("orderList")
		})
		.error(function(data){
			console.log(["提交订单失败",data]);
		})

	}


	$scope.logout = function(){
		daogouAPI.logout(function(data){
			console.log(["退出成功",data])

		},function(data){
			console.log(["退出失败",data]);

		})
		// $http.get(URLPort+"/logout")
		// .success(function(data){
		// 	console.log(["退出成功",data])
		// })
		// .error(function(data){
		// 	console.log(["退出失败",data]);
		// })
	}
	$scope.goGoodsShop = function(){//门店地址列表页面
		$state.go("goodsShop",{"userid":$scope.curUserId,"brandid":$stateParams.brandid});
	}
	$scope.changeReceiveInfoFunc = function(){//收货人地址列表页面
		console.log(["userid",$scope.curUserId]);
		$state.go("changeReceiveInfo",{"userid":$scope.curUserId});
	}

})
.controller('goodsShopCtrl',['$scope','$log','$http','daogouAPI','$stateParams',function($scope,$log,$http,daogouAPI,$stateParams){
	$log.debug('goodsShopCtrl');
	daogouAPI.shopAddress("/brands/"+$stateParams.brandid+"/stores/store-fetch",{
		user_id:$stateParams.userid,
		longitude:121.399411,
		latitude:31.168323
	},function(data, status, headers, config){
		console.log(["查询门店列表成功",data]);
		$scope.shopaddressData = data;
	},function(data, status, headers, config){
		console.log(["查询门店列表失败",data]);
	});

	$scope.defaultstorefunc = function(store_id,index){
		console.log("123");
		daogouAPI.defaultstore({
			brand_id:$stateParams.brandid,
			user_id:$stateParams.userid,
			store_id:store_id
		},function(data, status, headers, config){
			for(var i in $scope.shopaddressData){
				$scope.shopaddressData[i].is_default = false;
			}
			$scope.shopaddressData[index].is_default = true;
			console.log(["设置默认取货门店成功",data]);
		    
		},function(data, status, headers, config){
			console.log(["设置默认取货门店失败",data]);
		});
	}





	
}])
.controller('changeReceiveInfoCtrl',['$scope','$log','$http','URLPort','$stateParams','daogouAPI','$state',function($scope,$log,$http,URLPort,$stateParams,daogouAPI,$state){
	$log.debug('changeReceiveInfoCtrl');
	var URLPort = URLPort();
	
		$http.get(URLPort + "/users/" + $stateParams.userid + "/shipping-addresses")
			.success(function(data) {
				$scope.receiverAddressDate = data; 
				console.log(["获取用户收货地址列表成功", data]);
			})
			.error(function(data) {
				console.log(["获取用户收货地址列表失败", data]);
			})


	  $scope.setDefaultAddress = function(addressId,index){
            console.log(["addressId",addressId]);
            daogouAPI.defaultAddress({
            	user_id:$stateParams.userid,
            	address_id:addressId
            },function(data, status, headers, config){
            	for(var i in $scope.receiverAddressDate){
            		$scope.receiverAddressDate[i].is_default = false;
            	}
            	$scope.receiverAddressDate[index].is_default = true;
            	console.log(["设置默认收货地址成功",data]);
                
            },function(data, status, headers, config){
            	console.log(["设置默认收货地址失败",data]);
            });
	  }

	  $scope.gonewAddress = function(){
	  		$state.go("newAddress",{userid:$stateParams.userid});
	  }
	
	
}])
.controller('newAddressCtrl',['$scope','$log','$http','daogouAPI','$stateParams',function($scope,$log,$http,daogouAPI,$stateParams){
	$log.debug('newAddressCtrl');
	//新增用户收货地址信息
	 $scope.newAddressInput = {
	 	name:"1",
	 	mobile:"",
	 	provinceInfo : '',
	 	cityInfo:'',
	 	districtInfo:'',
	 	address:"",
	 	zip:""
	 };
	 
	 daogouAPI.searchProvinces({
	 },function(data, status, headers, config){
	 	$scope.provincesdata = data;
	 	console.log(["查询省份成功",data]);
	 },function(data, status, headers, config){
	 	console.log(["查询省份失败",data]);
	 });

	 //根据选择的省查询市
	 $scope.provinceSelect = function(dataobj){
	    console.log(["selectpinyin",dataobj.pinyin]);
    	daogouAPI.provinceSelect({
    		pinyin:dataobj.pinyin
    	},function(data, status, headers, config){
    		console.log(["查询省下市成功",data]);
    		$scope.citiesdata = data;
    	},function(data, status, headers, config){
    		console.log(["查询省下市失败",data]);
    	});
	 }

	 //根据选择的市查询地区
	 $scope.citySelect = function(dataobj1,dataobj2){
	 	console.log(["selectpinyin1",dataobj1.pinyin]);
	 	console.log(["selectpinyin2",dataobj2.pinyin]);
	 	daogouAPI.citySelect({
	 		pinyin1:dataobj1.pinyin,
	 		pinyin2:dataobj2.pinyin,
	 	},function(data, status, headers, config){
	 		console.log(["查询市下地区成功",data]);
	 		$scope.districtsdata = data;
	 	},function(data, status, headers, config){
	 		console.log(["查询市下地区失败",data]);
	 	});
	 }

	 $scope.addAddressfunc = function(defaultAddress){
	 	console.log(["$scope.newAddressInput.provinceInfo", $scope.newAddressInput.provinceInfo]);
	 	daogouAPI.addAddress({
	 		user_id: $stateParams.userid,
	 		name: $scope.newAddressInput.name,
	 		state: $scope.newAddressInput.provinceInfo.name,
	 		state_code: $scope.newAddressInput.provinceInfo.code,
	 		city: $scope.newAddressInput.cityInfo.name,
	 		city_code:  $scope.newAddressInput.cityInfo.code,
	 		district: $scope.newAddressInput.districtInfo.name,
	 		district_code: $scope.newAddressInput.districtInfo.code,
	 		address: $scope.newAddressInput.address,
	 		zip: $scope.newAddressInput.zip,
	 		mobile: $scope.newAddressInput.mobile,
	 		is_default: defaultAddress
	 	},function(data, status, headers, config){
	 		console.log(["增加新地址成功",data]);//新增地址成功，跳转到地址模块，刚才加的地址为默认地址
	 		$scope.defaultAddressdata = data;
	 	},function(data, status, headers, config){
	 		console.log(["增加新地址失败",data]);//弹出失败提示 停在原页
	 	});
	 }




}])
;