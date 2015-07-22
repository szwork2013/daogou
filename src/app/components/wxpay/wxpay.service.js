'use strict';

angular.module('daogou')
/*
微信JSSDK config
获取公众号信息
拼接好config信息传入回调函数
*/
.factory('WXconfig', function(daogouAPI, WXcountConfigInfo) {
	return function WXconfig(brandId, callback) {

		daogouAPI.WXgetAppid(brandId, function(wxdata) {
			console.log(['微信公众号信息 成功', wxdata]);
			var configdata = WXcountConfigInfo(wxdata.appid, wxdata.js_api_ticket);
			callback(configdata)
		}, function(data) {
			console.log(['微信公众号信息 失败', data]);

		});

	};
})

/*
微信支付
有openid直接调用支付
没有openid获取openID
*/
.factory('WXpay', function($rootScope,daogouAPI,WXJSSDKPay,WXgetOpenid) {
	return function WXpay(brandId,tid,callback) {

		/*以下注释代码请不要删除*/
		// weixinpay();
		// function weixinpay(){
		// 	daogouAPI.tradesPay({tid:tid,pay_type : 'WEIXIN'},function(data){
		// 		console.log(['tradesPay成功', data])
		// 		WXJSSDKPay(data.pre_pay_no,callback)//微信支付新接口
		// 	},function(data){
		// 		//下单失败说明用户没有openid 用此方法让用户获得openid
		// 		WXgetOpenid(tid,function(data){
		// 			// alert('wxpay.service.js:158 获取openid成功'+JSON.stringify(data))
		// 			//取到openid后再进行支付
		// 			weixinpay()
		// 		},function(data){
		// 			// alert('wxpay.service.js:162 获取openid失败，支付失败'+JSON.stringify(data))
		// 		})
		// 	});
		// }

		/*以下注释代码请不要删除*/
		//默认先更新openid再支付  若已更新则直接进行支付
		//解决BUG：第一次支付取消后  再点支付因code已消费 而无法再次取得openid  导致回调失败而无法支付
		// if(!$rootScope.HASGETOPENID){
		// 	//用此方法让用户获得openid
		// 	WXgetOpenid(tid,function(data){
		// 		$rootScope.HASGETOPENID=true;
		// 		// 获取订单ID后发起微信支付
		// 		weixinpay()
		// 	},function(data){
		// 		// alert(JSON.stringify(data));
		// 	})
		// }else{
		// 	weixinpay()
		// }




		//用此方法让用户获得openid
		WXgetOpenid(tid,function(data){
			$rootScope.HASGETOPENID=true;
			// 获取订单ID后发起微信支付
			weixinpay()
		},function(data){
			//为啥取openid失败还要调用支付嘞？
			//解决BUG：第一次支付取消后  再点支付因code已消费 而无法再次取得openid  导致回调失败而无法支付
			weixinpay()
		})

		// 获取订单ID后发起微信支付
		function weixinpay(){
			daogouAPI.tradesPay({tid:tid,pay_type : 'WEIXIN'},function(data){
				console.log(['tradesPay成功', data])
				WXJSSDKPay(data.pre_pay_no,callback)//微信支付新接口
			},function(data){

			});
		}


	};
})


/*
JSSDK-微信支付
WXJSSDKPay(callback);
支付完成执行传入的回调函数
*/
.factory('WXJSSDKPay', function($rootScope,WXnonceStr,WXtimestamp,WXpaySpellstring,MD5){
	return function WXJSSDKPay(prepay_id,callback){

		var timestamp = WXtimestamp();

		var nonceStr = WXnonceStr();

		var paySignData = {
			appId: $rootScope.WXINFO.appid,
			timeStamp: timestamp,
			nonceStr: nonceStr,
			package: 'prepay_id=' + prepay_id,
			signType: 'MD5',
		};
		//paySign  拼接字符串
		var paySignString = WXpaySpellstring(paySignData);
		//paySign  sha1签名
		var paySign = MD5(paySignString + '&key=' + $rootScope.WXINFO.mch_key).toUpperCase();

		//微信支付新接口
		wx.chooseWXPay({
			// appId: $rootScope.WXINFO.appid,
			timestamp: timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
			nonceStr: nonceStr, // 支付签名随机串，不长于 32 位
			package: 'prepay_id=' + prepay_id, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
			signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
			paySign: paySign, // 支付签名
			success: function(res) {
				// alert(JSON.stringify(res))
				callback(res);
			}
		});

		//微信支付老接口
		// 	if (typeof WeixinJSBridge == 'undefined') {
		// 		if (document.addEventListener) {
		// 			document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
		// 		} else if (document.attachEvent) {
		// 			document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
		// 			document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
		// 		}
		// 	} else {
		// 		onBridgeReady();
		// 	}

		// 	function onBridgeReady() {
		// 		WeixinJSBridge.invoke(
		// 			'getBrandWCPayRequest',
		// 			{paySign:paySign},
		// 			function(res) {
		// 				if (res.err_msg == 'get_brand_wcpay_request:ok') {
		// 					alert('支付成功')
		// 				} else {
		// 					alert('支付失败')
		// 				}
		// 			}
		// 		);
		// 	}

	};
})

