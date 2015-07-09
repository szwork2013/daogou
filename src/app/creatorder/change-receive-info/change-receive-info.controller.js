'use strict';

angular.module('daogou')
.controller('changeReceiveInfoCtrl', ['$ionicPopup','$scope', '$log', '$http', 'URLPort', '$stateParams', 'daogouAPI', '$state', '$rootScope', function ($ionicPopup,$scope, $log, $http, URLPort, $stateParams, daogouAPI, $state, $rootScope) {
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
        var confirmPopup = $ionicPopup.confirm({
        title: '您确定删除此地址吗?',
        // template: '确定删除地址吗?',
        cancelText: '取消', // String (default: 'Cancel'). The text of the Cancel button.
        cancelType: 'button-default', // String (default: 'button-default'). The type of the Cancel button.
        okText: '确定', // String (default: 'OK'). The text of the OK button.
        okType: 'button-assertive', // String (default: 'button-positive'). The type of the OK button.
     });
     confirmPopup.then(function(res) {
       if(res) {
          daogouAPI.deleteAddress({
            user_id: $scope.USERID,
            address_id: addressId
          }, function (data, status, headers, config) {
            console.log(['删除收货地址成功', data]);
            $scope.receiverAddressDate.splice(index, 1);
          }, function (data, status, headers, config) {
            console.log(['删除收货地址失败', data]);
          });
           console.log('确定删除');
       } else {
          console.log('取消删除');
       }
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