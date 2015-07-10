'use strict';

var cart = angular.module('cart', ['ionic']);
cart.controller('cartCtrl', ['$scope', '$log', '$http', '$state', 'URLPort', '$stateParams', 'daogouAPI', '$rootScope', "$ionicPopup",
  function ($scope, $log, $http, $state, URLPort, $stateParams, daogouAPI, $rootScope, $ionicPopup) {
    var userInfo = window.sessionStorage.getItem("USERINFO");
    if (userInfo == null) {
      daogouAPI.isLogin(function (data) {
        $scope.USERINFO = data;
        window.sessionStorage.setItem("USERINFO", JSON.stringify(data));
        cartProductListFunc();
      }, function (data) {
        $scope.login = true;
      });
    }
    else {
      $scope.USERINFO = JSON.parse(userInfo);
      cartProductListFunc();
    }
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
    //完成状态
    $scope.finishhandle = false;
    //是否选中
    $scope.Allseleted = false;
    //总量
    $scope.totalNum = 0;
    //总价格
    $scope.totalFee = 0;
    /**
     * 获取购物车列表
     */
    function cartProductListFunc() {
      daogouAPI.shopcart({
        userid: $scope.USERINFO.id,
        brand_id: $rootScope.BRANDID,
        page: pageindex,
        per_page: pagesize
      }, function (data, status, headers, config) {
        $scope.totalNum = 0;
        $scope.totalFee = 0;
        $scope.Allseleted = false;
        angular.forEach(data, function (item, index) {
          item.seleted = false;
          item.pics = item.pic_path.indexOf(",") > 0 ? item.pic_path.split(",") : [item.pic_path];
          item.specification = [];
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
        daogouAPI.formatSku(data);
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
      //提交一下修改的数量

    };
    /**
     * 点击-减商品数
     * @param index
     */
    $scope.delNum = function (item) {
      if (item.num > 1) {
        item.num--;
        if (item.seleted) {
          $scope.ids.splice($.inArray(item.id, $scope.ids), 1);
          $scope.totalFee -= parseFloat(item.price);
        }

      } else {
        var alertPopup = $ionicPopup.alert({
            title: '友情提示',
            template: '受不了了，宝贝不能再少了哦',
            cssClass: 'alerttextcenter',// String, The custom CSS class name
            okText: '确定', // String (default: 'OK'). The text of the OK button.
            okType: 'button-energized', // String (default: 'button-positive'). The type of the OK button.
          });
         alertPopup.then(function(res) {
           console.log('Thank you for not eating my delicious ice cream cone');
         });
        // var mypopup = $ionicPopup.show({
        //   title: "提示",
        //   template: "受不了了，宝贝不能再少了哦",
        //   buttons: [{
        //     text: "确定",
        //     type: "button-energized"
        //   }]
        // });
      }
    };
    /**
     * 点击+增商品数
     * @param index
     */
    $scope.addNum = function (item) {
        console.log(['itemitemitemitemitem',item.freight]);
        console.log(['itemitemitemitemitem',item.num]);
        if (item.num<item.freight) {
          item.num++;
          if ($.inArray(item.id, $scope.ids) < 0) {
            $scope.ids.push(item.id);
          }
          $scope.totalFee += parseFloat(item.price);
        }
       else {
          var alertPopup = $ionicPopup.alert({
            title: '友情提示',
            template: '数量超出范围~亲',
            cssClass: 'alerttextcenter',// String, The custom CSS class name
            okText: '确定', // String (default: 'OK'). The text of the OK button.
            okType: 'button-energized', // String (default: 'button-positive'). The type of the OK button.
          });
         alertPopup.then(function(res) {
           console.log('Thank you for not eating my delicious ice cream cone');
         });
         // item.num=item.freight;
        // var mypopup = $ionicPopup.show({
        //   title: "提示",
        //   template: "不能再多了",
        //   buttons: [{
        //     text: "确定",
        //     type: "button-energized"
        //   }]
        // });
      }
    };
    /**
     * 商品详情
     * @param id
     */
    $scope.goDetail = function (id) {
      if ($scope.edithandle) {
        $state.go("productDetail", {detailId: id});
      }
    };
    /**
     *   通过点击选中圆圈选中
     */
    $scope.changeCheck = function (item) {
      item.seleted = !item.seleted;
      var isAll = true;
      $scope.cartProductListData.filter(function (item) {
        if (!item.seleted) {
          isAll = false;
        }
      });
      $scope.Allseleted = isAll;

      if (item.seleted) {
        $scope.totalFee += parseFloat(item.price) * item.num;
        $scope.totalNum++;
        if ($.inArray(item.id, $scope.ids) < 0) {
          $scope.ids.push(item.id);
        }
      }
      else {
        $scope.totalFee -= parseFloat(item.price) * item.num;
        $scope.totalNum--;
        $scope.ids.splice($.inArray(item.id, $scope.ids), 1);
      }


    };
    /**
     *   全选全不选
     */
    $scope.changeAll = function () {
      $scope.Allseleted = !$scope.Allseleted;
      $scope.totalFee = 0;
      $scope.totalNum = 0;
      $scope.ids = [];
      angular.forEach($scope.cartProductListData, function (item, index) {
          item.seleted = $scope.Allseleted;
          if ($scope.Allseleted) {
            if (item.seleted) {
              $scope.totalFee += parseFloat(item.total_fee);
              $scope.totalNum++;
              $scope.ids.push(item.id);
            }
          }
        }
      )
    };

    /**
     * 删除商品
     */
    $scope.deleteCartProduct = function () {
      daogouAPI.deleteCartProduct({
          userid: $scope.USERINFO.id,
          ids: $scope.ids.join(",")
        }, function (data, status, headers, config) {
          $scope.cartProductListData = [];
          pageindex = 1;
          pagesize = 5;
          $scope.hasMoreOrder = true;
          $scope.totalNum = 0;
          $scope.totalFee = 0;
          cartProductListFunc();
        },
        function (data, status, headers, config) {
        });
    };
    /**
     * 结算商品
     */
    $scope.checkCartProduct = function () {
      var productOrders = [];
      window.sessionStorage.removeItem("productOrders");
      angular.forEach($scope.cartProductListData, function (item, index) {
        if ($.inArray(item.id, $scope.ids) >= 0) {
          var newItem = {};
          newItem.price = item.price;
          newItem.num = item.num;
          newItem.title = item.title;
          newItem.freight = item.freight;
          newItem.picUrlArr = item.pics;
          newItem.properties = item.sku_properties_name;
          newItem.sku_id = item.sku_id;
          newItem.brand_id = $rootScope.BRANDID;
          productOrders.push(newItem);
        }
      });
      window.sessionStorage.setItem("productOrders", JSON.stringify(productOrders));
      $state.go("creatorder");
    };
    /**
     *   购物车 订单列表切换
     */
    $scope.goOrderList = function () {
      $state.go("orderList", {"userid": $scope.USERINFO.id});
    }
  }]);
