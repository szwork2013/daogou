'use strict';

var order = angular.module('order', ['ionic']);
order.controller('orderDetailCtrl',
  function ($rootScope, $scope, $log, $http, $state, $stateParams, URLPort, daogouAPI, WXpay) {

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

    /**
     * 显示取货二维码
     */
    $scope.showQRcode = function () {
      return $rootScope.ISWX && $scope.fetchQRcode;
    };

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
            data.statusCN = "待付款";
            if (data.shipping_type === "EXPRESS") {
              $scope.expressReceiver = true;
            } else if (data.shipping_type === "FETCH") {
              $scope.fetchReceiver = true;
            }
            $scope.cancelpayOrder = true;
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
            $scope.cancelOrder = true;
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
            $scope.deleteOrder = true;
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
            $scope.deleteOrder = true;
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
            $scope.logisticsData = data;
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

        /**
         * 立即调用微信支付
         */
        if ($rootScope.PAYNOW) {
          WXpay($rootScope.BRANDID, $stateParams.tid, function (data) {
            // alert(JSON.stringify(data));
          });
        }

      })
      .error(function (data) {
        console.log(["获取订单详情失败", data]);
      });

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
      daogouAPI.cancelOrder({
        tid:tid
      }, function (data, status, headers, config) {
        console.log(['取消订单成功',data]);
      }, function (data, status, headers, config) {
        console.log(['取消订单失败',data]);
      });

    };



  });
