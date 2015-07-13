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
        $scope.showLogin();
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
          //不满足一页，数量5的时候，及不加载数据了
          $scope.hasMoreOrder = false;
          //再判断购物车中是否有产品，如果没有产品，则将小红点影藏
          //此判断与login中的小红点判断不冲突，因为这个是删除购物车
          //两者搭配方能实时显示小红点的显示与否
          if(data.length===0){
            $(".redPoint").hide();
            $(".redPointCart").hide();
          }
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      }, function (data, status, headers, config) {
      });
    }

    // 登录成功回调
    $scope.loginsuccess = function (data) {
      $scope.hideLogin();
      //回调再获取用户信息
      var userInfo = window.sessionStorage.getItem("USERINFO");
      $scope.USERINFO = JSON.parse(userInfo);
      $scope.USERID = $scope.USERINFO.id;
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
        var num = item.num - 1;
        $scope.updateCartProduct(item.id, num,
          function (data, status, headers, config) {
            item.num = data.num;
            if (item.seleted) {
              $scope.ids.splice($.inArray(item.id, $scope.ids), 1);
              $scope.totalFee -= parseFloat(item.price);
            }
          },
          function (data, status, headers, config) {
            // var alertPopup = $ionicPopup.alert({
            //   title: '友情提示',
            //   template: '受不了了，宝贝不能再少了哦',
            //   cssClass: 'alerttextcenter',
            //   okText: '确定',
            //   okType: 'button-energized'
            // });
            // alertPopup.then(function (res) {
            // });

          });
      } else {
        var alertPopup = $ionicPopup.alert({
          title: '友情提示',
          template: '受不了了，宝贝不能再少了哦',
          cssClass: 'alerttextcenter',
          okText: '确定',
          okType: 'button-energized'
        });
        alertPopup.then(function (res) {
        });

      }
    };
    /**
     * 点击+增商品数
     * @param index
     */
    $scope.addNum = function (item) {
      var num = item.num + 1;
      $scope.updateCartProduct(item.id, num,
        function (data, status, headers, config) {
          item.num = data.num;
          if (item.seleted) {
            if ($.inArray(item.id, $scope.ids) < 0) {
              $scope.ids.push(item.id);
            }
            $scope.totalFee += parseFloat(item.price);
          }
        }, function (data, status, headers, config) {
          var alertPopup = $ionicPopup.alert({
            title: '友情提示',
            template: '数量超出范围~亲',
            cssClass: 'alerttextcenter',
            okText: '确定',
            okType: 'button-energized'
          });
          alertPopup.then(function (res) {
          });
        });
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
        //选择的时候加上当前的数量
        $scope.totalNum+=item.num;
        if ($.inArray(item.id, $scope.ids) < 0) {
          $scope.ids.push(item.id);
        }
      }
      else {
        $scope.totalFee -= parseFloat(item.price) * item.num;
        //取消选择时候减去当前的数量
        $scope.totalNum-=item.num;
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
     * 更新商品
     * @param cartId
     */
    $scope.updateCartProduct = function (cartId, num, successFun, errorFun) {
      daogouAPI.updateCartProduct({
          userid: $scope.USERINFO.id,
          cartId: cartId,
          id: cartId,
          num: num,
          user_id: $scope.USERINFO.id
        },
        function (data, status, headers, config) {
          successFun(data, status, headers, config);
        },
        function (data, status, headers, config) {
          errorFun(data, status, headers, config);
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
      // 如果选择的数量为0，不允许进入购物车
      // console.log(['CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC',productOrders.length]);
      if(productOrders.length>0){
        $state.go("creatorder");
      }else{
        var alertPopup = $ionicPopup.alert({
            title: '友情提示',
            template: '请选择您要购买的宝贝~亲',
            cssClass: 'alerttextcenter',
            okText: '确定',
            okType: 'button-energized'
          });
          alertPopup.then(function (res) {
          });

      }
    };
    /**
     *   购物车 订单列表切换
     */
    $scope.goOrderList = function () {
      if ($scope.USERINFO == null) {
        $scope.showLogin();
      } else {
        $state.go("orderList");
      }
    }

    /**
     * 关闭登录和蒙版
     */
    $scope.hideLogin = function () {
      $(".mengban").hide();
      $scope.login = false;
    }
    /**
     * 打开登录和蒙版
     */
    $scope.showLogin = function () {
      $(".mengban").show();
      $scope.login = true;
    }

  }]);
