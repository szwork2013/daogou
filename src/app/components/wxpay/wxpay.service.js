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

.factory('countConfigInfo', function(sha1) {
	return function countconfiginfo(appid, jsapi_ticket) {
		var nonceStr = Math.random().toString(36).substr(2, 15);
		var timestamp = parseInt(new Date().getTime() / 1000) + '';

		var signatureData = {
			jsapi_ticket: jsapi_ticket,
			nonceStr: nonceStr,
			timestamp: timestamp,
			url: window.location.href.split('#')[0]
		};
		//signature  拼接字符串
		var signatureString = spellstring(signatureData);
		//signature  sha1签名
		var signature = sha1(signatureString);

		var configinfo = {
			appId: appid,
			timestamp: timestamp,
			nonceStr: nonceStr,
			signature: signature
		};

		return configinfo;


		function spellstring(args) {
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
	};
})



.factory('pay', function(daogouAPI) {
	return function pay(brandId) {
		// 'https://open.weixin.qq.com/connect/oauth2/authorize?
		// appid=wx1b83843264997d6b&
		// redirect_uri=http://yunwan2.3322.org:57093/wechat/auth/callback&
		// response_type=code&
		// scope=snsapi_base&
		// state=YnJhbmRfaWQ9MSZ0PWRlbW8mdXNlcl9pZD00JnRpZD0xMjM=
		// #wechat_redirect'

		buybuybuy()




		function buybuybuy(){
			daogouAPI.tradesPay({tid:18615519548506000},function(data){
				console.log(['tradesPay成功',data])
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
		}





	};
})



;















