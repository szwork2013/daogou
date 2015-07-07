'use strict';

var cart = angular.module('cart', ['ionic']);
cart.controller('cartCtrl', ['$scope', '$log', '$http', '$state', 'URLPort', '$stateParams', 'daogouAPI', '$rootScope', function ($scope, $log, $http, $state, URLPort, $stateParams, daogouAPI, $rootScope) {
  var URLPort = URLPort();
  $scope.hasMoreOrder = true;
  var pageindex = 1;
  var pagesize = 5;
  var userid = $stateParams.userid;
  var brandid = $stateParams.brandid;
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
  /**
   * 获取购物车列表
   */
  function cartProductListFunc() {
    $scope.Allseleted = false;
    daogouAPI.shopcart({
      userid: userid,
      brand_id: brandid,
      page: pageindex,
      per_page: pagesize
    }, function (data, status, headers, config) {
      angular.forEach(data, function (item, index) {
        item.seleted = false;
        item.pics = item.pic_path.indexOf(",") > 0 ? item.pic_path.split(",") : [item.pic_path];
        item.specification = [];
        item.item = 1;
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
        console.log(["hasMoreOrder", $scope.hasMoreOrder])
      }
      $scope.$broadcast('scroll.infiniteScrollComplete');
    }, function (data, status, headers, config) {
      console.log(["查询导购商品列表失败", data]);
    });
  }
  /**
   * 默认加载
   */
  cartProductListFunc();
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
  $http.get(URLPort + "/brands/" + brandid)
    .success(function (data) {
      $scope.brandData = data;
    })
    .error(function (data) {
    });
  /**
   * 左上角点击编辑显示删除
   */
  $scope.edit = function () {
    $scope.edithandle = false;
    $scope.finishhandle = true;
  };
  /**
   * 左上角点击完成显示结算
   */
  $scope.finish = function () {
    $scope.edithandle = true;
    $scope.finishhandle = false;
  };
  /**
   * 点击-减商品数
   * @param index
   */
  $scope.delNum = function (item) {
    if (item.num > 1) {
      $scope.ids.splice($.inArray(item.id, $scope.ids), 1);
      $scope.totalNum--;
      $scope.totalFee -= parseFloat(item.total_fee);
      item.num--;
      item.num = item.num > 0 ? item.num : 0;
    } else {
      alert("不能再少了")
    }
  };
  /**
   * 点击+增商品数
   * @param index
   */
  $scope.addNum = function (item) {
    item.num++;
    $scope.totalNum++;
    $scope.totalFee += parseFloat(item.total_fee);
    if ($.inArray(item.id, $scope.ids) < 0) {
      $scope.ids.push(item.id);
    }
    item.seleted = true;
    var isAll = true;
    $scope.cartProductListData.filter(function (item) {
      if (!item.seleted) {
        isAll = false;
      }
    });
    $scope.Allseleted = isAll;
  };

  /**
   *   通过点击选中圆圈选中
   */
  $scope.changeCheck = function (item) {
    var num = item.num;
    item.seleted = !item.seleted;
    item.num = 1;
    if (item.seleted) {
      $scope.totalFee += parseFloat(item.total_fee) * num;
      $scope.totalNum += num;
      if ($.inArray(item.id, $scope.ids) < 0) {
        $scope.ids.push(item.id);
      }
    }
    else {
      $scope.totalNum -= num;
      $scope.totalFee -= parseFloat(item.total_fee) * num;
      $scope.ids.splice($.inArray(item.id, $scope.ids), 1);
    }
    console.log($scope.ids);
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
    $scope.totalFee = 0;
    $scope.totalNum = 0;
    $scope.ids = [];
    angular.forEach($scope.cartProductListData, function (item, index) {
        item.seleted = $scope.Allseleted;
        if ($scope.Allseleted) {
          if (item.num > 0 && item.seleted) {
            $scope.totalFee += parseFloat(item.total_fee);
            $scope.totalNum += item.num;
            $scope.ids.push(item.id);
          }
        }
        else {
          item.num = 1;
        }
      }
    )
  };

  /**
   * 删除商品
   */
  $scope.deleteCartProduct = function () {
    daogouAPI.deleteCartProduct({
      userid: userid,
      ids: $scope.ids.join(",")
    }, function (data, status, headers, config) {
      $scope.cartProductListData = [];
      pageindex = 1;
      pagesize = 5;
      $scope.hasMoreOrder = true;
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
    $state.go("orderList", {"userid": $stateParams.userid});
  }
}])
