'use strict';

var createOrder = angular.module('createOrder', ['ionic']);
createOrder.controller('creatorderCtrl',
  function ($rootScope, $scope, $log, $http, $state, URLPort, $stateParams, daogouAPI, WXpay, getLocation) {
    if (typeof $rootScope.productOrders === 'undefined' || typeof $rootScope.productOrders[0] === 'undefined') {
      $state.go('orderList');
      return;
    }
    var URLPort = URLPort();
    $scope.totalprice = 0;
    $scope.buyfreight = 0;
    angular.forEach($rootScope.productOrders, function (item, index) {
      item.bring_guider_id = $rootScope.GUIDID;
      $scope.totalprice += item.price * item.num;
      $scope.buyfreight += item.freight
    });
    $scope.totalcost = $scope.totalprice + parseFloat($scope.buyfreight);


    $scope.login = false;//处理登录框的一点样式问题，背景为白色
    $scope.weixinpay = true;
    $scope.loginhandle = true;//初始让登录模块隐藏
    $scope.alladdress = true;//初始让地址模块隐藏
    $scope.buyeraddress = true;
    $scope.firstBuyerAddress = true;
    // true为快递上门   false为门店取货
    $scope.express = true;

    //判断是否登录
    if (typeof $rootScope.USERINFO !== "undefined") {
      //如果已经登录，查询用户是否有收货地址，若果有显示默认收货地址，如果没有显示添加收货地址
      //登录后的UI样式设置
      userIsLoginSetUI();
    } else {
      //如果未登录,显示登录框，进行登录
      $scope.loginhandle = false; //未登录让 登录模块不隐藏
      $scope.alladdress = true; //让地址模隐藏
    }


    $scope.loginsuccess = function (data) {
      //登录后的UI样式设置
      userIsLoginSetUI()
    };
    $scope.loginerror = function (data) {

    };
    /**
     * 快递到家
     */
    $scope.postway = function () {
      $scope.express = true;
    }
    /**
     * 门店自取
     */
    $scope.shopway = function () {
      $scope.express = false;
      if ($rootScope.selectedStoreId) {//如果是选择门店地址

      } else {
        $rootScope.ListTwoStores = [];
        getLocation(function (lng, lat) {
          daogouAPI.shopAddressAll('/brands/' + $rootScope.productOrders[0].brand_id + '/stores/store-fetch', {
            user_id: $rootScope.USERINFO.id,
            longitude: lng,
            latitude: lat
          }, function (data, status, headers, config) {
            getTwoStore(data);
            getFetchTime();//获得门店取货时间
          }, function (data, status, headers, config) {
          });
        }, function () {
          daogouAPI.shopAddressId('/brands/' + $rootScope.productOrders[0].brand_id + '/stores/store-fetch', {
            user_id: $rootScope.USERINFO.id
          }, function (data, status, headers, config) {
            getTwoStore(data);
            getFetchTime();//获得门店取货时间
          }, function (data, status, headers, config) {
          });
        });
      }
    }


    function getTwoStore(data) {
      $scope.shopaddressData = data;
      var flag = false;
      var defaultIndex = 0;
      for (var i in $scope.shopaddressData) {
        if ($scope.shopaddressData[i].is_default === 1) {
          flag = true;//如果有默认地址 flag为true
          defaultIndex = i;
        }
      }
      if (flag === true) {//有默认地址
        $rootScope.minDistance = $scope.shopaddressData[defaultIndex];
        $rootScope.ListTwoStores[0] = $rootScope.minDistance;
        $scope.shopaddressData.splice(defaultIndex, 1);
        var minIndex = 0;
        for (var i = 0; i < $scope.shopaddressData.length - 1; i++) {
          if (parseFloat($scope.shopaddressData[i + 1].distance) > parseFloat($scope.shopaddressData[i].distance)) {
            minIndex = i + 1;
          }
        }
        $rootScope.ListTwoStores[1] = $scope.shopaddressData[minIndex];
      } else {//没有默认地址
        var minIndex = 0;
        for (var i = 0; i < data.length - 1; i++) {
          if (parseFloat(data[i + 1].distance) > parseFloat(data[i].distance)) {
            minIndex = i + 1;
          }
        }
        $rootScope.minDistance = data[minIndex];
        $rootScope.ListTwoStores[0] = $rootScope.minDistance;
        $scope.shopaddressData.splice(minIndex, 1);
        var minIndex = 0;
        for (var i = 0; i < $scope.shopaddressData.length - 1; i++) {
          if (parseFloat($scope.shopaddressData[i + 1].distance) > parseFloat($scope.shopaddressData[i].distance)) {
            minIndex = i + 1;
          }
        }
        $rootScope.ListTwoStores[1] = $scope.shopaddressData[minIndex];
      }

    }

    //获取门店取货时间
    $scope.fetchTime = {};
    $scope.fetchTime.fetchday = "";
    $scope.fetchTime.fetchhour = "";
    function getFetchTime() {
      daogouAPI.fetchTime({
        brand_id: $rootScope.productOrders[0].brand_id,
        user_id: $rootScope.USERINFO.id,
        store_id: $rootScope.minDistance.id
      }, function (data, status, headers, config) {
        $scope.fetchTimeData = data;
        $scope.fetchdayData = [];
        $scope.fetchhourData = [];
        for (var i in $scope.fetchTimeData) {
          $scope.fetchdayData[i] = {};
        }

        for (var i in $scope.fetchTimeData) {
          $scope.fetchdayData[i].index = i;
          $scope.fetchdayData[i].day = $scope.fetchTimeData[i].day;
        }
      }, function (data, status, headers, config) {
      });
    }

    $scope.dayselecthour = function (day) {
      $scope.fetchhourData = $scope.fetchTimeData[parseInt(day.index)].times;
    }


    $scope.getAddresses = function () {

    }
    //新增用户第一个收货地址信息
    $scope.firstAddressInput = {
      name: '',
      mobile: '',
      provinceInfo: '',
      cityInfo: '',
      districtInfo: '',
      address: '',
      zip: ''
    };

    $scope.addAddress = function (defaultAddress) {

      $http.post(URLPort + '/users/' + $rootScope.USERINFO.id + '/shipping-addresses', {
        'user_id': $rootScope.USERINFO.id,
        'name': $scope.firstAddressInput.name,
        'state': $scope.firstAddressInput.provinceInfo.name,
        'state_code': $scope.firstAddressInput.provinceInfo.code,
        'city': $scope.firstAddressInput.cityInfo.name,
        'city_code': $scope.firstAddressInput.cityInfo.code,
        'district': $scope.firstAddressInput.districtInfo.name,
        'district_code': $scope.firstAddressInput.districtInfo.code,
        'address': $scope.firstAddressInput.address,
        'zip': $scope.firstAddressInput.zip,
        'mobile': $scope.firstAddressInput.mobile,
        'is_default': defaultAddress
      })
        .success(function (data) {
          $rootScope.defaultAddressdata = data;
          $scope.loginhandle = true;
          $scope.alladdress = false;
          $scope.firstBuyerAddress = true;//隐藏填写第一个地址模块，显示选择地址模块
          $scope.buyeraddress = false;
          $scope.weixinpay = false;
        })
        .error(function (data) {
        })
    }
    //根据选择的省查询市
    $scope.provinceSelect = function (dataobj) {
      $http.get(URLPort + '/provinces/' + dataobj.pinyin + '/cities')
        .success(function (data) {
          $scope.citiesdata = data;
        })
        .error(function (data) {
        })
    }

    //根据选择的市查询地区
    $scope.citySelect = function (dataobj1, dataobj2) {

      $http.get(URLPort + '/provinces/' + dataobj1.pinyin + '/cities/' + dataobj2.pinyin + '/districts')
        .success(function (data) {
          $scope.districtsdata = data;
        })
        .error(function (data) {
        })
    }


    $scope.deleteAddress = function () {
      $http.delete(URLPort + '/users/' + $rootScope.USERINFO.id + '/shipping-addresses/18')
        .success(function () {
          console.log('删除地址成功');
          $scope.firstBuyerAddress = true;//隐藏填写第一个地址模块，显示选择地址模块
          $scope.buyeraddress = false;
        })
        .error(function () {
          console.log('删除新地址失败');

          $scope.express = true;

          $scope.firstBuyerAddress = false;//隐藏选择地址模块，显示填写第一个地址模块
          console.log(['$scope.firstBuyerAddress!!!!!!', $scope.firstBuyerAddress])
          $scope.buyeraddress = true;

        })
    }
    //查询省
    $scope.searchProvinces = function () {
      $http.get(URLPort + '/provinces')
        .success(function (data) {
          $scope.provincesdata = data;
        })
        .error(function (data) {
        })
    };


    $scope.buyerMessage = {
      'buyer_memo': ''
    };


    $scope.submitOrder = function () {

      //支付按钮先创建订单再支付
      if ($scope.express === true) {
        //快递方式取货
        $http.post(URLPort + '/trades',
          {
            'buyer_user_id': $rootScope.USERINFO.id,
            'bring_guider_id': $rootScope.GUIDID,
            'brand_id': parseInt($rootScope.productOrders[0].brand_id),
            'buyer_memo': $scope.buyerMessage.buyer_memo,
            'pay_type': 'WEIXIN',
            'shipping_type': $scope.express ? "EXPRESS" : "FETCH",
            'receiver_state': $rootScope.defaultAddressdata.state,
            'receiver_state_code': $rootScope.defaultAddressdata.state_code,
            'receiver_city': $rootScope.defaultAddressdata.city,
            'receiver_city_code': $rootScope.defaultAddressdata.city_code,
            'receiver_district': $rootScope.defaultAddressdata.district,
            'receiver_district_code': $rootScope.defaultAddressdata.district_code,
            'receiver_address': $rootScope.defaultAddressdata.address,
            'receiver_name': $rootScope.defaultAddressdata.name,
            'receiver_zip': $rootScope.defaultAddressdata.zip,
            'receiver_mobile': $rootScope.defaultAddressdata.mobile,
            'orders': $rootScope.productOrders
          }
        )
          .success(function (orderdata) {
            //创建订单成功调用微信支付
            WXpay($rootScope.BRANDID, orderdata.tid, function (data) {
              // alert('支付成功');
              alert(JSON.stringify(data));
              $state.go('orderDetail', {tid: orderdata.tid})
            });
          })
          .error(function (data) {
            console.log(['提交订单失败', data]);
          })

      } else {
        //门店取货
        $scope.fetchdayhour = $scope.fetchTime.fetchday.day + "T" + $scope.fetchTime.fetchhour + ":00+0800";
        console.log(["$scope.fetchdayhour", $scope.fetchdayhour]);
        $http.post(URLPort + '/trades',
          {
            'buyer_user_id': $rootScope.USERINFO.id,
            'bring_guider_id': $rootScope.GUIDID,
            'brand_id': parseInt($rootScope.productOrders[0].brand_id),
            'buyer_memo': $scope.buyerMessage.buyer_memo,
            'pay_type': 'WEIXIN',
            'shipping_type': $scope.express ? "EXPRESS" : "FETCH",
            'fetch_name': "",
            'fetch_store_id': $rootScope.minDistance.id,
            'fetch_store_name': $rootScope.minDistance.name,
            'fetch_state': $rootScope.minDistance.state,
            'fetch_state_code': $rootScope.minDistance.state_code,
            'fetch_city': $rootScope.minDistance.city,
            'fetch_city_code': $rootScope.minDistance.city_code,
            'fetch_district': $rootScope.minDistance.district,
            'fetch_district_code': $rootScope.minDistance.district_code,
            'fetch_address': $rootScope.minDistance.address,
            'fetch_subscribe_begin_time': $scope.fetchdayhour,
            'fetch_subscribe_end_time': $scope.fetchdayhour,
            'orders': $rootScope.productOrders
          }
        )
          .success(function (orderdata) {
            console.log(['提交订单成功', orderdata]);
            //创建订单成功调用微信支付
            WXpay($rootScope.BRANDID, orderdata.tid, function (data) {
              // alert('支付成功');
              alert(JSON.stringify(data));
              $state.go('orderDetail', {tid: orderdata.tid})
            });
          })
          .error(function (data) {
            console.log(['提交订单失败', data]);
          })
      }

    }


    $scope.logout = function () {
      daogouAPI.logout(function (data) {
        console.log(['退出成功', data])

      }, function (data) {
        console.log(['退出失败', data]);

      })
    }

    $scope.goGoodsShop = function () {//门店地址列表页面
      console.log(["$rootScope.ListTwoStores", $rootScope.ListTwoStores]);
      $state.go('goodsShop', {
        'userid': $rootScope.USERINFO.id,
        'brandid': $rootScope.productOrders[0].brand_id,
        'refunds': 0
      });
    }
    $scope.changeReceiveInfoFunc = function () {//收货人地址列表页面
      console.log(['userid', $rootScope.USERINFO.id]);
      $state.go('changeReceiveInfo', {'userid': $rootScope.USERINFO.id});
    }


    function userIsLoginSetUI() {
      $scope.loginhandle = true; //已经登录让 登录模块隐藏
      $scope.alladdress = false; //让地址模不隐藏
      $scope.express = true;
      if ($rootScope.selectedStoreId) {
        $scope.express = false;
        console.log("选择取货门店")
        getFetchTime();//获得门店取货时间
      }
      $rootScope.USERINFO.id = $rootScope.USERINFO.id;
      //查询用户的收获地址信息
      if ($rootScope.selectedAddressId) {
        console.log("这是选择收货地址情况");
        $scope.firstBuyerAddress = true; //隐藏填写第一个地址模块，显示选择地址模块
        $scope.buyeraddress = false;
        $scope.weixinpay = false;
      } else {
        checkoutAddress();
      }

    }

    function checkoutAddress() {

      $http.get(URLPort + '/users/' + $rootScope.USERINFO.id + '/shipping-addresses')
        .success(function (data) {

          if (data.length > 0) {
            console.log(['当前用户有收货地址，选择收获地址', data]);
            $scope.firstBuyerAddress = true; //隐藏填写第一个地址模块，显示选择地址模块
            $scope.buyeraddress = false;
            $scope.weixinpay = false;
            for (var i in data) { //选出默认收货地址
              if (data[i].is_default === 1) {
                $rootScope.defaultAddressdata = data[i];
              }
            }

          } else {
            console.log(['当前用户没有收货地址，请填写第一个收货地址', data]);
            $scope.express = true;
            $scope.firstBuyerAddress = false; //隐藏选择地址模块，显示填写第一个地址模块
            $scope.buyeraddress = true;
            $scope.searchProvinces();

          }

        })
        .error(function (data) {
          console.log(['当前用户没有收货地址，请填写第一个收货地址', data]);

          $scope.express = true;

          $scope.firstBuyerAddress = false; //隐藏选择地址模块，显示填写第一个地址模块
          $scope.buyeraddress = true;

          $scope.searchProvinces();

        })
    }


  })

