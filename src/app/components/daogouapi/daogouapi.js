'use strict';
// var createOrder=angular.module('createOrder',['ionic']);

var daogouAPImodule=angular.module('daogouAPImodule',['ionic']);

daogouAPImodule.factory('daogouAPI', function($http,$log){
	// 正式接口
	var rootapi='http://yunwan2.3322.org:57099';
	// 测试接口	
	rootapi='';

	var daogouAPI={
		/*
		通用url拼接方法
		apiurl(action,data)
		*/
		apiurl:apiurl,

		/*
		通用get方法
		get(url,scallback,ecallback)
		*/
		get:get,

		/*
		通用get方法
		post(url,scallback,ecallback)
		*/
		post:post,

		/*  
		查询消费者的订单列表
		getOrderList(actionurl,dataobj,scallback,ecallback)
		actionurl 接口
		dataobj(接口数据)  {object}   [必填]
		scallback 成功的回调函数 {function} [必填]
		ecallback 失败的回调函数 {function} [必填]
		*/
		getOrderList:getOrderList,
		
		/*
		daogouProductList(actionurl,dataobj,scallback,ecallback)
		*/
		daogouProductList:daogouProductList,

		/*
		hopAddress(actionurl,dataobj,scallback,ecallback)
		*/		
		shopAddress:shopAddress,

		/*  
		提交退货信息
		submitRefundInfo(actionurl,dataobj,scallback,ecallback)
		actionurl 接口
		dataobj(接口数据)  {object}   [必填]
		scallback 成功的回调函数 {function} [必填]
		ecallback 失败的回调函数 {function} [必填]
		*/
		submitRefundInfo:submitRefundInfo,
		
		// /accounts/current 类似于这种请求地址，没有？。。。后面的参数也不带 {}
		// getshortUrl(url,callback,callbackerror)
		getshortUrl:getshortUrl,

		/*
		登录接口
		login(objdata,password,callback)
		dataobj(接口数据)  {object}   [必填]
			username(账号)	{string}
			password(验证码)	{string}
		scallback 成功的回调函数 {function} [必填]
		ecallback 失败的回调函数 {function} [必填]
		*/
		login:login,
	};

	return daogouAPI;

	function apiurl(action,data) {
		var normaldata={};
		var url =rootapi;
		// var url='http://192.168.51.191:3000';
		//合并对象
		url += action+"?";
		data=angular.extend(data,normaldata);

		for(var key in data){
			url+=key+'='+data[key]+'&';
		}
		return url.slice(0,url.length-1);
	};

	function get(url,scallback,ecallback) {
		$http.get(url)
		.success(function(data, status, headers, config){
			scallback(data, status, headers, config);
		})
		.error(function(data, status, headers, config){
			ecallback(data, status, headers, config);
		});
	};
	function post(url,scallback,ecallback) {
		$http.post(url)
		.success(function(data, status, headers, config){
			scallback(data, status, headers, config);
		})
		.error(function(data, status, headers, config){
			ecallback(data, status, headers, config);
		});
	};


	function getOrderList(actionurl,dataobj,scallback,ecallback) {
		var action=actionurl;
		var data={
			page: typeof dataobj.page === 'number' ? dataobj.page : 1,
			per_page: typeof dataobj.per_page === 'number' ? dataobj.per_page : 5,
			show_orders: typeof dataobj.show_orders === 'boolean' ? dataobj.show_orders : false
		};
		
		daogouAPI.get(daogouAPI.apiurl(action,data),scallback,ecallback);
	};


	function daogouProductList(actionurl,dataobj,scallback,ecallback) {
		var action=actionurl;
		var data={
			guiderId: dataobj.guiderId,
			brandId: dataobj.brandId,
			page: typeof dataobj.page === 'number' ? dataobj.page : 1,
			per_page: typeof dataobj.per_page === 'number' ? dataobj.per_page : 5
		};
		
		daogouAPI.get(daogouAPI.apiurl(action,data),scallback,ecallback);
	};

	function shopAddress(actionurl,dataobj,scallback,ecallback) {
		var action=actionurl;
		var data={
			user_id: dataobj.user_id,
			longitude: dataobj.longitude,
			latitude: dataobj.latitude,
			page: typeof dataobj.page === 'number' ? dataobj.page : 1,
			per_page: typeof dataobj.per_page === 'number' ? dataobj.per_page : 5
		};
		
		daogouAPI.get(daogouAPI.apiurl(action,data),scallback,ecallback);
	};


	function submitRefundInfo(actionurl,dataobj,scallback,ecallback) {
		var action=actionurl;
		var data={
			page: typeof dataobj.page === 'number' ? dataobj.page : 1,
			per_page: typeof dataobj.per_page === 'number' ? dataobj.per_page : 5,
			show_orders: typeof dataobj.show_orders === 'boolean' ? dataobj.show_orders : false
		};
		
		daogouAPI.post(daogouAPI.apiurl(action,data),scallback,ecallback);
	};


	function getshortUrl(url,callback,callbackerror){
			$http.get(url)
			.success(function(data){
				callback(data);
			})
			.error(function(data){
				callbackerror(data);
			})
	};


	function login(dataobj,scallback,ecallback){
		if(!angular.isString(dataobj.username)||!angular.isString(dataobj.password)){
			ecallback('daogouAPI.login传入参数错误 {username,password');
			return;
		}
		var data={
			username:username,
			password:password,
		};

		daogouAPI.post(daogouAPI.apiurl('brand-login',data),scallback,ecallback);
	};


});






