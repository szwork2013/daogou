'use strict';

angular.module('daogou')
.directive('selectAddress', function($rootScope,$parse,daogouAPI,$http,$stateParams){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		// scope: {}, // {} = isolate, true = child, false/undefined = no change
		// controller: function($scope, $element, $attrs, $transclude) {},
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		// restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
		// template: '',
		templateUrl: 'app/components/selectAddress/selectAddress.html',
		// replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function($scope, iElm, iAttrs, controller) {
			//新增用户收货地址信息
			$scope.newAddressInput = {
			 	name:'',
			 	mobile:'',
			 	provinceInfo : {},
			 	cityInfo:{},
			 	districtInfo:{},
			 	address:'',
			 	zip:'',
			 	defaultAddress:''
			};
			$scope.newAddressInput.provinceInfo.name = "";
			$scope.newAddressInput.provinceInfo.code = "";
			$scope.newAddressInput.cityInfo.name = "";
			$scope.newAddressInput.cityInfo.code = "";
			$scope.newAddressInput.districtInfo.name = "";
			$scope.newAddressInput.districtInfo.code = "";
			console.log(["$stateParams.addressid",$stateParams.addressid]);
			console.log(["TYPEOF $stateParams.addressid",typeof($stateParams.addressid)]);
			if($stateParams.addressid === ""){
				 	console.log("添加新地址");
			}else if(typeof($stateParams.addressid)==="number"){
				 	daogouAPI.getAddress({
				 		user_id:$rootScope.USERINFO.id,
				 		address_id:$stateParams.addressid
				 	},function(data, status, headers, config){
				 		console.log(['获取要修改收货地址成功',data]);
				 		$scope.editData = data;
				 		$scope.newAddressInput.name = data.name;
				 		$scope.newAddressInput.mobile = data.mobile;
				 		$scope.newAddressInput.address = data.address;
				 		$scope.newAddressInput.zip = data.zip;
				 		$scope.newAddressInput.defaultAddress =data.is_default;
			 			 //根据选择的省查询市
				    	daogouAPI.codegetarea({
				    		areacode:$scope.editData.state_code
				    	},function(data, status, headers, config){
				    		console.log(['查询省下市成功',data]);
				    		for(var i in data){//编辑地址的时候显示原来的地址
				    			if(data[i].code === $scope.editData.city_code){
				    				$scope.newAddressInput.cityInfo = data[i];
				    			}
				    		}
				    		$scope.citiesdata = data;
				    	},function(data, status, headers, config){
				    		console.log(['查询省下市失败',data]);
				    	});
			 			 //根据选择的市查询地区
					 	daogouAPI.codegetarea({
					 		areacode:$scope.editData.city_code
					 	},function(data, status, headers, config){
					 		console.log(['查询市下地区成功',data]);
					 		for(var i in data){//编辑地址的时候显示原来的地址
					 			if(data[i].code === $scope.editData.district_code){
					 				$scope.newAddressInput.districtInfo = data[i];
					 			}
					 		}
					 		$scope.districtsdata = data;
					 	},function(data, status, headers, config){
					 		console.log(['查询市下地区失败',data]);
					 	});
			 			
				 	},function(data, status, headers, config){
				 		console.log(['获取要修改收货地址失败',data]);
				 	});
			}

					 
			 daogouAPI.searchProvinces({
			 },function(data, status, headers, config){
			 	$scope.provincesdata = data;
			 	if(typeof($scope.editData) === "undefined"){//添加地址
			 		console.log(["typeof($scope.editData)",typeof($scope.editData)]);
			 	}else{
			 		for(var i in data){//编辑地址的时候显示原来的地址
			 			if(data[i].code === $scope.editData.state_code){
			 				$scope.newAddressInput.provinceInfo = data[i];
			 			}
			 		}
			 	}
			 	console.log(['查询省份成功',data]);
			 },function(data, status, headers, config){
			 	console.log(['查询省份失败',data]);
			 });

			 //根据选择的省查询市
			 $scope.provinceSelect = function(dataobj){
			 	console.log("yyyyyyyyyyyyyyyyyyyyy");
			    console.log(['selectcode',dataobj.code]);
			    if(typeof($scope.editData) === "undefined"){//添加地址
			    	;
			    }else{
			    	if(dataobj.code===$scope.editData.state_code){
			    		;
			    	}else{
			    		$("#editCity").text("-- 请选择市 --");
			    		$scope.newAddressInput.cityInfo = {};
			    		$("#editDistrict").text("-- 请选择区、县 --");
			    		$scope.newAddressInput.districtInfo= {};
			    	}
			    }
					    
		    	daogouAPI.codegetarea({
		    		areacode:dataobj.code
		    	},function(data, status, headers, config){
		    		console.log(['查询省下市成功',data]);
		    		$scope.citiesdata = data;
		    	},function(data, status, headers, config){
		    		console.log(['查询省下市失败',data]);
		    	});
		    	$("#editCity").text("-- 请选择市 --");
		    	$scope.newAddressInput.cityInfo = {};
		    	$("#editDistrict").text("-- 请选择区、县 --");
		    	$scope.newAddressInput.districtInfo= {};
			}

			 //根据选择的市查询地区
			 $scope.citySelect = function(dataobj){
			 	if(typeof($scope.editData) === "undefined"){//添加地址
			 	}else{
			 		if(dataobj.code===$scope.editData.city_code){
			 			;
			 		}else{
			 			$("#editDistrict").text("-- 请选择区、县 --");
			 			$scope.newAddressInput.districtInfo= {};
			 		}
			 	}
			 	daogouAPI.codegetarea({
			 		areacode:dataobj.code
			 	},function(data, status, headers, config){
			 		console.log(['查询市下地区成功',data]);
			 		$scope.districtsdata = data;
			 	},function(data, status, headers, config){
			 		console.log(['查询市下地区失败',data]);
			 	});
			 }

			$scope.getStoresList = function(){
				console.log("要加载改地区的门店啦");
				daogouAPI.storeAddress('/brands/'+$stateParams.brandid+'/stores/store-fetch',{
					user_id:$stateParams.userid,
					state_code:$scope.newAddressInput.provinceInfo.code,
					city_code:$scope.newAddressInput.cityInfo.code,
					district_code:$scope.newAddressInput.districtInfo.code
				},function(data, status, headers, config){
					console.log(['查询门店列表成功',data]);
					$rootScope.storeAddressData = data;
				},function(data, status, headers, config){
					console.log(['查询门店列表失败',data]);
				});
			}

		}
	};
});













