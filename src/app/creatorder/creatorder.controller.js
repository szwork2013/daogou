'use strict';

var createOrder = angular.module('createOrder', ['ionic']);
createOrder.controller('creatorderCtrl',
  function ($rootScope, $scope, $log, $http, $state, URLPort, $stateParams, daogouAPI, WXpay, getLocation) {
    var productOrders = window.sessionStorage.getItem("productOrders");

    if (productOrders == null) {
      $state.go('orderList');
    } else {
      $scope.productOrders = JSON.parse(productOrders);
    }

    var URLPort = URLPort();
    $scope.totalprice = 0;
    $scope.buyfreight = 0;
    console.log(["$scope.productOrders", $scope.productOrders]);
    daogouAPI.formatSkuP($scope.productOrders);
    // daogouAPI.formatSku($scope.productOrders);
    angular.forEach($scope.productOrders, function (item, index) {
      item.bring_guider_id = $rootScope.GUIDID;
      $scope.totalprice += item.price * item.num;
      $scope.buyfreight += item.freight
    });
    $scope.totalcost = $scope.totalprice + parseFloat($scope.buyfreight);
    $scope.login = false;//处理登录框的一点样式问题，背景为白色
    $(".mengban").hide();
    $scope.weixinpay = true;
    $scope.loginhandle = true;//初始让登录模块隐藏
    $scope.alladdress = true;//初始让地址模块隐藏
    $scope.buyeraddress = true;
    $scope.firstBuyerAddress = true;
    // true为快递上门   false为门店取货
    $scope.express = true;
    var userInfo = window.sessionStorage.getItem("USERINFO");
    if (userInfo == null) {
      //如果未登录,显示登录框，进行登录
      $scope.loginhandle = false; //未登录让 登录模块不隐藏
      $scope.alladdress = true; //让地址模隐藏
    }
    else {
      $scope.USERINFO = JSON.parse(userInfo);
      $scope.USERID = $scope.USERINFO.id;
      $scope.USERNAME = $scope.USERINFO.name;
      $scope.USERMOBILE = $scope.USERINFO.mobile;
      //如果已经登录，查询用户是否有收货地址，若果有显示默认收货地址，如果没有显示添加收货地址
      //登录后的UI样式设置
      userIsLoginSetUI();
    }

    $scope.loginsuccess = function (data) {
      var userInfo = window.sessionStorage.getItem("USERINFO");
      $scope.USERINFO = JSON.parse(userInfo);
      $scope.USERID = $scope.USERINFO.id;
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
     $scope.noshop = false;//没有门店的情况
    $scope.shopway = function () {
      $scope.express = false;
      if ($rootScope.selectedStoreId) {//如果是选择门店地址

      } else {
        $rootScope.ListTwoStores = [];
        getLocation(function (lng, lat) {
          daogouAPI.shopAddressAll('/brands/' + $rootScope.BRANDID + '/stores/store-fetch', {
            user_id: $scope.USERID,
            longitude: lng,
            latitude: lat
          }, function (data, status, headers, config) {
            console.log(["有经纬度data",data]);
            if(data.length===0){//如果没有默认门店 返回的门店列表数组为空
                $scope.noshop = true;
            }else{
              getTwoStore(data);
              getFetchTime();//获得门店取货时间
            }
          }, function (data, status, headers, config) {
          });
        }, function () {
          daogouAPI.shopAddressId('/brands/' + $rootScope.BRANDID + '/stores/store-fetch', {
            user_id: $scope.USERID
          }, function (data, status, headers, config) {
            console.log(["无经纬度data",data]);
            $scope.shopaddressData = data;
            if($scope.shopaddressData.length===0){//如果没有默认门店 返回的门店列表数组为空
                $scope.noshop = true;
            }else{
                var flag = false;
                var defaultIndex = 0;
                for (var i in $scope.shopaddressData) {
                  if ($scope.shopaddressData[i].is_default === 1) {
                    flag = true;//如果有默认地址 flag为true
                    defaultIndex = i;
                  }
                }

               if(flag === true) {//有默认地址
                    $rootScope.minDistance = $scope.shopaddressData[defaultIndex];
                    $rootScope.ListTwoStores[0] = $rootScope.minDistance;
                    $scope.shopaddressData.splice(defaultIndex, 1);
                    if($scope.shopaddressData.length>0){
                     $rootScope.ListTwoStores[1]=$scope.shopaddressData[0];
                    }

                }else{
                     $rootScope.minDistance = $scope.shopaddressData[0];
                     $rootScope.ListTwoStores[0] =  $rootScope.minDistance;
                     if($scope.shopaddressData.length>1){
                      $rootScope.ListTwoStores[1] = $scope.shopaddressData[1];
                     }
                }
                getFetchTime();//获得门店取货时间
            }
          }, function (data, status, headers, config) {
          });
        });
      }
    }


    function getTwoStore(data) {
      console.log(["$scope.shopaddressData",$scope.shopaddressData]);
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
      console.log(["$rootScope.ListTwoStores", $rootScope.ListTwoStores]);
    }

    //获取门店取货时间
    $scope.fetchTime = {};
    $scope.fetchTime.fetchday = "";
    $scope.fetchTime.fetchhour = "";
    function getFetchTime() {
      daogouAPI.fetchTime({
        brand_id: $rootScope.BRANDID,
        user_id: $scope.USERID,
        store_id: $rootScope.minDistance.id
      }, function (data, status, headers, config) {
        console.log(["获取门店取货时间成功",data]);
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


    if($rootScope.buyerMessage){

    }else{
        $rootScope.buyerMessage = {
          'buyer_memo': ''
        };
    }
     


    $scope.submitOrder = function () {

      //支付按钮先创建订单再支付
      if ($scope.express === true) {
        //快递方式取货
         $http.post(URLPort + '/trades',
           {
            'buyer_user_id': $scope.USERID,
            'bring_guider_id': $rootScope.GUIDID,
            'brand_id': parseInt($rootScope.BRANDID),
            'buyer_memo': $rootScope.buyerMessage.buyer_memo,
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
            'orders': $scope.productOrders
          })
          .success(function (orderdata) {
            //创建订单成功调用微信支付
            WXpay($rootScope.BRANDID, orderdata.tid, function (data) {
              // alert('支付成功');
              // alert(JSON.stringify(data));
              $state.go('orderDetail', {tid: orderdata.tid})
            });
          })
          .error(function (data) {
            console.log(['提交订单失败', data]);
          })

      } else {
          //门店取货
          console.log(["$scope.fetchTime.fetchday.day",$scope.fetchTime.fetchday.day]);
          console.log(["$scope.fetchTime.fetchhour",$scope.fetchTime.fetchhour])
            if($scope.fetchTime.fetchday.day&&$scope.fetchTime.fetchhour){
                  $scope.fetchdayhour = $scope.fetchTime.fetchday.day + "T" + $scope.fetchTime.fetchhour + ":00+0800";
                  console.log(["$scope.fetchdayhour", $scope.fetchdayhour]);
                  $http.post(URLPort + '/trades',
                    {
                     'buyer_user_id': $scope.USERID,
                     'bring_guider_id': $rootScope.GUIDID,
                     'brand_id': parseInt($rootScope.BRANDID),
                     'buyer_memo': $rootScope.buyerMessage.buyer_memo,
                     'pay_type': 'WEIXIN',
                     'shipping_type': $scope.express ? "EXPRESS" : "FETCH",
                     'fetch_name': $scope.USERNAME,
                     'fetch_mobile':$scope.USERMOBILE,
                     'fetch_store_id': $rootScope.minDistance.id,
                     'fetch_store_name': $rootScope.minDistance.name,
                     'fetch_store_tel': $rootScope.minDistance.phone,
                     'fetch_state': $rootScope.minDistance.state,
                     'fetch_state_code': $rootScope.minDistance.state_code,
                     'fetch_city': $rootScope.minDistance.city,
                     'fetch_city_code': $rootScope.minDistance.city_code,
                     'fetch_district': $rootScope.minDistance.district,
                     'fetch_district_code': $rootScope.minDistance.district_code,
                     'fetch_address': $rootScope.minDistance.address,
                     'fetch_subscribe_begin_time': $scope.fetchdayhour,
                     'fetch_subscribe_end_time': $scope.fetchdayhour,
                     'orders': $scope.productOrders
                   })
                   .success(function (orderdata) {
                     console.log(['提交订单成功', orderdata]);
                     //创建订单成功调用微信支付
                     WXpay($rootScope.BRANDID, orderdata.tid, function (data) {
                       // alert('支付成功');
                       // alert(JSON.stringify(data));
                       $state.go('orderDetail', {tid: orderdata.tid})
                     });
                   })
                   .error(function (data) {
                     console.log(['提交订单失败', data]);
                   })
            }else{

                    $scope.userdataerror = {
                            error : true,
                            msg:"请选择取货时间"
                    }
                    console.log($scope.userdataerror.error)
                    return;
            }
           
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
        'userid': $scope.USERID,
        'refunds': 0
      });
    }
    $scope.changeReceiveInfoFunc = function () {//收货人地址列表页面
      console.log(['userid', $scope.USERID]);
      $state.go('changeReceiveInfo', {});
    }
    //限制备注最长200个字符
    $scope.limitText = function () {
      if ($rootScope.buyerMessage.buyer_memo.length > 200) {
        $rootScope.buyerMessage.buyer_memo = $rootScope.buyerMessage.buyer_memo.substring(0, 200);
      }
    }
    var autoTextarea = function (elem, extra, maxHeight) {
               extra = extra || 0;
               var isFirefox = !!document.getBoxObjectFor || 'mozInnerScreenX' in window,
               isOpera = !!window.opera && !!window.opera.toString().indexOf('Opera'),
                       addEvent = function (type, callback) {
                               elem.addEventListener ?
                                       elem.addEventListener(type, callback, false) :
                                       elem.attachEvent('on' + type, callback);
                       },
                       getStyle = elem.currentStyle ? function (name) {
                               var val = elem.currentStyle[name];
        
                               if (name === 'height' && val.search(/px/i) !== 1) {
                                       var rect = elem.getBoundingClientRect();
                                       return rect.bottom - rect.top -
                                               parseFloat(getStyle('paddingTop')) -
                                               parseFloat(getStyle('paddingBottom')) + 'px';        
                               };
        
                               return val;
                       } : function (name) {
                                       return getComputedStyle(elem, null)[name];
                       },
                       minHeight = parseFloat(getStyle('height'));
        
               elem.style.resize = 'none';
        
               var change = function () {
                       var scrollTop, height,
                               padding = 0,
                               style = elem.style;
        
                       if (elem._length === elem.value.length) return;
                       elem._length = elem.value.length;
        
                       if (!isFirefox && !isOpera) {
                               padding = parseInt(getStyle('paddingTop')) + parseInt(getStyle('paddingBottom'));
                       };
                       scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        
                       elem.style.height = minHeight + 'px';
                       if (elem.scrollHeight > minHeight) {
                               if (maxHeight && elem.scrollHeight > maxHeight) {
                                       height = maxHeight - padding;
                                       style.overflowY = 'auto';
                               } else {
                                       height = elem.scrollHeight - padding;
                                       style.overflowY = 'hidden';
                               };
                               style.height = height + extra + 'px';
                               scrollTop += parseInt(style.height) - elem.currHeight;
                               document.body.scrollTop = scrollTop;
                               document.documentElement.scrollTop = scrollTop;
                               elem.currHeight = parseInt(style.height);
                       };
               };
        
               addEvent('propertychange', change);
               addEvent('input', change);
               addEvent('focus', change);
               change();
       };
       var  oRemarkArea = document.getElementById("remarkArea");
       autoTextarea(oRemarkArea);



    function userIsLoginSetUI() {
      $scope.loginhandle = true; //已经登录让 登录模块隐藏
      $scope.alladdress = false; //让地址模不隐藏
      $scope.express = true;
      if ($rootScope.selectedStoreId) {
        $scope.express = false;
        console.log("选择取货门店")
        getFetchTime();//获得门店取货时间
      }
      $scope.USERID = $scope.USERID;
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

      $http.get(URLPort + '/users/' + $scope.USERID + '/shipping-addresses')
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
            $rootScope.firstAddressFlag = 1;//第一次填写收货地址 也就是默认收货地址，用完要清空0
            console.log(["第一次填写收货地址$rootScope.firstAddressFlag",$rootScope.firstAddressFlag])
            $scope.express = true;
            $scope.firstBuyerAddress = false; //隐藏选择地址模块，显示填写第一个地址模块
            $scope.buyeraddress = true;
            // $scope.searchProvinces();

          }

        })
        .error(function (data) {
          console.log(['当前用户没有收货地址，请填写第一个收货地址', data]);
          $rootScope.firstAddressFlag = 1;//第一次填写收货地址 也就是默认收货地址，用完要清空
          console.log(["第一次填写收货地址$rootScope.firstAddressFlag",$rootScope.firstAddressFlag])
          $scope.express = true;

          $scope.firstBuyerAddress = false; //隐藏选择地址模块，显示填写第一个地址模块
          $scope.buyeraddress = true;

          // $scope.searchProvinces();

        })
    }


  })

;
