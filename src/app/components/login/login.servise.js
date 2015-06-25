'use strict';

angular.module('daogou')
.factory('loginsSrvice',function(){
	var loginsSrvice={
		console:console,
	}
	return loginsSrvice;
	function console(){
		alert(0)
	}
})