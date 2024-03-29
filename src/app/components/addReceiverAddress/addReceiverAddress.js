'use strict';

angular.module('daogou')
.directive('addReceiverAddress', function($rootScope,$parse,daogouAPI,$http,$stateParams,$state){
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
		templateUrl: 'app/components/addReceiverAddress/addReceiverAddress.html',
		// replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function($scope, iElm, iAttrs, controller) {
			//姓名去除前后空格已经添加提醒
			$scope.namespace=function(){
				console.log($scope.newAddressInput.name)
				// console.log($scope.newAddressInput.name.length)
				if($scope.newAddressInput.name!=undefined){
					$scope.newAddressInput.name=$scope.newAddressInput.name.replace(/ /g,'')
					// $scope.newAddressInput.address=$scope.newAddressInput.address.replace(/\D/g,'')
					if($scope.newAddressInput.name.length > 20 || $scope.newAddressInput.name.length ==0){
						$scope.nameisable=true;
					}else{
						$scope.nameisable=false;
					}
				}else if($scope.newAddressInput.name==undefined){
					$scope.nameisable=true;
				}
			}
			$scope.nameblur = function() {
				if($scope.newAddressInput.name!=undefined){
					if ($scope.newAddressInput.name.length > 20) {
						$scope.usernameerror = {
							error: true,
							msg: '请输入1~20位字符以内的姓名'
						}
					} else if ($scope.newAddressInput.name.length == 0) {
						$scope.usernameerror = {
							error: true,
							msg: '请输入1~20位字符以内的姓名'
						}
					}
				}
				else if($scope.newAddressInput.name==undefined){
					$scope.usernameerror = {
						error: true,
						msg: '请输入1~20位字符以内的姓名'
					}
				}
			}
			//联系电话去除前后空格已经添加提醒
			$scope.mobilespace=function(){
				// console.log($scope.newAddressInput.mobile)
				// console.log($scope.newAddressInput.mobile.length)
				if($scope.newAddressInput.mobile!=undefined){
					$scope.newAddressInput.mobile=$scope.newAddressInput.mobile.replace(/ /g,'')
					$scope.newAddressInput.address=$scope.newAddressInput.address.replace(/\D/g,'')
					if($scope.newAddressInput.mobile.length != 11){
						$scope.mobileisable=true;
					}else{
						$scope.mobileisable=false;
					}
				}else if($scope.newAddressInput.mobile==undefined){
					$scope.mobileisable=true;
				}
			}
			$scope.mobileblur = function() {
				if($scope.newAddressInput.mobile!=undefined){
					if ($scope.newAddressInput.mobile.length != 11) {
						$scope.usermobileerror = {
							error: true,
							msg: '请填写正确的11位手机号'
						}
					} else if ($scope.newAddressInput.mobile.length == 11) {
						var patrn = /^0?(13[0-9]|15[012356789]|17[0678]|18[0-9]|14[57])[0-9]{8}$/;
						if (patrn.test($scope.newAddressInput.mobile)) {
							// alert('正确的')
						} else {
							// alert('错误的')
							$scope.usermobileerror = {
								error: true,
								msg: '请填写正确的11位手机号'
							}
						}
					}

				}
				else if($scope.newAddressInput.mobile==undefined){
					$scope.usermobileerror = {
						error: true,
						msg: '请填写正确的11位手机号'
					}
				}
			}
			//地址去除前后空格已经添加提醒
			$scope.addspace=function(){
				// console.log($scope.newAddressInput.address)
				// console.log($scope.newAddressInput.address.length)
				if($scope.newAddressInput.address!=undefined){
					$scope.newAddressInput.address=$scope.newAddressInput.address.replace(/ /g,'')
					// $scope.newAddressInput.address=$scope.newAddressInput.address.replace(/\D/g,'')
					if($scope.newAddressInput.address.length > 100 || $scope.newAddressInput.address.length ==0){
						$scope.addisable=true;
					}else{
						$scope.addisable=false;
					}
				}else if($scope.newAddressInput.address==undefined){
					$scope.addisable=true;
				}
			}
			$scope.addblur = function() {
				
				$("#showadd").addClass("ellipsis");

				if($scope.newAddressInput.address!=undefined){
					if ($scope.newAddressInput.address.length > 100) {
						$scope.useraddresserror = {
							error: true,
							msg: '请输入100位字符以内的地址'
						}
					} else if ($scope.newAddressInput.address.length == 0) {
						$scope.useraddresserror = {
							error: true,
							msg: '请输入100位字符以内的地址'
						}
					}
				}
				else if($scope.newAddressInput.address==undefined){
					$scope.useraddresserror = {
						error: true,
						msg: '请输入100位字符以内的地址'
					}
				}
			}
			//邮编去除前后空格已经添加提醒
			$scope.zipspace=function(){
					console.log(parseInt($scope.newAddressInput.zip))
					console.log($scope.newAddressInput.zip)
				if($scope.newAddressInput.zip!=undefined){
					$scope.newAddressInput.zip=$scope.newAddressInput.zip.replace(/ /g,'')
					$scope.newAddressInput.zip=$scope.newAddressInput.zip.replace(/\D/g,'')
					if(parseInt($scope.newAddressInput.zip) > 999999 || parseInt($scope.newAddressInput.zip) < 100000){
						$scope.zipisable=true;
					}else{
						$scope.zipisable=false;
					}
				}else if($scope.newAddressInput.zip==undefined){
					$scope.zipisable=true;
				}
			}
			$scope.zipblur = function() {
				if (parseInt($scope.newAddressInput.zip) > 999999) {
					$scope.userziperror = {
						error: true,
						msg: '请输入6位数字的邮编'
					}
				} else if (parseInt($scope.newAddressInput.zip) < 100000) {
					$scope.userziperror = {
						error: true,
						msg: '请输入6位数字的邮编'
					}
				}else if($scope.newAddressInput.zip==undefined){
					$scope.userziperror = {
						error: true,
						msg: '请输入6位数字的邮编'
					}
				}
			}


			/*
				很愚蠢的让地址的删除按钮显示很隐藏-->开始
			*/
			$scope.showname = false;
			$scope.showmobile = false;
			$scope.showadd = false;
			$scope.showzip = false;
			function showname(){
				var nameid = angular.element(document.getElementById("showname"));
				if (nameid.context.id == 'showname') {
					$scope.showname = true;
					$scope.showmobile = false;
					$scope.showadd = false;
					$scope.showzip = false;
				}
			};
			function showmobile(){
				var mobileid = angular.element(document.getElementById("showmobile"));
				if (mobileid.context.id == 'showmobile') {
					$scope.showmobile = true;
					$scope.showname = false;
					$scope.showadd = false;
					$scope.showzip = false;
				}
			};
			function showadd(){
				var addid = angular.element(document.getElementById("showadd"));
				if (addid.context.id == 'showadd') {
					$scope.showadd = true;
					$scope.showname = false;
					$scope.showmobile = false;
					$scope.showzip = false;
				}
			};
			function showzip(){
				var zipid = angular.element(document.getElementById("showzip"));
				if (zipid.context.id == 'showzip') {
					$scope.showzip = true;
					$scope.showname = false;
					$scope.showmobile = false;
					$scope.showadd = false;
				}
			};
			$scope.showName=function(){
				showname();
			};
			$scope.showMobile=function(){
				showmobile();
			};
			$scope.showAdd=function(){
				$("#showadd").removeClass("ellipsis");
				showadd();
			};
			$scope.showZip=function(){
				showzip();
			};
			/*
				很愚蠢的让地址的删除按钮显示很隐藏<--结束
			*/
			var userInfo = window.sessionStorage.getItem("USERINFO");
			$scope.USERINFO = JSON.parse(userInfo);
			$scope.USERID = $scope.USERINFO.id;
			//新增用户收货地址信息
			$scope.newAddressInput = {
			  name: '',
			  mobile: '',
			  provinceInfo: {},
			  cityInfo: {},
			  districtInfo: {},
			  address: '',
			  zip: '',
			  defaultAddress: ''
			};
			$scope.newAddressInput.provinceInfo.name = "";
			$scope.newAddressInput.provinceInfo.code = "";
			$scope.newAddressInput.cityInfo.name = "";
			$scope.newAddressInput.cityInfo.code = "";
			$scope.newAddressInput.districtInfo.name = "";
			$scope.newAddressInput.districtInfo.code = "";
			console.log(["$stateParams.addressid", $stateParams.addressid]);

			$scope.clearName = function(){
			  console.log(["清空你"]);
			  $scope.newAddressInput.name = "";
			  $scope.nameisable=true;
			}
			$scope.clearMobile = function(){
			  console.log(["清空你"]);
			  $scope.newAddressInput.mobile = "";
			  $scope.mobileisable=true;
			}
			$scope.clearAddress = function(){
			  console.log(["清空你"]);
			  $scope.newAddressInput.address = "";
			  $scope.addisable=true;
			}
			$scope.clearZip = function(){
			  console.log(["清空你"]);
			  $scope.newAddressInput.zip = "";
			  $scope.zipisable=true;
			}
			$scope.defaultAddress = 1;
			if ($stateParams.addressid === "") {
			  console.log("添加新地址");
			  $scope.defaultAddress = 0;
			} else {
			  daogouAPI.getAddress({
			    user_id: $scope.USERID,
			    address_id: $stateParams.addressid
			  }, function (data, status, headers, config) {
			    console.log(['获取要修改收货地址成功', data]);
			    $scope.editData = data;
			    $scope.newAddressInput.name = data.name;
			    $scope.newAddressInput.mobile = data.mobile;
			    $scope.newAddressInput.address = data.address;
			    $scope.newAddressInput.zip = data.zip;
			    $scope.newAddressInput.defaultAddress = data.is_default;
			    //根据选择的省查询市
			    daogouAPI.codegetarea({
			      areacode: $scope.editData.state_code
			    }, function (data, status, headers, config) {
			      console.log(['查询省下市成功', data]);
			      for (var i in data) {//编辑地址的时候显示原来的地址
			        if (data[i].code === $scope.editData.city_code) {
			          $scope.newAddressInput.cityInfo = data[i];
			        }
			      }
			      $scope.citiesdata = data;
			    }, function (data, status, headers, config) {
			      console.log(['查询省下市失败', data]);
			    });
			    //根据选择的市查询地区
			    daogouAPI.codegetarea({
			      areacode: $scope.editData.city_code
			    }, function (data, status, headers, config) {
			      console.log(['查询市下地区成功', data]);
			      for (var i in data) {//编辑地址的时候显示原来的地址
			        if (data[i].code === $scope.editData.district_code) {
			          $scope.newAddressInput.districtInfo = data[i];
			        }
			      }
			      $scope.districtsdata = data;
			    }, function (data, status, headers, config) {
			      console.log(['查询市下地区失败', data]);
			    });

			  }, function (data, status, headers, config) {
			    console.log(['获取要修改收货地址失败', data]);
			  });
			}
			console.log(["$rootScope.firstAddressFlag",$rootScope.firstAddressFlag]);
			daogouAPI.searchProvinces({}, function (data, status, headers, config) {
			  $scope.provincesdata = data;
			  if (typeof($scope.editData) === "undefined") {//添加地址
			    console.log(["typeof($scope.editData)", typeof($scope.editData)]);
			  } else {
			    for (var i in data) {//编辑地址的时候显示原来的地址
			      if (data[i].code === $scope.editData.state_code) {
			        $scope.newAddressInput.provinceInfo = data[i];
			      }
			    }
			  }
			  console.log(['查询省份成功', data]);
			}, function (data, status, headers, config) {
			  console.log(['查询省份失败', data]);
			});
			//根据选择的省查询市
			$scope.provinceSelect = function (dataobj) {
			  console.log(['selectcode', dataobj.code]);
		      $("#editCity").text("-- 请选择市 --");
		      $scope.newAddressInput.cityInfo = {};
		      $("#editDistrict").text("-- 请选择区、县 --");
		      $scope.newAddressInput.districtInfo = {};
			  daogouAPI.codegetarea({
			    areacode: dataobj.code
			  }, function (data, status, headers, config) {
			    console.log(['查询省下市成功', data]);
			    $scope.citiesdata = data;
			  }, function (data, status, headers, config) {
			    console.log(['查询省下市失败', data]);
			  });
			}
			//根据选择的市查询地区
			$scope.citySelect = function (dataobj) {
		      $("#editDistrict").text("-- 请选择区、县 --");
		      $scope.newAddressInput.districtInfo = {};
			  daogouAPI.codegetarea({
			    areacode: dataobj.code
			  }, function (data, status, headers, config) {
			    console.log(['查询市下地区成功', data]);
			    $scope.districtsdata = data;
			  }, function (data, status, headers, config) {
			    console.log(['查询市下地区失败', data]);
			  });
			}
			$scope.addAddressfunc = function () {
				  if($scope.newAddressInput.name === ""){
				    $scope.usernameerror = {
				      "error" : true,
				      "msg":"用户名不能为空"
				    }
				    return;
				  }
				  if($scope.newAddressInput.mobile === ""){
				    $scope.usermobileerror = {
				      "error" : true,
				      "msg":"电话不能为空"
				    }
				    return;
				  }
				  if($scope.newAddressInput.address === ""){
				    $scope.useraddresserror = {
				      "error" : true,
				      "msg":"详细地址不能为空"
				    }
				    return;
				  }
				  if($scope.newAddressInput.provinceInfo.code === ""){
				    $scope.userprovinceerror = {
				      "error" : true,
				      "msg":"请选择省"
				    }
				    return;
				  }
				  if($scope.newAddressInput.cityInfo.code === ""){
				    $scope.usercityerror = {
				      "error" : true,
				      "msg":"请选择市"
				    }
				    return
				  }
				  if($scope.newAddressInput.districtInfo.code === ""){
				    $scope.userdistricterror = {
				      "error" : true,
				      "msg":"请选择区、县"
				    }
				    return
				  }


				  if (($stateParams.addressid!= "")&&($stateParams.addressid!= undefined)) {
				    	daogouAPI.editAddress({
				    	  id: $stateParams.addressid,
				    	  user_id: $scope.USERID,
				    	  name: $scope.newAddressInput.name,
				    	  state: $scope.newAddressInput.provinceInfo.name,
				    	  state_code: $scope.newAddressInput.provinceInfo.code,
				    	  city: $scope.newAddressInput.cityInfo.name,
				    	  city_code: $scope.newAddressInput.cityInfo.code,
				    	  district: $scope.newAddressInput.districtInfo.name,
				    	  district_code: $scope.newAddressInput.districtInfo.code,
				    	  address: $scope.newAddressInput.address,
				    	  zip: $scope.newAddressInput.zip,
				    	  mobile: $scope.newAddressInput.mobile,
				    	  is_default: $scope.newAddressInput.defaultAddress
				    	}, function (data, status, headers, config) {
				    	  console.log(['修改地址成功', data]);//新增地址成功，跳转到地址模块，刚才加的地址为默认地址
				    	  $scope.defaultAddressdata = data;
				    	  history.go(-1);
				    	}, function (data, status, headers, config) {
				    	  console.log(['修改地址失败', data]);//弹出失败提示 停在原页
				    	});
				  } else {
						daogouAPI.addAddress({
						  user_id: $scope.USERID,
						  name: $scope.newAddressInput.name,
						  state: $scope.newAddressInput.provinceInfo.name,
						  state_code: $scope.newAddressInput.provinceInfo.code,
						  city: $scope.newAddressInput.cityInfo.name,
						  city_code: $scope.newAddressInput.cityInfo.code,
						  district: $scope.newAddressInput.districtInfo.name,
						  district_code: $scope.newAddressInput.districtInfo.code,
						  address: $scope.newAddressInput.address,
						  zip: $scope.newAddressInput.zip,
						  mobile: $scope.newAddressInput.mobile,
						  is_default: $scope.defaultAddress
						}, function (data, status, headers, config) {
						  console.log(['增加新地址成功', data]);//新增地址成功，跳转到地址模块，刚才加的地址为默认地址
						  $scope.defaultAddressdata = data;

						  if($rootScope.firstAddressFlag ===1){
						  	  $rootScope.defaultAddressdata = data;
			  		          $scope.loginhandle = true;
			  		          $scope.alladdress = false;
			  		          $scope.firstBuyerAddress = true;//隐藏填写第一个地址模块，显示选择地址模块
			  		          $scope.buyeraddress = false;
			  		          $scope.weixinpay = false;
			  		          $rootScope.firstAddressFlag = 0;
						  }else{
						  	history.go(-1);
						  }

						}, function (data, status, headers, config) {
						  console.log(['增加新地址失败', data]);//弹出失败提示 停在原页
						});
				  }

			}


		}
	};
});













