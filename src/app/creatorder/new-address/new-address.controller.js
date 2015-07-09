'use strict';

angular.module('daogou')
  .controller('newAddressCtrl', ['$rootScope', '$scope', '$log', '$http', 'daogouAPI', '$stateParams', '$state', function ($rootScope, $scope, $log, $http, daogouAPI, $stateParams, $state) {
    $log.debug('newAddressCtrl');
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
    }
    $scope.clearMobile = function(){
      console.log(["清空你"]);
      $scope.newAddressInput.mobile = "";
    }
    $scope.clearAddress = function(){
      console.log(["清空你"]);
      $scope.newAddressInput.address = "";
    }
    $scope.clearZip = function(){
      console.log(["清空你"]);
      $scope.newAddressInput.zip = "";
    }
    
    if ($stateParams.addressid === "") {
      console.log("添加新地址");
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
        // $scope.newAddressInput.provinceInfo.name = data.state;
        // $scope.newAddressInput.provinceInfo.code = data.state_code;
        // $scope.newAddressInput.cityInfo.name = data.city;
        // $scope.newAddressInput.cityInfo.code = data.city_code;
        // $scope.newAddressInput.districtInfo.name = data.district;
        // $scope.newAddressInput.districtInfo.code = data.district_code;
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
      if (typeof($scope.editData) === "undefined") {//添加地址
        ;
      } else {
        if (dataobj.code === $scope.editData.state_code) {
          ;
        } else {
          $("#editCity").text("-- 请选择市 --");
          $scope.newAddressInput.cityInfo = {};
          $("#editDistrict").text("-- 请选择区、县 --");
          $scope.newAddressInput.districtInfo = {};
        }
      }

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
      if (typeof($scope.editData) === "undefined") {//添加地址
      } else {
        if (dataobj.code === $scope.editData.city_code) {
          ;
        } else {
          $("#editDistrict").text("-- 请选择区、县 --");
          $scope.newAddressInput.districtInfo = {};
        }
      }
      daogouAPI.codegetarea({
        areacode: dataobj.code
      }, function (data, status, headers, config) {
        console.log(['查询市下地区成功', data]);
        $scope.districtsdata = data;
      }, function (data, status, headers, config) {
        console.log(['查询市下地区失败', data]);
      });
    }

    $scope.addAddressfunc = function (defaultAddress) {
      console.log(['$scope.newAddressInput', $scope.newAddressInput]);
      if ($stateParams.addressid === "") {
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
          is_default: defaultAddress
        }, function (data, status, headers, config) {
          console.log(['增加新地址成功', data]);//新增地址成功，跳转到地址模块，刚才加的地址为默认地址
          $scope.defaultAddressdata = data;
          $state.go('changeReceiveInfo', {'userid': $scope.USERID});
        }, function (data, status, headers, config) {
          console.log(['增加新地址失败', data]);//弹出失败提示 停在原页
        });
      } else {
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
          $state.go('changeReceiveInfo', {'userid': $scope.USERID});
        }, function (data, status, headers, config) {
          console.log(['修改地址失败', data]);//弹出失败提示 停在原页
        });
      }
    }
  }])
;