'use strict';

angular.module('daogou')
.factory('checklocalimg', function() {
	return function checklocalimg(callback) {
		//选择本地图片
		var fileinput;
		if (!document.getElementById('fileImg')) {
			fileinput = document.createElement("input");
			fileinput.id = 'fileImg';
			fileinput.type = 'file';
			fileinput.accept = "image/*";
			document.body.appendChild(fileinput);
		} else {
			fileinput = document.getElementById('fileImg');
		}
		fileinput.addEventListener('change', handleFileSelect, false);
		fileinput.click();

		function handleFileSelect(evt) {
			fileinput.removeEventListener('change', handleFileSelect, false);
			var file = evt.target.files[0];
			if (!file.type.match('image.*')) {
				return;
			}
			var reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = function(e) {
				console.log(e.target.result);
				var img = new Image();
				img.src = e.target.result;
				callback(img);
			};
		}

	};
})
.factory('URLPort', ['$rootScope', function($rootScope) {
	return function URLPort() {
		// $rootScope.URLPort = "http://yunwan2.3322.org:57099";
		// return $rootScope.URLPort ;
		// return "http://192.168.51.191:3000"
		var url = "http://yunwan2.3322.org:57099";
		url=""; 
		return url;
	};

}])
.factory('getRequest', function(){
	return function GetRequest(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if (r !== null) return unescape(r[2]); return null;
	};
})

.factory('getLocation',function(){
	return function getLocation(callback,errorcallback) {
		if(navigator.geolocation){
			console.log("factory geolocation")
			var getOptions = {
				//是否使用高精度设备，如GPS。默认是true  
				enableHighAccuracy: true,
				//超时时间，单位毫秒，默认为0  
				timeout: 5000,
				//使用设置时间内的缓存数据，单位毫秒  
				//默认为0，即始终请求新数据  
				//如设为Infinity，则始终使用缓存数据  
				maximumAge: 0
			};
		   navigator.geolocation.getCurrentPosition(showPosition,getError,getOptions);

		}else{
		  	x.innerHTML="Geolocation is not supported by this browser.";
		}
	  	//成功回调
	  	function showPosition(position){
			console.log("factory geolocation2")

	  	  callback(position.coords.longitude,position.coords.latitude);
	  	}
	  //失败回调  
        function getError(error){  
			console.log("factory geolocation3")

            // 执行失败的回调函数，会接受一个error对象作为参数  
            // error拥有一个code属性和三个常量属性TIMEOUT、PERMISSION_DENIED、POSITION_UNAVAILABLE  
            // 执行失败时，code属性会指向三个常量中的一个，从而指明错误原因  
            switch(error.code){  
                 case error.TIMEOUT:  
                      console.log('超时');  
                      break;  
                 case error.PERMISSION_DENIED:  
                      console.log('用户拒绝提供地理位置');
                      break;  
                 case error.POSITION_UNAVAILABLE:  
                      console.log('地理位置不可用');  
                      break;  
                 default:  
                      break;  
            }
            errorcallback();
        }  


	};
})

;






















