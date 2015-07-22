'use strict';

var order = angular.module('order', ['ionic']);
order.controller('orderDetailCtrl',
  function ($rootScope, $scope, $log, $http, $state, $stateParams,$ionicLoading, URLPort, daogouAPI, WXpay,$ionicPopup,getRequest) {

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
    $scope.refunding = false;//商品列表上的退款中按钮
    $scope.ishare = true;//正常是消费者，false为导购

    /**
     * 显示取货二维码
     */
    $scope.showQRcode = function () {
      return $rootScope.ISWX && $scope.fetchQRcode;
    };

    function getOrderDetail(){
        $http.get(URLPort + "/trades/" + $stateParams.tid + "?show_orders=true")
          .success(function (data) {
            if(getRequest('share') === 'true'){
              $scope.ishare = true;
            }else{
              $scope.ishare = false;
            }
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
                data.statusCN = "卖家部分发货";
                break;
              case "WAIT_SELLER_SEND_GOODS":
                data.statusCN = "待发货";
                $scope.expressReceiver = true;
                $scope.cancelOrder = true;
                $scope.payWay = true;
                $scope.payNo = true;
                break;
              case "WAIT_BUYER_CONFIRM_GOODS":
                data.statusCN = "已发货（快递发货）";
                $scope.expressReceiver = true;
                $scope.logistics = true;
                // $scope.cancelOrder = true;
                $scope.refund = true;
                $scope.payWay = true;
                $scope.payNo = true;
                break;
              case "WAIT_BUYER_FETCH_GOODS":

                data.statusCN = "待取货";
                $scope.fetchReceiver = true;
                $scope.fetchQRcode = true;
                $scope.payWay = true;
                $scope.payNo = true;
                $scope.cancelpayOrder = false;
                // $scope.refund = true;
                break;
              case "TRADE_FINISHED":
                data.statusCN = "已完成";
                if (data.shipping_type === "EXPRESS") {
                  $scope.expressReceiver = true;
                  $scope.logistics = true;
                } else if (data.shipping_type === "FETCH") {
                  $scope.fetchReceiver = true;
                  $scope.fetchshop = true;
                }
                // $scope.deleteOrder = true;
                $scope.refund = true;
                $scope.payWay = true;
                $scope.payNo = true;
                break;
              case "TRADE_CLOSED_BY_SYSTEM":
              case "TRADE_CLOSED_BY_SELLER":
              case "TRADE_CLOSED_BY_BUYER":
              case "TRADE_CLOSED_BY_SPLIT":
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
    getOrderDetail();


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
    $scope.payThisOrder = function () {
      WXpay($rootScope.BRANDID, $stateParams.tid, function (data) {
      });
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
