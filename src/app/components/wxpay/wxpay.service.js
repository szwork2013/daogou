'use strict';

angular.module('daogou')
.factory('wxconfig', function(daogouAPI, WXcountConfigInfo) {
	return function wxconfig(brandId, callback) {

		daogouAPI.WXgetAppid(brandId, function(wxdata) {
			console.log(['微信公众号信息 成功', wxdata]);
			var configdata = WXcountConfigInfo(wxdata.appid, wxdata.js_api_ticket);
			callback(configdata)
		}, function(data) {
			console.log(['微信公众号信息 失败', data]);

		});

	};
})

.factory('WXnonceStr', function(){
	return function WXnonceStr(){
		return Math.random().toString(36).substr(2, 15);
	}
})

.factory('WXtimestamp', function(){
	return function WXtimestamp(){
		return parseInt(new Date().getTime() / 1000) + '';
	}
})

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


		// function spellstring(args) {
		// 	/*
		// 	拼接规则 请看如下地址  搜索“附录1”
		// 	http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html
		// 	*/
		// 	//排序
		// 	var keys = Object.keys(args);
		// 	keys = keys.sort();
		// 	var newArgs = {};
		// 	//小写
		// 	keys.forEach(function(key) {
		// 		newArgs[key.toLowerCase()] = args[key];
		// 	});
		// 	//拼接
		// 	var string = '';
		// 	for (var k in newArgs) {
		// 		string += '&' + k + '=' + newArgs[k];
		// 	}
		// 	string = string.substr(1);
		// 	return string;
		// };
	};
})