/*
获取openid
并将openid绑定给用户
执行回调
*/
.factory('WXgetOpenid', function($rootScope,getRequest,daogouAPI){
	return function WXgetOpenid(tid,scallback,ecallback){

			var code=getRequest('code');
			// http://mp.weixin.qq.com/wiki/17/c0f37d5704f0b64713d5d2c37b468d75.html#.E7.AC.AC.E4.B8.80.E6.AD.A5.EF.BC.9A.E7.94.A8.E6.88.B7.E5.90.8C.E6.84.8F.E6.8E.88.E6.9D.83.EF.BC.8C.E8.8E.B7.E5.8F.96code
			//没有code去取code
			if(!code){
					// '&redirect_uri='+encodeURIComponent('http://yunwan2.3322.org:57099/shopping/index.html#/productDetail/100030')+
				var getCodeUrl='https://open.weixin.qq.com/connect/oauth2/authorize?'+
					'appid='+$rootScope.WXINFO.appid+
					'&redirect_uri='+encodeURIComponent(window.location.href.split('#')[0]+'&tid='+tid)+
					'&response_type=code'+
					'&scope=snsapi_base'+
					'#wechat_redirect';
					console.log(getCodeUrl)
					window.location.href=getCodeUrl
			}else{
				//有code就去获取openid
				daogouAPI.getOpenid({
					code:code,
					brand_id:$rootScope.BRANDID
				},function(openiddata){

					var userInfo = window.sessionStorage.getItem("USERINFO");

					var USERINFO = JSON.parse(userInfo);

					//绑定openis
					daogouAPI.bindOpenid({
						brand_id:$rootScope.BRANDID,
						user_id:USERINFO.id,
						wx_open_id:openiddata.openid
					},function(data){
						// alert('wxpay.service.js:303  获取成功'+JSON.stringify(data));
						scallback(data);
					},function(data){
						alert('wxpay.service.js:307 绑定openid失败'+JSON.stringify(data));
						ecallback(data);
					})
				},function(data){
					ecallback(data);
				});
			}

	};
})

/*
拼接config信息
传入相关参数
返回拼接好的 微信config信息
*/
.factory('WXcountConfigInfo', function(sha1,WXnonceStr,WXtimestamp,WXconfigSpellstring) {

	return function WXcountconfiginfo(appid, jsapi_ticket) {

		var nonceStr =WXnonceStr();// Math.random().toString(36).substr(2, 15);
		var timestamp =WXtimestamp();// parseInt(new Date().getTime() / 1000) + '';

		var signatureData = {
			jsapi_ticket: jsapi_ticket,
			nonceStr: nonceStr,
			timestamp: timestamp,
			url: window.location.href.split('#')[0]
			// url:window.location.hostname
		};
		// alert(signatureData.url)
		console.log()
		//signature  拼接字符串
		var signatureString = WXconfigSpellstring(signatureData);
		//signature  sha1签名
		var signature = sha1(signatureString);

		var configinfo = {
			appId: appid,
			timestamp: timestamp,
			nonceStr: nonceStr,
			signature: signature
		};

		return configinfo;
	};
})
/*
微信JSSDK config随机字符串小工具
*/
.factory('WXnonceStr', function(){
	return function WXnonceStr(){
		return Math.random().toString(36).substr(2, 15);
	}
})
/*
微信JSSDK config 时间戳小工具
*/
.factory('WXtimestamp', function(){
	return function WXtimestamp(){
		return parseInt(new Date().getTime() / 1000) + '';
	}
})

/*
微信JSSDK config拼接字符串小工具
*/
.factory('WXconfigSpellstring', function(){
	return function WXconfigSpellstring(args){
		/*
		拼接规则 请看如下地址  搜索“附录1”
		http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html
		*/
		//排序
		var keys = Object.keys(args);
		keys = keys.sort();
		var newArgs = {};
		//小写
		keys.forEach(function(key) {
			newArgs[key.toLowerCase()] = args[key];
		});
		//拼接
		var string = '';
		for (var k in newArgs) {
			string += '&' + k + '=' + newArgs[k];
		}
		string = string.substr(1);
		return string;
	};
})
/*
微信支付 拼接字符串小工具
*/
.factory('WXpaySpellstring', function(){
	return function WXpaySpellstring(args){
		/*
		拼接规则 请看如下地址  搜索“附录1”
		http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html
		*/
		//排序
		var keys = Object.keys(args);
		keys = keys.sort();
		var newArgs = {};
		//小写
		keys.forEach(function(key) {
			newArgs[key] = args[key];
		});
		//拼接
		var string = '';
		for (var k in newArgs) {
			string += '&' + k + '=' + newArgs[k];
		}
		string = string.substr(1);
		return string;
	};
})
;
