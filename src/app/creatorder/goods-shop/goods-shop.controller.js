'use strict';

angular.module('daogou')
.controller('goodsShopCtrl', ['$rootScope', '$scope', '$log', '$http', 'daogouAPI', '$stateParams', '$state', function ($rootScope, $scope, $log, $http, daogouAPI, $stateParams, $state) {
    $log.debug('goodsShopCtrl');
    $rootScope.isexpress=false;
    $scope.shopaddressData = [];
    $scope.shopaddressData = $rootScope.ListTwoStores;
    var userInfo = window.sessionStorage.getItem("USERINFO");
    $scope.USERINFO = JSON.parse(userInfo);
    $scope.USERID = $scope.USERINFO.id;

    $scope.defaultstorefunc = function (store_id, index) {
      daogouAPI.defaultstore({
        brand_id: $rootScope.BRANDID,
        user_id: $scope.USERID,
        store_id: store_id
      }, function (data, status, headers, config) {
        for (var i in $scope.shopaddressData) {
          $scope.shopaddressData[i].is_default = false;
          if ($scope.shopaddressData[i].id === store_id) {
            $scope.shopaddressData[index].is_default = true;
          }
        }
        console.log(["$rootScope.storeAddressData", $rootScope.storeAddressData]);
        if ($rootScope.storeAddressData) {
          console.log(["$rootScope.storeAddressData", $rootScope.storeAddressData]);
          for (var i in $rootScope.storeAddressData) {
            $rootScope.storeAddressData[i].is_default = false;
            if ($rootScope.storeAddressData[i].id === store_id) {
              $rootScope.storeAddressData[index].is_default = true;
            }
          }
        }

        console.log(['设置默认取货门店成功', data]);

      }, function (data, status, headers, config) {
        console.log(['设置默认取货门店失败', data]);
      });
    }

    //选择门店
    $scope.selectStore = function (id) {
      $rootScope.selectedStoreId = id;
      $rootScope.selectedAddressId = null;
      console.log(["是选择门店情况", $rootScope.selectedAddressId]);
      for (var i in $scope.shopaddressData) {
        if ($scope.shopaddressData[i].id === id) {
          $rootScope.minDistance = $scope.shopaddressData[i];
        }
      }
      console.log(["$rootScope.storeAddressData", $rootScope.storeAddressData]);
      if ($rootScope.storeAddressData) {
        console.log(["$rootScope.storeAddressData", $rootScope.storeAddressData]);
        for (var i in $rootScope.storeAddressData) {
          if ($rootScope.storeAddressData[i].id === id) {
            $rootScope.minDistance = $rootScope.storeAddressData[i];
          }
        }
      }
      console.log(["$stateParams.refunds", $stateParams.refunds]);

      history.go(-1);
      // if ($stateParams.refunds === "1") {
      //   console.log(["$rootScope.refundsTid", $rootScope.refundsTid])
      //   console.log(["$rootScope.refundsOid", $rootScope.refundsOid])
      //   $state.go('returnApply', {'tid': $rootScope.refundsTid, 'oid': $rootScope.refundsOid});
      // } else {
      //   $state.go('creatorder');
      // }

    }


  }])
;
