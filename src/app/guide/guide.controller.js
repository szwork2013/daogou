'use strict';
angular.module('guide', ['ionic'])
  .controller('guideCtrl',
  function ($rootScope, $scope, $log, $http, $state, $stateParams, daogouAPI, URLPort) {
    var URLPort = URLPort();
    $scope.daogouProductListData = [];
    var pageindex = 1;
    var pagesize = 8;
    var guiderId = $rootScope.GUIDID;
    var brandId = $rootScope.BRANDID;
    $scope.type ="list";
    var userInfo = window.sessionStorage.getItem("USERINFO");
    if (userInfo == null) {
    }
    else {
      $scope.USERINFO = JSON.parse(userInfo);
    }


    $scope.hasMoreOrder = true;
    /**
     * 加载导购橱窗商品列表
     */
    function daogouProductListFunc() {
      daogouAPI.daogouProductList("/guider-shopwindows", {
        guiderId: guiderId,
        brandId: brandId,
        page: pageindex,
        per_page: pagesize
      }, function (data, status, headers, config) {
        angular.forEach(data, function (item, index) {
          item.pic = item.pic_url.split(',')[0];
        });
        $scope.daogouProductListData = $scope.daogouProductListData.concat(data);
        if (data.length >= pagesize) {
          pageindex++;
        } else {
          $scope.hasMoreOrder = false;
        }

        $scope.$broadcast('scroll.infiniteScrollComplete');

      }, function (data, status, headers, config) {
      });
    }

    daogouProductListFunc();

    $scope.loadMoreData = function () {
      daogouProductListFunc();
    };

    $scope.$on('$stateChangeSuccess', function () {
      if (pageindex > 2) {
        $scope.loadMoreData();
      }
    });

    /**
     * 我的订单列表
     */
    $scope.goOrderList = function () {
      if (userInfo == null) {
        $state.go("orderList", {});
      } else {
        $state.go("orderList", {"userid": $scope.USERINFO.id});
      }
    }
    /**
     * 商品详情
     * @param id
     */
    $scope.productDetail = function (id) {
      $state.go("productDetail", {detailId: id});
    }
    /**
     * 宫格和列表切换
     */
    $scope.changeStyle = function (type) {
      $scope.type = type;
      $("#listData").toggleClass("img")
    }
  })
;
