'use strict';

var product = angular.module('product', ['ionic']);
product.controller('productDetailCtrl',
  function ($rootScope, $scope, $log, $http, $state, $stateParams, URLPort, daogouAPI, $ionicPopup) {
    var URLPort = URLPort();
    $scope.login = false;//是否显示登录页面
    //创建订单页的 订单数据
    $scope.productOrder = {
      bring_guider_id: $rootScope.GUIDID
    };
    window.sessionStorage.removeItem("productOrders");
    //sku是否选择全
    $scope.allSelected = false;
    /**
     * 获取单个商品信息
     */
    $http.get(URLPort + "/items/" + $stateParams.detailId)
      .success(function (data) {
        setTimeout(function () {
          $("#sliders").touchSlider({
            animatetime: 300,
            automatic: !0,
            timeinterval: 4e3,
            sliderpoint: !0,
            sliderpointwidth: 8,
            sliderpointcolor: "#fa9d00"
          });
        }, 200);
        $scope.productDetailData = data;
        $scope.productDetailData.realquantity = 0;//剩余库存数量
        $scope.productDetailData.picUrlArr = $scope.productDetailData.pic_url.split(',');
        angular.forEach($scope.productDetailData.components, function (item, index) {
          $scope.productDetailData.content += item.comp_content;
        });
        angular.forEach($scope.productDetailData.skus, function (item, index) {
          $scope.productDetailData.realquantity += item.real_quantity;
        });
        $http.get(URLPort + "/items/" + $stateParams.detailId + "/standards-used").success(function (skus) {
          $scope.productDetailData.usedSkus = skus;
          angular.forEach($scope.productDetailData.usedSkus, function (item, index) {
            var skuValues = [];
            angular.forEach(item.values, function (subItem, subIndex) {
              if (subItem.is_selected == 1) {
                skuValues.push(subItem.value);
              }
            });
            item.skuValues = skuValues.join(" ");
          });
        });
      })
      .error(function (data) {
        console.log(['获得商品详情失败', data]);
      });
    /**
     *打开选取商品SKU
     */
    function propertyMenu() {
      $(".hideradio:checked").removeAttr('checked');
      $("input[selected=selected]").removeAttr("selected");
      $scope.productDetailData.properties = "";
      $scope.allSelected = false;
      $(".mengban,.chooseProductInfoWarp").show();
    };
    /**
     *关闭选取商品SKU
     */
    $scope.propertyClose = function () {
      if ($scope.USERINFO != null) {
        $(".mengban,.chooseProductInfoWarp ").hide();
        $scope.login = false;
      }
    };
    /**
     * 选择产品规格，显示是否有剩余
     */
    $scope.checkSku = function (sku, skuValue, event) {
      if ($(event.target).attr("selected") == "selected") {
        $(event.target).removeAttr('checked');
        $("input[name='" + sku.p_id + "']").removeAttr("selected");
      } else {
        $("input[name='" + sku.p_id + "']").removeAttr("selected");
        $(event.target).attr("selected", "selected");
      }

      var properties = [];
      angular.forEach($("input[selected=selected]"), function (input, index) {
        properties.push(input.id);
      });
      if (properties.length == $scope.productDetailData.usedSkus.length) {
        $scope.allSelected = true;
        $scope.productDetailData.properties = properties.join(";");
      } else {
        $scope.allSelected = false;
        $scope.productDetailData.properties = "";
      }
    };
    /**
     * 监测选择的sku
     */
    $scope.$watch("productDetailData.properties", function (newValue, oldValue) {
      if ($scope.allSelected) {
        var list = $scope.productDetailData.skus.filter(function (sku) {
          return sku.properties == $scope.productDetailData.properties;
        });
        if (list.length > 0) {
          $scope.productOrder = list[0];
          $scope.productOrder.num = 1;
        }
      }
    });
    /**
     * 点击- 减商品数
     */
    $scope.delNum = function () {
      if ($scope.productOrder.num > 1) {
        $scope.productOrder.num--;
      } else {
        var alertPopup = $ionicPopup.alert({
          title: '友情提示',
          template: '受不了了，宝贝不能再少了哦',
          cssClass: 'alerttextcenter',
          okText: '确定',
          okType: 'button-energized'
        });
        alertPopup.then(function (res) {
          console.log('Thank you for not eating my delicious ice cream cone');
        });
      }
    };
    /**
     * 点击+增商品数
     */
    $scope.addNum = function () {
      if ($scope.productOrder.num < $scope.productOrder.real_quantity) {
        $scope.productOrder.num++;
      } else {
        var alertPopup = $ionicPopup.alert({
          title: '友情提示',
          template: '数量超出范围~亲',
          cssClass: 'alerttextcenter',
          okText: '确定',
          okType: 'button-energized'
        });
        alertPopup.then(function (res) {
        });

      }
    };
    /**
     * 判断数量是否小于库存
     */
    $scope.checknum = function () {
      if ($scope.productOrder.num > $scope.productOrder.real_quantity) {
        //如果购物车的数量大于最大数量，自动输出最大数量
        $scope.productOrder.num = $scope.productOrder.real_quantity;
        var alertPopup = $ionicPopup.alert({
          title: '友情提示',
          template: '您所填写的商品数量超过库存',
          cssClass: 'alerttextcenter',
          okText: '确定',
          okType: 'button-energized'
        });
        alertPopup.then(function (res) {
          console.log('Thank you for not eating my delicious ice cream cone');
        });
      }
      if ($scope.productOrder.num < 1) {
        if ($scope.productOrder.num === "") {
        } else {
          $scope.productOrder.num = 1;
          var alertPopup = $ionicPopup.alert({
            title: '友情提示',
            template: '至少得选择一个哦~亲',
            cssClass: 'alerttextcenter',
            okText: '确定',
            okType: 'button-energized'
          });
          alertPopup.then(function (res) {
            console.log('Thank you for not eating my delicious ice cream cone');
          });
        }

      }
    };
    /**
     * 加入购物车
     */
    $scope.propertyShowCart = function () {
      var userInfo = window.sessionStorage.getItem("USERINFO");
      if (userInfo == null) {
        $scope.login = true;
        $(".mengban").show();
      }
      else {
        $scope.USERINFO = JSON.parse(userInfo);
        $scope.USERID = $scope.USERINFO.id;
        propertyMenu();
      }
      $scope.goCart = false;
      $scope.goOrder = true;
    };
    /**
     *立即购买
     */
    $scope.propertyShowOrder = function () {
      $scope.goCart = true;
      $scope.goOrder = false;
      propertyMenu();

    };
    /**
     * 去我的订单
     */
    $scope.goToOrder = function () {
      var userInfo = window.sessionStorage.getItem("USERINFO");
      if (userInfo == null) {
        $scope.login = true;
        $(".mengban").show();
        //如果是立即购买，在登录时候隐藏sku面板
        $(".chooseProductInfoWarp").hide();
      }
      else {
        $scope.USERINFO = JSON.parse(userInfo);
        $scope.USERID = $scope.USERINFO.id;
        $scope.productOrder.title = $scope.productDetailData.title;
        $scope.productOrder.freight = $scope.productDetailData.freight;
        $scope.productOrder.picUrlArr = $scope.productDetailData.picUrlArr;
        $scope.productOrder.brand_id = $rootScope.BRANDID;
        window.sessionStorage.setItem("productOrders", JSON.stringify([$scope.productOrder]));
        $state.go("creatorder");
      }
    };
    /**
     * 去我的购物车
     */
    $scope.goToCart = function () {
      $http.post(URLPort + "/users/" + $scope.USERID + "/shopping-carts", {
        "user_id": $scope.USERID,
        "sku_id": $scope.productOrder.sku_id,
        "num": $scope.productOrder.num,
        "bring_guider_id": $rootScope.GUIDID
      })
        .success(function (data) {
          $state.go("cart", {});
        })
        .error(function (data) {
          //如果当前要添加的产品数量再加上产品在购物车中已经加入的产品数量大于产品的总量，则显示弹窗
          var alertPopup = $ionicPopup.alert({
            title: '友情提示',
            template: '您添加到购物车的此宝贝数量加上购物车中此宝贝已有的数量已经超过库存咯~亲',
            cssClass: 'alerttextcenter',
            okText: '确定',
            okType: 'button-energized'
          });
          alertPopup.then(function (res) {
            console.log('Thank you for not eating my delicious ice cream cone');
          });
        })
    };
    /**
     * 登录成功回调
     * @param data
     */
    $scope.loginsuccess = function (data) {
      $scope.propertyClose();
      //如果是立即购买，在登录成功后再显示sku选中的信息，可进入下一步
      if ($scope.goCart) {
        $(".chooseProductInfoWarp").show();
      }
      //登录成功回调之后，检测用户是否登录，如果登录了购物车中有物品，显示小红点，没有物品不显示小红点
      daogouAPI.isLogin(function () {
        //获取用户信息
        var userInfo = window.sessionStorage.getItem("USERINFO");
        $scope.USERINFO = JSON.parse(userInfo);
        $scope.USERID = $scope.USERINFO.id;
        //购物车的用户信息
        daogouAPI.shopcart({
          userid: $scope.USERINFO.id,
          brand_id: $rootScope.BRANDID,
          page: 1,
          per_page: 5
        }, function (data, status, headers, config) {
          if (data.length > 0) {
            $('.redPoint').show()
          }
        }, function (data, status, headers, config) {
        });
      }, function () {
      });
    };
    /**
     * 登录错误回调
     */
    $scope.loginerror = function (data) {
      console.log(['登录失败回调', data])
    };
  }
);