.factory('WXpay', function($rootScope,daogouAPI,WXnonceStr,WXtimestamp,WXpaySpellstring,MD5) {
	return function WXpay(brandId,tid,callback) {
		// 'https://open.weixin.qq.com/connect/oauth2/authorize?
		// appid=wx1b83843264997d6b&
		// redirect_uri=http://yunwan2.3322.org:57093/wechat/auth/callback&
		// response_type=code&
		// scope=snsapi_base&
		// state=YnJhbmRfaWQ9MSZ0PWRlbW8mdXNlcl9pZD00JnRpZD0xMjM=
		// #wechat_redirect'

		daogouAPI.tradesPay({tid:tid,pay_type : 'WEIXIN'},function(data){
			console.log(['tradesPay成功', data])

			wxpay2(data)//微信支付新接口
			// wxpay1(data)//微信支付老接口
		},function(data){
			console.log(['tradesPay失败',data])

			var dataobj = {
				brand_id: brandId,
				redirect_uri: window.location.href,
			};

			daogouAPI.WXgetAuthurl(dataobj, function(authurl) {
				console.log(['authurl 成功', authurl])
				// window.location.href=authurl;
			}, function(data) {
				console.log(['authurl 失败', data])
			})

		});


		//微信支付老接口
		function wxpay1(data) {
			if (typeof WeixinJSBridge == 'undefined') {
				if (document.addEventListener) {
					document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
				} else if (document.attachEvent) {
					document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
					document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
				}
			} else {
				onBridgeReady();
			}

			var timestamp = WXtimestamp();

			var nonceStr = WXnonceStr();

			var paySignData = {
				appId: $rootScope.WXINFO.appid,
				timestamp: timestamp,
				nonceStr: nonceStr,
				package: 'prepay_id=' + data.pre_pay_no,
				signType: 'MD5',
			};
			var paySignString = WXconfigSpellstring(paySignData);
			var paySign = MD5(paySignString + '&key=' + $rootScope.WXINFO.mch_key).toUpperCase();
			paySignData.paySign=paySign;


			function onBridgeReady() {
				// var time = Date.now();
				// var payid = 'wx2015060315253068388eef800437987255';
				// var key = 'shuyunwdg20150603qwertyuiopasdfg';
				// var stringA = 'appId=wx1b83843264997d6b&nonceStr=pay.demo&package=prepay_id=' + payid + '&signType=MD5&timeStamp=' + time;
				WeixinJSBridge.invoke(
					'getBrandWCPayRequest',
					paySignData,
					function(res) {
						alert(JSON.stringify(res))
						if (res.err_msg == 'get_brand_wcpay_request:ok') {
							alert('支付成功')
						} else {
							alert('支付失败')
						}
					}
				);
			}
		}

		//微信支付新接口
		function wxpay2(data){
			// alert(JSON.stringify(data));

			var timestamp = WXtimestamp();

			var nonceStr = WXnonceStr();

			var paySignData = {
				appId: $rootScope.WXINFO.appid,
				timeStamp: timestamp,
				nonceStr: nonceStr,
				package: 'prepay_id=' + data.pre_pay_no,
				signType: 'MD5',
			};
			console.log(paySignData)
			
			//paySign  拼接字符串
			var paySignString = WXpaySpellstring(paySignData);
			console.log(paySignString)
			//paySign  sha1签名
			var paySign = MD5(paySignString + '&key=' + $rootScope.WXINFO.mch_key).toUpperCase();
			console.log(paySign)
			// var paySignString="appId="+paySignData.appId + "&nonceStr="+paySignData.nonceStr + "&package="+paySignData.package+"&signType=MD5&timeStamp=" + paySignData.timeStamp + "&key="+$rootScope.WXINFO.mch_key;
			// console.log(paySignString)

			// var paySign = MD5(paySignString);
			// console.log(paySign)

			wx.chooseWXPay({
				// appId: $rootScope.WXINFO.appid,
				timestamp: timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
				nonceStr: nonceStr, // 支付签名随机串，不长于 32 位
				package: 'prepay_id=' + data.pre_pay_no, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
				signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
				paySign: paySign, // 支付签名
				success: function(res) {
					// 支付成功后的回调函数
					callback(res);
				}
			});
		}

	};
})
.factory('WXgetOpenid', function($rootScope,getRequest){
	return function WXgetOpenid(scallback,ecallback){

			var code=getRequest('code');
			if($rootScope.DEBUG){
				scallback('测试期间不跳转微信')
			}
			// http://mp.weixin.qq.com/wiki/17/c0f37d5704f0b64713d5d2c37b468d75.html#.E7.AC.AC.E4.B8.80.E6.AD.A5.EF.BC.9A.E7.94.A8.E6.88.B7.E5.90.8C.E6.84.8F.E6.8E.88.E6.9D.83.EF.BC.8C.E8.8E.B7.E5.8F.96code
			//没有code去取code
			if(!code){
				var getCodeUrl='https://open.weixin.qq.com/connect/oauth2/authorize?'+
					'appid='+$rootScope.WXINFO.appid+
					'&redirect_uri='+encodeURIComponent(window.location.href.split('#')[0])+
					// '&redirect_uri='+encodeURIComponent('http://yunwan2.3322.org:57099/shopping/index.html#/productDetail/100030')+
					'&response_type=code'+
					'&scope=snsapi_base'+
					'#wechat_redirect';
					// console.log(getCodeUrl)
					window.location.href=getCodeUrl
			}else{
				var getOpenIdUrl='https://api.weixin.qq.com/sns/oauth2/access_token?'+
					'appid='+$rootScope.WXINFO.appid+
					'&secret='+secret+
					'&code='+CODE+
					'&grant_type=authorization_code'
				$http.get(getOpenIdUrl)
				.success(function(data){
					// {
					// "access_token":"ACCESS_TOKEN",
					// "expires_in":7200,
					// "refresh_token":"REFRESH_TOKEN",
					// "openid":"OPENID",
					// "scope":"SCOPE",
					// "unionid": "o6_bmasdasdsad6_2sgVt7hMZOPfL"
					// }
					$rootScope.OPENID=data.openid;
					scallback(data)
				})
				.error(function(data){
					ecallback(data)
				});
			}
	// http://yunwan2.3322.org:57099/shopping/index.html?gid=123&did=123&code=011bdd7db4b36877a9015cb276a1a72n&state=
	// var CODE='011bdd7db4b36877a9015cb276a1a72n'

	};
})


;















