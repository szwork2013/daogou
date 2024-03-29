'use strict';
angular.module('guide', ['ionic'])
  .controller('guideCtrl',
  function ($rootScope, $scope, $log, $http, $state, $stateParams, daogouAPI, URLPort,WXshare) {
    var URLPort = URLPort();
    $scope.daogouProductListData = [];
    var pageindex = 1;
    var pagesize = 8;
    var guiderId = $rootScope.GUIDID;
    var brandId = $rootScope.BRANDID;
    $scope.type = "list";
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


                //微信分享
        var sharedata={
          title: "导购橱窗", // 分享标题
          //截取商品详情中的中文部分
          desc:$rootScope.GUIDINFO.full_name+'的导购橱窗',// 分享描述
          link:window.location.href , // 分享链接
          imgUrl:$rootScope.GUIDINFO.avatar // 分享图标
        }
        console.log(sharedata.imgUrl);

        WXshare(sharedata)


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
      $state.go("orderList", {});
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
