var servicesFactory = angular.module("servicesFactory",['ionic']);

servicesFactory.factory('checklocalimg', function(){
	return function checklocalimg(callback){
			//选择本地图片
			var fileinput;
			if(!document.getElementById('fileImg')){
				fileinput=document.createElement("input");
				fileinput.id='fileImg';
				fileinput.type='file';
				fileinput.accept="image/*";
				document.body.appendChild(fileinput);
			}else{
				fileinput=document.getElementById('fileImg');
			}
			fileinput.addEventListener('change', handleFileSelect, false);
			fileinput.click();
			function handleFileSelect (evt) {
				fileinput.removeEventListener('change', handleFileSelect, false);
				var file = evt.target.files[0];
				if (!file.type.match('image.*')){
					return;
				}
				var reader = new FileReader();
				reader.readAsDataURL(file);
				reader.onload=function(e){
					console.log(e.target.result);
					var img=new Image();
					img.src=e.target.result;
					callback(img);
				};
			}

	};
})
.factory('URLPort', ['$rootScope', function($rootScope){
	return function URLPort(){
		// $rootScope.URLPort = "http://yunwan2.3322.org:57099";
		// return $rootScope.URLPort ;
		// return "http://192.168.51.191:3000"
		// return "http://yunwan2.3322.org:57099"
		return "";
	};

}])
//判断是否登录  写在daogouAPI中是否更合适
// .factory('judgeLogin', ['$http','URLPort', function($http,URLPort){
// 	var URLPort = URLPort();

// 	return  function judgeLogin(callback,callbackerror){
//    		$http.get(URLPort+"/accounts/current")//获得当前登录账号
//    		.success(function(data){
//    			//如果已经登录，查询用户是否有收货地址，若果有显示默认收货地址，如果没有显示添加收货地址
//    			console.log(["用户已登录,获得当前登录用户账号",data]);
//    			callback();
//    		})
//    		.error(function(data){
//    			//如果未登录,显示登录框，进行登录
//    			console.log(["用户未登录,没获得当前登录用户账号",data]);
//    			callbackerror();
//    		})
//   	 } 
// }])

.factory('daogouAPI', function($http,$log,URLPort){
	function daogouAPI(){

	};

	/*
	通用url拼接方法
	*/
	daogouAPI.prototype.apiurl = function(action,data) {
		var normaldata={};
		var url = URLPort();
		// var url='http://192.168.51.191:3000';
		//合并对象
		url += action+"?";
		data=angular.extend(data,normaldata);

		for(var key in data){
			url+=key+'='+data[key]+'&';
		}
		return url.slice(0,url.length-1);
	};


	/*
	通用get方法
	*/
	daogouAPI.prototype.get = function(url,scallback,ecallback) {
		$http.get(url)
		.success(function(data, status, headers, config){
			scallback(data, status, headers, config);
		})
		.error(function(data, status, headers, config){
			ecallback(data, status, headers, config);
		});
	};
	/*
	通用get方法
	*/
	daogouAPI.prototype.post = function(url,scallback,ecallback) {
		$http.post(url)
		.success(function(data, status, headers, config){
			scallback(data, status, headers, config);
		})
		.error(function(data, status, headers, config){
			ecallback(data, status, headers, config);
		});
	};


	/*  
	查询消费者的订单列表
	actionurl 接口
	dataobj(接口数据)  {object}   [必填]
	scallback 成功的回调函数 {function} [必填]
	ecallback 失败的回调函数 {function} [必填]
	*/
	daogouAPI.prototype.getOrderList = function(actionurl,dataobj,scallback,ecallback) {
		var action=actionurl;
		var data={
			page: typeof dataobj.page === 'number' ? dataobj.page : 1,
			per_page: typeof dataobj.per_page === 'number' ? dataobj.per_page : 5,
			show_orders: typeof dataobj.show_orders === 'boolean' ? dataobj.show_orders : false
		};
		
		this.get(this.apiurl(action,data),scallback,ecallback);
	};
	daogouAPI.prototype.daogouProductList = function(actionurl,dataobj,scallback,ecallback) {
		var action=actionurl;
		var data={
			guiderId: dataobj.guiderId,
			brandId: dataobj.brandId,
			page: typeof dataobj.page === 'number' ? dataobj.page : 1,
			per_page: typeof dataobj.per_page === 'number' ? dataobj.per_page : 5
		};
		
		this.get(this.apiurl(action,data),scallback,ecallback);
	};


	/*  
	提交退货信息
	actionurl 接口
	dataobj(接口数据)  {object}   [必填]
	scallback 成功的回调函数 {function} [必填]
	ecallback 失败的回调函数 {function} [必填]
	*/
	daogouAPI.prototype.submitRefundInfo = function(actionurl,dataobj,scallback,ecallback) {
		var action=actionurl;
		var data={
			page: typeof dataobj.page === 'number' ? dataobj.page : 1,
			per_page: typeof dataobj.per_page === 'number' ? dataobj.per_page : 5,
			show_orders: typeof dataobj.show_orders === 'boolean' ? dataobj.show_orders : false
		};
		
		this.post(this.apiurl(action,data),scallback,ecallback);
	};


///accounts/current 类似于这种请求地址，没有？。。。后面的参数也不带 {}
	daogouAPI.prototype.getshortUrl = function(url,callback,callbackerror){
   		$http.get(url)
   		.success(function(data){
   			callback(data);
   		})
   		.error(function(data){
   			callbackerror(data);
   		})
  	 };



	return new daogouAPI();
})




;