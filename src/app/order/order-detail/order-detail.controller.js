'use strict';

var order = angular.module('order', ['ionic']);
order.controller('orderDetailCtrl',
  function ($rootScope, $scope, $log, $http, $state, $stateParams,$ionicLoading, URLPort, daogouAPI, WXpay,$ionicPopup,getRequest) {
    daogouAPI.isLogin(function(data) {
      var userInfo = window.sessionStorage.getItem("USERINFO");
      $scope.USERINFO = JSON.parse(userInfo);
      getOrderDetail();
    }, function(data) {
      var userInfo = window.sessionStorage.getItem("USERINFO");
      if (userInfo != null && data.length > 0) {
        $ionicLoading.show({
          template: '您的帐号在另一台设备进行登录，请重新登录',
          duration: 2000,
        });
      };
      $scope.login = true;
      $(".mengban").show();
    });
    
    $scope.loginsuccess = function(data) {
      $(".mengban").hide();
      $scope.login = false;
      //回调再获取用户信息
      var userInfo = window.sessionStorage.getItem("USERINFO");
      $scope.USERINFO = JSON.parse(userInfo);
      $scope.USERID = $scope.USERINFO.id;
      getOrderDetail();
    }
    $scope.loginerror = function(data) {

    }
//==============================阅完可删除,若不删,留作纪念,我也不反对线====================================
    //这个切换其实是2个页面 不是页面内切换的
    //一个是购物车页cart   应该是订单列表  order → order-list
//==============================阅完可删除,若不删,留作纪念,我也不反对线====================================
    var URLPort = URLPort();
    console.log(["$stateParams.tid", $stateParams.tid]);
    $scope.expressReceiver = false;//快递方式收货人地址模块
    $scope.fetchReceiver = false;//门店自取收货人地址模块
    $scope.fetchshop = false;//门店自取门店地址信息
    $scope.fetchQRcode = false;//门店自取二维码信息
    $scope.logistics = false;//物流信息
    $scope.payWay = false;//付款方式
    $scope.payNo = false;//交易号
    $scope.deleteOrder = false;//删除订单
    $scope.cancelpayOrder = false;//取消订单，立即付款
    $scope.cancelOrder = false;//取消订单
    $scope.refund = false;//商品列表上的退款按钮
    $scope.statuscode = 0;//订单状态
    $scope.showrefunds=false;//显示退货按钮
    // $scope.refunding = false;//商品列表上的退款中按钮
    // $scope.returned=false;//退货完成

    /**
     * 显示取货二维码
     */
    $scope.showQRcode = function () {
      return $rootScope.ISWX && $scope.fetchQRcode;
    };




    function getOrderDetail(){
        $http.get(URLPort + "/trades/" + $stateParams.tid + "?show_orders=true")
          .success(function (data) {

            console.log(['orderdetail', data])
            switch (data.pay_type) {
              case "WEIXIN":
                data.pay_typeCN = "微信支付";
                break;
              case "ALIPAY":
                data.pay_typeCN = "支付宝支付";
                break;
              case "BANKCARDPAY":
                data.pay_typeCN = "银行卡支付";
                break;
            }
            switch (data.status) {
              case "WAIT_BUYER_PAY":
                $scope.statuscode=1;
                data.statusCN = "待付款";
                if (data.shipping_type === "EXPRESS") {
                  $scope.expressReceiver = true;
                } else if (data.shipping_type === "FETCH") {
                  $scope.fetchReceiver = true;
                }
                $scope.cancelpayOrder = true;

                /**
                 * 立即调用微信支付
                 */
                if ($rootScope.PAYNOW) {
                  $ionicLoading.show({
                    template: '支付中...',
                    duration:1500,
                  })
                  WXpay($rootScope.BRANDID, $stateParams.tid, function (data) {
                    // alert(JSON.stringify(data));
                    $rootScope.PAYNOW=false;
                    // getOrderDetail();
                    $state.go("successPay");
                  });
                }

                break;
              case "SELLER_CONSIGNED_PART":
                $scope.statuscode=2;
                data.statusCN = "卖家部分发货";
                break;
              case "WAIT_SELLER_SEND_GOODS":
                $scope.statuscode=3;
                data.statusCN = "待发货";
                $scope.expressReceiver = true;
                $scope.cancelOrder = true;
                $scope.payWay = true;
                $scope.payNo = true;
                break;
              case "WAIT_BUYER_CONFIRM_GOODS":
                $scope.statuscode=4;
                data.statusCN = "已发货（快递发货）";
                $scope.expressReceiver = true;
                $scope.logistics = true;
                // $scope.cancelOrder = true;
                // $scope.refund = true;
                // //检测是否可以退货
                // checkreturned();
                $scope.payWay = true;
                $scope.payNo = true;
                break;
              case "WAIT_BUYER_FETCH_GOODS":
                $scope.statuscode=5;
                data.statusCN = "待取货";
                $scope.fetchReceiver = true;
                $scope.fetchQRcode = true;
                $scope.payWay = true;
                $scope.payNo = true;
                $scope.cancelpayOrder = false;
                // $scope.refund = true;
                //只有在待取货时执行5s循环，实时改变订单状态
                setTimeout(function(){
                  getOrderDetail();
                },5000);
                break;
              case "TRADE_FINISHED":
                $scope.statuscode=6;
                data.statusCN = "已完成";
                if (data.shipping_type === "EXPRESS") {
                  $scope.expressReceiver = true;
                  $scope.logistics = true;
                } else if (data.shipping_type === "FETCH") {
                  $scope.fetchReceiver = true;
                  $scope.fetchshop = true;
                }
                // $scope.deleteOrder = true;
                // $scope.refund = true;
                // //检测以否已完成退货
                // checkreturned();
                $scope.payWay = true;
                $scope.payNo = true;
                break;
              case "TRADE_CLOSED_BY_SYSTEM":
              case "TRADE_CLOSED_BY_SELLER":
              case "TRADE_CLOSED_BY_BUYER":
              case "TRADE_CLOSED_BY_SPLIT":
                $scope.statuscode=7;
                data.statusCN = "已关闭";
                if (data.shipping_type === "EXPRESS") {
                  $scope.expressReceiver = true;
                  $scope.logistics = true;
                } else if (data.shipping_type === "FETCH") {
                  $scope.fetchReceiver = true;
                  $scope.fetchshop = true;
                  console.log(["typeof(data.receive_guider_id)", typeof(data.receive_guider_id)])
                  if (typeof(data.receive_guider_id) === "undefined") {
                    $scope.fetchshop = false;
                  }
                }
                $scope.cancelOrder = false;
                $scope.cancelpayOrder = false;
                // $scope.deleteOrder = true;
                $scope.payWay = true;
                break;
            }




            //检测是否可以退货-->开始

              $http.get(URLPort + "/trades/" + $stateParams.tid + "/refunds")
                .success(function(data) {
                  console.log(["获取可退货商品成功", data]);
                  for (var i in data.details) {
                    var iscan = data.details[i].item_num - data.details[i].refund_item_num;
                    if (iscan != 0) {
                      $scope.orderDetailData.orders[i].refunds=true;
                    }else{
                      $scope.orderDetailData.orders[i].refunds=false;
                    }
                  }
                })
                .error(function(data) {
                  console.log(["获取可退货商品失败", data])
                })

            //检测是否可以退货<--结束
            $scope.showrefunds=$scope.statuscode==4||$scope.statuscode==6;

            /**
             * 根据导购编号和品牌编号获取导购名和工作号
             */
            if (data.receive_guider_id) {
              $http.get(URLPort + "/brands/" + data.brand_id + "/guiders/" + data.receive_guider_id + "/details")
                .success(function (data) {
                  $scope.guiderData = data;
                })
                .error(function (data) {
                })
            }
            /**
             * 获取物流信息
             */
            if (data.express_no) {
              daogouAPI.logistics({
                express_company: data.express_company,
                express_no: data.express_no
              }, function (data, status, headers, config) {
                //时间转换
                for(var i=0;i<data.length;i++){
                  data[i].arrive_time=data[i].arrive_time.split('+')[0].replace('T',' ')
                  $scope.logisticsData = data;
                }
              }, function (data, status, headers, config) {
              });
            }

            angular.forEach(data.orders, function (item, index) {
              item.pics = item.pic_path.split(",");
            });
            /**
             * sku
             */
            daogouAPI.formatSku(data.orders);
            $scope.orderDetailData = data;
            //截取商品属性，m为多产品的数量，i为单一产品属性用；分割后的数量
            for (var m = 0; m <$scope.orderDetailData.orders.length ; m++) {
              //将属性保存在一个空的字符串中
              $scope.valuesku='';
              //从第一个产品开始分割属性
              $scope.orderDetailData.orders[m].sku_properties_name = $scope.orderDetailData.orders[m].sku_properties_name.split(";")
              for (var i = 0; i < $scope.orderDetailData.orders[m].sku_properties_name.length; i++) {
                $scope.orderDetailData.orders[m].sku_properties_name[i] = $scope.orderDetailData.orders[m].sku_properties_name[i].split(":")[1] + ' ';
                $scope.valuesku = $scope.valuesku.concat($scope.orderDetailData.orders[m].sku_properties_name[i]);
              }
              $scope.orderDetailData.orders[m].sku_properties_name=$scope.valuesku;
            }
            //此参数是为了传递给付款成功后的订单金额和订单跳转的数据
            $rootScope.payData=data;
            //格式化取货时间
            // if($scope.orderDetailData.fetch_time){
            //   var fetchTimeArr = $scope.orderDetailData.fetch_time.split("T");
            //   $scope.orderDetailData.fetch_time = fetchTimeArr[0];
            // }



          })
          .error(function (data) {
            console.log(["获取订单详情失败", data]);
          });
    }
    // getOrderDetail();

    // function checkoutaaaaaa() {
    //   $http.get(URLPort + "/trades/" + $stateParams.tid + "/refunds")
    //     .success(function(data) {
    //       console.log(["获取可退货商品成功", data]);
    //       for (var i in data.details) {
    //         var iscan = data.details[i].item_num - data.details[i].refund_item_num;
    //         // iscan++
    //         if (iscan == 0) {
    //           $scope.refund = false;
    //           $scope.returned=true;
    //         }
    //         console.log(["iscaniscaniscaniscan", iscan]);
    //       }
    //       // $scope.refundData = data;
    //       // daogouAPI.formatSku($scope.refundData.details);

    //     })
    //     .error(function(data) {
    //       console.log(["获取可退货商品失败", data])
    //     })
    // }
    // checkoutaaaaaa();


    /**
     * 调用微信内置地图
     */
    $scope.openLocation=function(){
      $ionicLoading.show({
        template: '加载中...'
      })
      //获取门店信息  ”获取路线“功能需要门店经纬度
      daogouAPI.getStoreInfo($scope.orderDetailData.fetch_store_id,function(storedata){
        $ionicLoading.hide()
        //调用微信地理位置
        wx.openLocation({
          latitude: storedata.latitude, // 纬度，浮点数，范围为90 ~ -90
          longitude: storedata.longitude, // 经度，浮点数，范围为180 ~ -180。
          name: storedata.name, // 位置名
          address: storedata.address, // 地址详情说明
          scale: 28, // 地图缩放级别,整形值,范围从1~28。默认为最大
          infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
        });
      },function(errordata){
        $ionicLoading.hide()
      })

    }

    /**
     * 退货
     * @param tid
     * @param oid
     */
    $scope.refundfunc = function (tid, oid) {
      $state.go("returnApply", {tid: tid, oid: oid});
    };
    /**
     * 支付
     */
     var payType = "ALIPAY"
     //判断环境
     if(/micromessenger/i.test(window.navigator.userAgent)){
       payType = "WEIXIN";
     } else {
       payType = "ALIPAY";
     }
    $scope.payThisOrder = function () {
      if(payType == "WEIXIN"){
        WXpay($rootScope.BRANDID, $stateParams.tid, function (data) {
          $state.go("successPay");
        });
      } else {
        $http.get("/trades/buyer-pay-init/alipay/request?type=pay&tid=" + $stateParams.tid + "&return_url=/shopping/pay-transfer.html&extra_common_param="+$rootScope.GUIDID+"-"+$rootScope.BRANDID).success(function(data){
          //阿里支付
          location.href = data.url;
        })
      }
    }
    /**
     * 商品详情
     * @param id
     */
    $scope.goDetail = function (id) {
      $state.go("productDetail", {detailId: id});
    };

    /**
    *取消订单
    *@param tid
    */
    $scope.cancelOrderFunc = function(tid){
     var confirmPopup = $ionicPopup.confirm({
            title: '订单取消后不可恢复，是否确认?',
            cancelText: '取消',
            cancelType: 'button-default',
            okText: '确认',
            okType: 'button-assertive',
         });
         confirmPopup.then(function(res) {
           if(res) {
                daogouAPI.cancelOrder({
                  tid:tid
                }, function (data, status, headers, config) {
                  console.log(['取消订单成功',data]);
                  getOrderDetail();
                }, function (data, status, headers, config) {
                  console.log(['取消订单失败',data]);
                });
           } else {
              console.log('取消取消订单');
           }
         });



    };



  });
