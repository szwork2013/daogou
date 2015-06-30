'use strict';

angular.module('daogou')
.factory('daogouAPI', function($rootScope,$http,$log,URLPort){
	// 正式接口

	var ROOT_URL='http://yunwan2.3322.org:57099';
	
	ROOT_URL = URLPort();
	// 测试接口	
	// ROOT_URL='';

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
		通用post方法
		post(url,scallback,ecallback)
		*/
		post:post,
		/*
		通用patch方法
		patch(url,scallback,ecallback)
		*/
		patch:patch,
		/*
		通用delete方法
		delete(url,scallback,ecallback)
		*/
		deletef:deletef,

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
		login(dataobj,password,callback)
		dataobj(接口数据)  {object}   [必填]
			username(账号)	{string}
			password(验证码)	{string}
		scallback 成功的回调函数 {function} [必填]
		ecallback 失败的回调函数 {function} [必填]
		*/
		login:login,
		/*
		获取购物车商品列表接口
		scallback 成功的回调函数 {function} [必填]
		ecallback 失败的回调函数 {function} [必填]
		*/
		shopcart:shopcart,
		/*
		批量删除购物车商品
		scallback 成功的回调函数 {function} [必填]
		ecallback 失败的回调函数 {function} [必填]
		*/
		deleteCartProduct:deleteCartProduct,

		/*
		account注册用户
		*/
		register:register,

		/*
		account添加用户info
		*/
		registerInfo:registerInfo,

		/*
		检测用户是否存在		
		*/
		isRegistered:isRegistered,

		/*
		检测用户是否登录  返回user信息
		*/
		isLogin:isLogin,

		/*
		检测用户是否登录  返回account信息
		*/
		isAccountLogin:isAccountLogin,

		/*
		设置默认取货门店		
		*/
		defaultstore:defaultstore,

		/*
		user获取用户信息
		*/
		getUserInfo:getUserInfo,

		/*
		user添加用户信息
		*/
		setUserInfo:setUserInfo,

		/*
		退出登录
		*/
		logout:logout,
		/*
		查询省
		*/
		searchProvinces:searchProvinces,
		/*
		根据选择的省查询市
		*/
		provinceSelect:provinceSelect,
		/*
		根据选择的市查询地区
		*/
		citySelect:citySelect,
		/*
		添加地址
		*/
		addAddress:addAddress,


		/*
		获取微信ticket
		*/
		WXgetTicket:WXgetTicket,

		/*
		获取微信授权地址
		*/

		WXgetAuthurl:WXgetAuthurl,

		/*
		根据品牌id获取公众号信息
		*/
		WXgetAppid:WXgetAppid,

		/*
		设置默认收货地址		
		*/
		defaultAddress:defaultAddress,


		/*支付接口*/
		tradesPay:tradesPay,
	};

	return daogouAPI;

	function apiurl(action,data) {

		var url =ROOT_URL+action;

		if(typeof data==='object'){
			url+='?';
			for(var key in data){
				url+=key+'='+data[key]+'&';
			}
			url=url.slice(0,url.length-1);
		}

		return url;
	}

	function get(url,scallback,ecallback) {
		$http.get(url)
		.success(function(data, status, headers, config){
			scallback(data, status, headers, config);
		})
		.error(function(data, status, headers, config){
			ecallback(data, status, headers, config);
		});
	}

	function post(action,data,scallback,ecallback) {
		var url=ROOT_URL+action;
		$http.post(url,data)
		.success(function(data, status, headers, config){
			scallback(data, status, headers, config);
		})
		.error(function(data, status, headers, config){
			ecallback(data, status, headers, config);
		});
	}

	function deletef(url,scallback,ecallback) {
		$http.delete(url)
		.success(function(data, status, headers, config){
			scallback(data, status, headers, config);
		})
		.error(function(data, status, headers, config){
			ecallback(data, status, headers, config);
		});
	}


	function patch(action,data,scallback,ecallback) {
		var url=ROOT_URL+action;
		$http.patch(url,data)
		.success(function(data, status, headers, config){
			scallback(data, status, headers, config);
		})
		.error(function(data, status, headers, config){
			ecallback(data, status, headers, config);
		});
	}

	function getOrderList(actionurl,dataobj,scallback,ecallback) {
		var action=actionurl;
		var data={
			page: typeof dataobj.page === 'number' ? dataobj.page : 1,
			per_page: typeof dataobj.per_page === 'number' ? dataobj.per_page : 5,
			show_orders: typeof dataobj.show_orders === 'boolean' ? dataobj.show_orders : false
		};
		
		daogouAPI.get(daogouAPI.apiurl(action,data),scallback,ecallback);
	}


	function daogouProductList(actionurl,dataobj,scallback,ecallback) {
		var action=actionurl;
		var data={
			guiderId: dataobj.guiderId,
			brandId: dataobj.brandId,
			page: typeof dataobj.page === 'number' ? dataobj.page : 1,
			per_page: typeof dataobj.per_page === 'number' ? dataobj.per_page : 5
		};
		
		daogouAPI.get(daogouAPI.apiurl(action,data),scallback,ecallback);
	}

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
	}


	function submitRefundInfo(actionurl,dataobj,scallback,ecallback) {
		var action=actionurl;
		var data={
			page: typeof dataobj.page === 'number' ? dataobj.page : 1,
			per_page: typeof dataobj.per_page === 'number' ? dataobj.per_page : 5,
			show_orders: typeof dataobj.show_orders === 'boolean' ? dataobj.show_orders : false
		};
		
		daogouAPI.post(daogouAPI.apiurl(action,data),scallback,ecallback);
	}


	function getshortUrl(url,callback,callbackerror){
			$http.get(url)
			.success(function(data){
				callback(data);
			})
			.error(function(data){
				callbackerror(data);
			})
	}


	function login(dataobj,scallback,ecallback){

		if(!angular.isString(dataobj.username)||!angular.isString(dataobj.password)){
			ecallback('daogouAPI.login传入参数错误 username,password');
			return;
		}
		var action='/brand-login';
		var data={
			username:dataobj.username,
			password:dataobj.password,
		};

		daogouAPI.get(daogouAPI.apiurl(action,data),scallback,ecallback);
	}


	function shopcart (dataobj,scallback,ecallback) {

		var action='/users/'+dataobj.userid+'/shopping-carts';
		var data={
			brand_id: dataobj.brand_id,
			page: typeof dataobj.page === 'number' ? dataobj.page : 1,
			per_page: typeof dataobj.per_page === 'number' ? dataobj.per_page : 5
		};

		daogouAPI.get(daogouAPI.apiurl(action,data),scallback,ecallback);
	}



	function register(username,scallback,ecallback){
		var action='/accounts/register';
		var data={
			username:username,
			password:'admin',
			enabled:true,
		};

		daogouAPI.post(action,data,scallback,ecallback);
	}

	function registerInfo(dataobj,scallback,ecallback){
		var action='/accounts/register/info';
		var data = {
			username:dataobj.username,
			mobile:dataobj.username,
		};
		daogouAPI.post(action,data,scallback,ecallback);
	}

	function isRegistered(username,scallback,ecallback){
		if(!angular.isString(username)&&!angular.isNumber(username)){
			ecallback('daogouAPI.isRegistered传入的username不是字符串');
			return;
		}
		var action='/accounts/exists';
		var data={
			username:username,
		};
		daogouAPI.get(daogouAPI.apiurl(action,data),scallback,ecallback);
	}


	function isLogin(scallback,ecallback){
		var action='/accounts/current';
		var data='';
		daogouAPI.get(daogouAPI.apiurl(action,data),function(data){
			daogouAPI.getUserInfo(data,scallback,ecallback)
		},ecallback);
	}

	function isAccountLogin(scallback,ecallback){
		var action='/accounts/current';
		var data='';

		daogouAPI.get(daogouAPI.apiurl(action,data),scallback,ecallback);
	}
	
	function deleteCartProduct (dataobj,scallback,ecallback) {

		var action='/users/'+dataobj.userid+'/shopping-carts';
		var data={
			ids:dataobj.ids
		};

		daogouAPI.deletef(daogouAPI.apiurl(action,data),scallback,ecallback);
	}

	function defaultstore (dataobj,scallback,ecallback) {

		var action='/brands/'+dataobj.brand_id+'/users/'+dataobj.user_id+'/stores/'+dataobj.store_id+'/store-fetch/default';
		var data='';

		daogouAPI.patch(daogouAPI.apiurl(action,data),scallback,ecallback);
	}
	


	function getUserInfo(dataobj,scallback,ecallback){
		var action='/users/mobiles/'+dataobj.username;
		var data='';
		daogouAPI.get(daogouAPI.apiurl(action,data),function(data){
			//设置 rootScope.USERINFO
			$rootScope.USERINFO = {
				id:data.id,
				mobile:data.mobile
			};
			scallback(data);
		},ecallback);
	}

	function setUserInfo(dataobj,scallback,ecallback){
		var action='/users';
		var data = {
			username:dataobj.username,
			mobile:dataobj.username,
			accountId:dataobj.accountId,
		};

		daogouAPI.post(action,data,scallback,ecallback);

	}

	function logout(scallback,ecallback){
		var action='/logout';
		var data='';
		daogouAPI.get(daogouAPI.apiurl(action,data),scallback,ecallback);
	}


	function searchProvinces(dataobj,scallback,ecallback){
		var action='/provinces';
		var data ='';
		daogouAPI.get(daogouAPI.apiurl(action,data),scallback,ecallback);

	}

	function provinceSelect(dataobj,scallback,ecallback){
		var action="/provinces/"+dataobj.pinyin+"/cities";
		var data = '';

		daogouAPI.get(daogouAPI.apiurl(action,data),scallback,ecallback);

	}

	function citySelect(dataobj,scallback,ecallback){
		var action="/provinces/"+dataobj.pinyin1+"/cities/"+dataobj.pinyin2+"/districts";
		var data = '';

		daogouAPI.get(daogouAPI.apiurl(action,data),scallback,ecallback);

	}

	function addAddress(dataobj,scallback,ecallback){
		var action="/users/"+dataobj.user_id+"/shipping-addresses";
		var data = {
			user_id: dataobj.user_id,
			name: dataobj.name,
			state: dataobj.state,
			state_code: dataobj.state_code,
			city: dataobj.city,
			city_code:  dataobj.city_code,
			district: dataobj.district,
			district_code:dataobj.district_code,
			address: dataobj.address,
			zip: dataobj.zip,
			mobile: dataobj.mobile,
			is_default: dataobj.is_default
		};

		daogouAPI.post(daogouAPI.apiurl(action,data),scallback,ecallback);

	}

	function WXgetTicket(brand_id,scallback,ecallback){
		var action='/weixin/jsapi-ticket';
		var data={
			brand_id:brand_id
		};
		daogouAPI.get(daogouAPI.apiurl(action,data),scallback,ecallback);
	}

	function WXgetAuthurl(dataobj,scallback,ecallback){
		var action='/weixin/auth/url';
		var data={
			brand_id:dataobj.brand_id,
			redirect_uri:dataobj.redirect_uri
		};
		daogouAPI.post(action,data,scallback,ecallback);
	}


	function WXgetAppid(brand_id,scallback,ecallback){
		var action='/weixin/accounts/brands/'+brand_id;
		var data="";
		daogouAPI.get(daogouAPI.apiurl(action,data),function(wxdata){
			$rootScope.WXINFO={
				appid:wxdata.appid,
				js_api_ticket:wxdata.js_api_ticket,
				mch_key:wxdata.mch_key
			}
			scallback(wxdata)
		},ecallback);
	}

	function defaultAddress (dataobj,scallback,ecallback) {

		var action='/users/'+dataobj.user_id+'/shipping-addresses/'+dataobj.address_id+'/default';
		var data='';

		daogouAPI.patch(action,data,scallback,ecallback);
	}
	
	function tradesPay(dataobj,scallback,ecallback){
		var action='/trades/'+dataobj.tid+'/buyer-pay';
		var data={
			tid:dataobj.tid,
			pay_type:dataobj.pay_type
		};
		daogouAPI.patch(action,data,scallback,ecallback);
	}

});































