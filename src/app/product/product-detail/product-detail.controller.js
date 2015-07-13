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

    //skus是否都选择
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
      }
    );
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
        var mypopup = $ionicPopup.show({
          title: "提示",
          template: "您所填写的商品数量超过库存",
          buttons: [{
            text: "确定",
            type: "button-energized"
          }]
        });
      }
      if ($scope.productOrder.num < 1) {
        if ($scope.productOrder.num === "") {
        } else {
          $scope.productOrder.num = 1;
        }

      }
    };


    /**
     * 当点击购物车时让设置goCart 和 goOrder 的参数使参数面板的下一步 跳转到购物车还是生成订单
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
    }
    /**
     *
     */
    $scope.propertyShowOrder = function () {
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
      $scope.goCart = true;
      $scope.goOrder = false;
    }

    /**
     * 去我的订单
     */
    $scope.goToOrder = function () {
      $scope.productOrder.title = $scope.productDetailData.title;
      $scope.productOrder.freight = $scope.productDetailData.freight;
      $scope.productOrder.picUrlArr = $scope.productDetailData.picUrlArr;
      $scope.productOrder.brand_id = $rootScope.BRANDID;
      window.sessionStorage.setItem("productOrders", JSON.stringify([$scope.productOrder]));
      $state.go("creatorder");
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
          $state.go("cart", { });
        })
        .error(function (data) {
        })
    };


    $scope.loginsuccess = function (data) {
     $scope.propertyClose();
    };
    $scope.loginerror = function (data) {
      console.log(['登录失败回调', data])
    };
  }
)
