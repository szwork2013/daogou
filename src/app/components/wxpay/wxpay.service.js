'use strict';

angular.module('daogou')
.factory('wxconfig', function(daogouAPI, countConfigInfo) {
	return function wxconfig(brandId, callback) {

		daogouAPI.WXgetAppid(brandId, function(wxdata) {
			console.log(['微信公众号信息 成功', wxdata]);
			var configdata = countConfigInfo(wxdata.appid, wxdata.js_api_ticket);
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

.factory('WXspellstring', function(){
	return function WXspellstring(args){
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

.factory('countConfigInfo', function(sha1,WXnonceStr,WXtimestamp,WXspellstring) {


	return function countconfiginfo(appid, jsapi_ticket) {

		var nonceStr =WXnonceStr();// Math.random().toString(36).substr(2, 15);
		var timestamp =WXnonceStr();// parseInt(new Date().getTime() / 1000) + '';

		var signatureData = {
			jsapi_ticket: jsapi_ticket,
			nonceStr: nonceStr,
			timestamp: timestamp,
			url: window.location.href.split('#')[0]
			// url:window.location.hostname
		};
		console.log()
		//signature  拼接字符串
		var signatureString = WXspellstring(signatureData);
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



.factory('pay', function(daogouAPI,WXnonceStr,WXtimestamp,WXspellstring,sha1) {
	return function pay(brandId,tid,callback) {
		// 'https://open.weixin.qq.com/connect/oauth2/authorize?
		// appid=wx1b83843264997d6b&
		// redirect_uri=http://yunwan2.3322.org:57093/wechat/auth/callback&
		// response_type=code&
		// scope=snsapi_base&
		// state=YnJhbmRfaWQ9MSZ0PWRlbW8mdXNlcl9pZD00JnRpZD0xMjM=
		// #wechat_redirect'

		daogouAPI.tradesPay({
				tid:tid,
				pay_type : "WEIXIN"
			},function(data){
			console.log(['tradesPay成功',data])

			alert(JSON.stringify(data));

			var timestamp=WXtimestamp();

			var nonceStr=WXnonceStr();

			var paySignData={
				appId:$rootScope.WXINFO.appid,
				timestamp: timestamp,
				nonceStr: nonceStr, 
				package: 'prepay_id='+data.pre_pay_no, 
				signType: 'SHA1', 
			};

			//paySign  拼接字符串
			var paySignString = WXspellstring(paySignData);
			//paySign  sha1签名
			var paySign = sha1(signatureString);


			wx.chooseWXPay({
				timestamp: timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
				nonceStr: nonceStr, // 支付签名随机串，不长于 32 位
				package: 'prepay_id='+data.pre_pay_no, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
				signType: 'SHA1', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
				paySign: paySign, // 支付签名
				success: function (res) {
				// 支付成功后的回调函数
					callback(res);
				}
			});

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



	};
})



;















