'use strict';

var cart = angular.module('cart', ['ionic']);
cart.controller('cartCtrl', ['$scope', '$log', '$http', '$state', 'URLPort', '$stateParams', 'daogouAPI', '$rootScope',"$ionicPopup",
  function ($scope, $log, $http, $state, URLPort, $stateParams, daogouAPI, $rootScope,$ionicPopup) {
  //检测登录开始
  daogouAPI.isLogin(function (data) {
    console.log(data)
    //得到用户信息才获取购物车信息
    cartProductListFunc();

  }, function (data) {
    //如果未检测到用户信息，则显示登录界面
    $scope.login = true;
  });
  //检测登录结束
  var URLPort = URLPort();
  $scope.hasMoreOrder = true;
  var pageindex = 1;
  var pagesize = 5;
  //选中商品id集合
  $scope.ids = [];
  //购物车商品列表
  $scope.cartProductListData = [];
  //编辑状态
  $scope.edithandle = true;
  // 完成状态
  $scope.finishhandle = false;
  //购物车中选中商品总量
  $scope.totalNum = 0;
  //合计价格
  $scope.totalFee = 0;
  //购物车中选中商品总量
  $scope.totalNumDelete = 0;
  //合计价格
  $scope.totalFeeDelete = 0;
  $scope.Allseleted = false;

  /**
   * 获取购物车列表
   */
  function cartProductListFunc() {

    daogouAPI.shopcart({
      userid: $rootScope.USERINFO.id,
      brand_id: $rootScope.BRANDID,
      page: pageindex,
      per_page: pagesize
    }, function (data, status, headers, config) {
      $scope.totalNumDelete = 0;
      $scope.totalFeeDelete = 0;
      $scope.Allseleted = false;
      angular.forEach(data, function (item, index) {
        item.seleted = false;
        item.pics = item.pic_path.indexOf(",") > 0 ? item.pic_path.split(",") : [item.pic_path];
        item.specification = [];
        item.tempNum = item.num;
        $scope.totalNum += item.num;
        $scope.totalFee += item.price * item.num;
        var cartArr = item.sku_properties_name.split(';');//cartArr.length参数种类
        for (var tz in cartArr) {//一个规格种类一个规格种类来
          var cartendArr = cartArr[tz].split(':');//取每个规格的规格名和规格值
          item.specification[tz] = {val: "", array: "", key: ""};
          item.specification[tz].val = cartendArr[cartendArr.length - 1];//规格值
          item.specification[tz].array = item.specification[tz].val.split(" ");
          item.specification[tz].array.splice(item.specification[tz].array.length - 1, 1);
          item.specification[tz].key = cartendArr[cartendArr.length - 2];//规格名
        }
      });
      $scope.cartProductListData = $scope.cartProductListData.concat(data);
      if (data.length >= pagesize) {
        pageindex++;
      } else {
        $scope.hasMoreOrder = false;
      }
      $scope.$broadcast('scroll.infiniteScrollComplete');
    }, function (data, status, headers, config) {
    });
  }

  // 登录成功回调
  $scope.loginsuccess = function (data) {
    console.log(["order的回调", data]);
    $scope.login = false;
    $(".redPoint").show();
    //获取订单信息
    cartProductListFunc();
  }
  //登录失败回调
  $scope.loginerror = function (data) {

  }

  /**
   * 加载更多
   */
  $scope.loadMoreData = function () {
    console.log(["loadMoreData"]);
    cartProductListFunc();
  };
  /**
   * 监测广播，加载更多
   */
  $scope.$on('$stateChangeSuccess', function () {
    if (pageindex > 2) {
      $scope.loadMoreData();
    }
  });
  /**
   * 加载品牌信息
   */
  $http.get(URLPort + "/brands/" + $rootScope.BRANDID)
    .success(function (data) {
      $scope.brandData = data;
    })
    .error(function (data) {
    });
  /**
   * 左上角点击编辑显示删除
   */
  $scope.edit = function () {
    $scope.Allseleted = false;
    angular.forEach($scope.cartProductListData, function (item, index) {
      item.seleted = false;
    });
    $scope.totalNumDelete = 0;
    $scope.totalFeeDelete = 0;
    $scope.edithandle = false;
    $scope.finishhandle = true;
  };
  /**
   * 左上角点击完成显示结算
   */
  $scope.finish = function () {
    $scope.Allseleted = false;
    angular.forEach($scope.cartProductListData, function (item, index) {
      item.seleted = false;
    });
    $scope.totalNumDelete = 0;
    $scope.totalFeeDelete = 0;
    $scope.AllSelected = false;
    $scope.edithandle = true;
    $scope.finishhandle = false;

  };
  /**
   * 点击-减商品数
   * @param index
   */
  $scope.delNum = function (item) {
    if (item.tempNum > 1) {
      item.tempNum--;
      if (item.seleted) {
        $scope.ids.splice($.inArray(item.id, $scope.ids), 1);
        $scope.totalNumDelete--;
        $scope.totalFeeDelete -= parseFloat(item.total_fee);
      }

    } else {
      var mypopup = $ionicPopup.show({
        title: "提示",
        template: "不能再少了",
        buttons: [{
          text: "确定",
          type: "button-energized"
        }]
      });
    }
  };
  /**
   * 点击+增商品数
   * @param index
   */
  $scope.addNum = function (item) {
    if (item.tempNum < item.num) {
      item.tempNum++;
      if (item.seleted) {
        if ($.inArray(item.id, $scope.ids) < 0) {
          $scope.ids.push(item.id);
        }
        $scope.totalNumDelete++;
        $scope.totalFeeDelete += parseFloat(item.total_fee);
      }
    } else {
      var mypopup = $ionicPopup.show({
        title: "提示",
        template: "不能再多了",
        buttons: [{
          text: "确定",
          type: "button-energized"
        }]
      });
    }
  };

  /**
   *   通过点击选中圆圈选中
   */
  $scope.changeCheck = function (item) {
    var num = item.tempNum;
    item.seleted = !item.seleted;
    if (item.seleted) {
      $scope.totalFeeDelete += parseFloat(item.total_fee) * num;
      $scope.totalNumDelete += num;
      if ($.inArray(item.id, $scope.ids) < 0) {
        $scope.ids.push(item.id);
      }
    }
    else {
      $scope.totalNumDelete -= num;
      $scope.totalFeeDelete -= parseFloat(item.total_fee) * num;
      $scope.ids.splice($.inArray(item.id, $scope.ids), 1);
    }
    var isAll = true;
    $scope.cartProductListData.filter(function (item) {
      if (!item.seleted) {
        isAll = false;
      }
    });
    $scope.Allseleted = isAll;
  };
  /**
   *   全选全不选
   */
  $scope.Allseleted = false;
  $scope.changeAll = function () {
    $scope.Allseleted = !$scope.Allseleted;
    $scope.totalFeeDelete = 0;
    $scope.totalNumDelete = 0;
    $scope.ids = [];
    angular.forEach($scope.cartProductListData, function (item, index) {
        item.seleted = $scope.Allseleted;
        if ($scope.Allseleted) {
          if (item.seleted) {
            $scope.totalFeeDelete += parseFloat(item.total_fee);
            $scope.totalNumDelete += item.tempNum;
            $scope.ids.push(item.id);
          }
        }
        else {
          item.tempNum = item.num;
        }
      }
    )
  };

  /**
   * 删除商品
   */
  $scope.deleteCartProduct = function () {
    daogouAPI.deleteCartProduct({
      userid: $rootScope.USERINFO.id,
      ids: $scope.ids.join(",")
    }, function (data, status, headers, config) {
      $scope.cartProductListData = [];
      pageindex = 1;
      pagesize = 5;
      $scope.hasMoreOrder = true;
      $scope.totalNum = 0;
      $scope.totalFee = 0;
      cartProductListFunc();
    }, function (data, status, headers, config) {
      console.log(["删除购物车商品失败", data]);
    });
  };
  /**
   * 结算商品
   */
  $scope.checkCartProduct = function () {

  };
  /**
   *   购物车 订单列表切换
   */
  $scope.goOrderList = function () {
    $state.go("orderList", {"userid": $rootScope.USERINFO.id});
  }
}])
