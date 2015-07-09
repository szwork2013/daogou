'use strict';

angular.module('daogou')
.controller('changeReceiveInfoCtrl', ['$scope', '$log', '$http', 'URLPort', '$stateParams', 'daogouAPI', '$state', '$rootScope', function ($scope, $log, $http, URLPort, $stateParams, daogouAPI, $state, $rootScope) {
    $log.debug('changeReceiveInfoCtrl');
    var URLPort = URLPort();
    var userInfo = window.sessionStorage.getItem("USERINFO");
      $scope.USERINFO = JSON.parse(userInfo);
      $scope.USERID = $scope.USERINFO.id;
     

    $http.get(URLPort + '/users/' + $scope.USERID + '/shipping-addresses')
      .success(function (data) {
        $scope.receiverAddressDate = data;
        console.log(['获取用户收货地址列表成功', data]);
      })
      .error(function (data) {
        console.log(['获取用户收货地址列表失败', data]);
      })

    $scope.selectAddress = function (id) {
      $rootScope.selectedStoreId = null;
      $rootScope.selectedAddressId = id;
      if (typeof($rootScope.selectedAddressId) === "undefined") {//不是选择地址
        console.log(["不是选择地址情况"]);
      } else {//是选择地址哪种情况
        console.log(["是选择地址情况", $rootScope.selectedAddressId]);
        $http.get(URLPort + '/users/' + $scope.USERID + '/shipping-addresses')
          .success(function (data) {
            for (var i in data) { //选出默认收货地址
              if (data[i].id === $rootScope.selectedAddressId) {
                $rootScope.defaultAddressdata = data[i];
              }
            }
          })
          .error(function (data) {
            console.log(['当前用户没有收货地址，请填写第一个收货地址', data]);
          })

      }
      $state.go('creatorder');
    }
    $scope.setDefaultAddress = function (addressId, index) {
      console.log(['addressId', addressId]);
      daogouAPI.defaultAddress({
        user_id: $scope.USERID,
        address_id: addressId
      }, function (data, status, headers, config) {
        for (var i in $scope.receiverAddressDate) {
          $scope.receiverAddressDate[i].is_default = false;
        }
        $scope.receiverAddressDate[index].is_default = true;
        console.log(['设置默认收货地址成功', data]);

      }, function (data, status, headers, config) {
        console.log(['设置默认收货地址失败', data]);
      });
    }


    $scope.deleteAddressFunc = function (addressId, index) {
      daogouAPI.deleteAddress({
        user_id: $scope.USERID,
        address_id: addressId
      }, function (data, status, headers, config) {
        console.log(['删除收货地址成功', data]);
        $scope.receiverAddressDate.splice(index, 1);
      }, function (data, status, headers, config) {
        console.log(['删除收货地址失败', data]);
      });
    }

    $scope.editAddressFunc = function (addressId) {
      $state.go('newAddress', {userid: $scope.USERID, addressid: addressId});
    }

    $scope.gonewAddress = function () {
      $state.go('newAddress', {userid: $scope.USERID});
    }


  }])
;