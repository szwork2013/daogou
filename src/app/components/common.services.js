'use strict';

angular.module('daogou')
.factory('checklocalimg', function(){
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
		var url="http://yunwan2.3322.org:57099";
		url=""; 
		return url;
	};

}])
.factory('wxconfig',function($http){
	return 	function wxconfig(){
		console.log(0);
	
		var timestamp=parseInt(new Date().getTime() / 1000) + '';

		wx.config({
			debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
			appId: 'wxf8e64372a94529ac', // 必填，公众号的唯一标识
			timestamp: timestamp, // 必填，生成签名的时间戳
			nonceStr: '', // 必填，生成签名的随机串
			signature: '', // 必填，签名，见附录1
			jsApiList: [] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
		});
	};
})
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



// 

;