//门店列表
  .controller('goodsShopCtrl', ['$rootScope', '$scope', '$log', '$http', 'daogouAPI', '$stateParams', '$state', function ($rootScope, $scope, $log, $http, daogouAPI, $stateParams, $state) {
    $log.debug('goodsShopCtrl');
    $scope.shopaddressData = [];
    $scope.shopaddressData = $rootScope.ListTwoStores;
    $scope.defaultstorefunc = function (store_id, index) {
      console.log(['store_id', store_id]);
      daogouAPI.defaultstore({
        brand_id: $stateParams.brandid,
        user_id: $rootScope.USERINFO.id,
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
      if ($stateParams.refunds === "1") {
        console.log(["$rootScope.refundsTid", $rootScope.refundsTid])
        console.log(["$rootScope.refundsOid", $rootScope.refundsOid])
        $state.go('returnApply', {'tid': $rootScope.refundsTid, 'oid': $rootScope.refundsOid});
      } else {
        $state.go('creatorder');
      }

    }


  }])
  .controller('changeReceiveInfoCtrl', ['$scope', '$log', '$http', 'URLPort', '$stateParams', 'daogouAPI', '$state', '$rootScope', function ($scope, $log, $http, URLPort, $stateParams, daogouAPI, $state, $rootScope) {
    $log.debug('changeReceiveInfoCtrl');
    var URLPort = URLPort();

    $http.get(URLPort + '/users/' + $rootScope.USERINFO.id + '/shipping-addresses')
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
        $http.get(URLPort + '/users/' + $rootScope.USERINFO.id + '/shipping-addresses')
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
        user_id: $rootScope.USERINFO.id,
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
      daogouAPI.deleteAddress({
        user_id: $rootScope.USERINFO.id,
        address_id: addressId
      }, function (data, status, headers, config) {
        console.log(['删除收货地址成功', data]);
        $scope.receiverAddressDate.splice(index, 1);
      }, function (data, status, headers, config) {
        console.log(['删除收货地址失败', data]);
      });
    }

    $scope.editAddressFunc = function (addressId) {
      $state.go('newAddress', {userid: $rootScope.USERINFO.id, addressid: addressId});
    }

    $scope.gonewAddress = function () {
      console.log(["$rootScope.USERINFO.id", $rootScope.USERINFO.id])
      $state.go('newAddress', {userid: $rootScope.USERINFO.id});
    }


  }])
  .controller('newAddressCtrl', ['$rootScope', '$scope', '$log', '$http', 'daogouAPI', '$stateParams', '$state', function ($rootScope, $scope, $log, $http, daogouAPI, $stateParams, $state) {
    $log.debug('newAddressCtrl');
    //新增用户收货地址信息
    $scope.newAddressInput = {
      name: '',
      mobile: '',
      provinceInfo: {},
      cityInfo: {},
      districtInfo: {},
      address: '',
      zip: '',
      defaultAddress: ''
    };
    $scope.newAddressInput.provinceInfo.name = "";
    $scope.newAddressInput.provinceInfo.code = "";
    $scope.newAddressInput.cityInfo.name = "";
    $scope.newAddressInput.cityInfo.code = "";
    $scope.newAddressInput.districtInfo.name = "";
    $scope.newAddressInput.districtInfo.code = "";
    console.log(["$stateParams.addressid", $stateParams.addressid]);
    if ($stateParams.addressid === "") {
      console.log("添加新地址");
    } else {
      daogouAPI.getAddress({
        user_id: $rootScope.USERINFO.id,
        address_id: $stateParams.addressid
      }, function (data, status, headers, config) {
        console.log(['获取要修改收货地址成功', data]);
        $scope.editData = data;
        $scope.newAddressInput.name = data.name;
        $scope.newAddressInput.mobile = data.mobile;
        $scope.newAddressInput.address = data.address;
        $scope.newAddressInput.zip = data.zip;
        // $scope.newAddressInput.provinceInfo.name = data.state;
        // $scope.newAddressInput.provinceInfo.code = data.state_code;
        // $scope.newAddressInput.cityInfo.name = data.city;
        // $scope.newAddressInput.cityInfo.code = data.city_code;
        // $scope.newAddressInput.districtInfo.name = data.district;
        // $scope.newAddressInput.districtInfo.code = data.district_code;
        $scope.newAddressInput.defaultAddress = data.is_default;
        //根据选择的省查询市
        daogouAPI.codegetarea({
          areacode: $scope.editData.state_code
        }, function (data, status, headers, config) {
          console.log(['查询省下市成功', data]);
          for (var i in data) {//编辑地址的时候显示原来的地址
            if (data[i].code === $scope.editData.city_code) {
              $scope.newAddressInput.cityInfo = data[i];
            }
          }
          $scope.citiesdata = data;
        }, function (data, status, headers, config) {
          console.log(['查询省下市失败', data]);
        });
        //根据选择的市查询地区
        daogouAPI.codegetarea({
          areacode: $scope.editData.city_code
        }, function (data, status, headers, config) {
          console.log(['查询市下地区成功', data]);
          for (var i in data) {//编辑地址的时候显示原来的地址
            if (data[i].code === $scope.editData.district_code) {
              $scope.newAddressInput.districtInfo = data[i];
            }
          }
          $scope.districtsdata = data;
        }, function (data, status, headers, config) {
          console.log(['查询市下地区失败', data]);
        });

      }, function (data, status, headers, config) {
        console.log(['获取要修改收货地址失败', data]);
      });
    }


    daogouAPI.searchProvinces({}, function (data, status, headers, config) {
      $scope.provincesdata = data;
      if (typeof($scope.editData) === "undefined") {//添加地址
        console.log(["typeof($scope.editData)", typeof($scope.editData)]);
      } else {
        for (var i in data) {//编辑地址的时候显示原来的地址
          if (data[i].code === $scope.editData.state_code) {
            $scope.newAddressInput.provinceInfo = data[i];
          }
        }
      }
      console.log(['查询省份成功', data]);
    }, function (data, status, headers, config) {
      console.log(['查询省份失败', data]);
    });

    //根据选择的省查询市
    $scope.provinceSelect = function (dataobj) {
      console.log(['selectcode', dataobj.code]);
      if (typeof($scope.editData) === "undefined") {//添加地址
        ;
      } else {
        if (dataobj.code === $scope.editData.state_code) {
          ;
        } else {
          $("#editCity").text("-- 请选择市 --");
          $scope.newAddressInput.cityInfo = {};
          $("#editDistrict").text("-- 请选择区、县 --");
          $scope.newAddressInput.districtInfo = {};
        }
      }

      daogouAPI.codegetarea({
        areacode: dataobj.code
      }, function (data, status, headers, config) {
        console.log(['查询省下市成功', data]);
        $scope.citiesdata = data;
      }, function (data, status, headers, config) {
        console.log(['查询省下市失败', data]);
      });
    }

    //根据选择的市查询地区
    $scope.citySelect = function (dataobj) {
      if (typeof($scope.editData) === "undefined") {//添加地址
      } else {
        if (dataobj.code === $scope.editData.city_code) {
          ;
        } else {
          $("#editDistrict").text("-- 请选择区、县 --");
          $scope.newAddressInput.districtInfo = {};
        }
      }
      daogouAPI.codegetarea({
        areacode: dataobj.code
      }, function (data, status, headers, config) {
        console.log(['查询市下地区成功', data]);
        $scope.districtsdata = data;
      }, function (data, status, headers, config) {
        console.log(['查询市下地区失败', data]);
      });
    }

    $scope.addAddressfunc = function (defaultAddress) {
      console.log(['$scope.newAddressInput', $scope.newAddressInput]);
      if ($stateParams.addressid === "") {
        daogouAPI.addAddress({
          user_id: $rootScope.USERINFO.id,
          name: $scope.newAddressInput.name,
          state: $scope.newAddressInput.provinceInfo.name,
          state_code: $scope.newAddressInput.provinceInfo.code,
          city: $scope.newAddressInput.cityInfo.name,
          city_code: $scope.newAddressInput.cityInfo.code,
          district: $scope.newAddressInput.districtInfo.name,
          district_code: $scope.newAddressInput.districtInfo.code,
          address: $scope.newAddressInput.address,
          zip: $scope.newAddressInput.zip,
          mobile: $scope.newAddressInput.mobile,
          is_default: defaultAddress
        }, function (data, status, headers, config) {
          console.log(['增加新地址成功', data]);//新增地址成功，跳转到地址模块，刚才加的地址为默认地址
          $scope.defaultAddressdata = data;
          $state.go('changeReceiveInfo', {'userid': $rootScope.USERINFO.id});
        }, function (data, status, headers, config) {
          console.log(['增加新地址失败', data]);//弹出失败提示 停在原页
        });
      } else {
        daogouAPI.editAddress({
          id: $stateParams.addressid,
          user_id: $rootScope.USERINFO.id,
          name: $scope.newAddressInput.name,
          state: $scope.newAddressInput.provinceInfo.name,
          state_code: $scope.newAddressInput.provinceInfo.code,
          city: $scope.newAddressInput.cityInfo.name,
          city_code: $scope.newAddressInput.cityInfo.code,
          district: $scope.newAddressInput.districtInfo.name,
          district_code: $scope.newAddressInput.districtInfo.code,
          address: $scope.newAddressInput.address,
          zip: $scope.newAddressInput.zip,
          mobile: $scope.newAddressInput.mobile,
          is_default: $scope.newAddressInput.defaultAddress
        }, function (data, status, headers, config) {
          console.log(['修改地址成功', data]);//新增地址成功，跳转到地址模块，刚才加的地址为默认地址
          $scope.defaultAddressdata = data;
          $state.go('changeReceiveInfo', {'userid': $rootScope.USERINFO.id});
        }, function (data, status, headers, config) {
          console.log(['修改地址失败', data]);//弹出失败提示 停在原页
        });
      }
    }
  }])
;
