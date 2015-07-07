'use strict';

var order = angular.module('orderList', ['ionic']);
order.controller('orderListCtrl', ['$scope', '$log', '$http', 'URLPort', 'daogouAPI', '$state', '$stateParams', '$rootScope', function ($scope, $log, $http, URLPort, daogouAPI, $state, $stateParams, $rootScope) {


//==============================阅完可删除,若不删,留作纪念,我也不反对线====================================
  //这个切换其实是2个页面 不是页面内切换的
  //一个是购物车页cart   应该是订单列表  order → order-list
//==============================阅完可删除,若不删,留作纪念,我也不反对线====================================
  daogouAPI.isLogin(function(data){
    console.log("我是order登录检查登录了")
    console.log(data)

    //获取订单信息
    getOrderListFunc();

  },function(data){
    console.log("我是order登录检查没登录")
    $scope.login=true;
  });
  var URLPort = URLPort();


  $scope.productListData = [];
  var pageindex = 1;
  var pagesize = 5;
  $scope.hasMoreOrder = true; 




  function getOrderListFunc() {
    daogouAPI.getOrderList("/trades/users/" + $rootScope.USERINFO.id, {
      page: pageindex,
      per_page: pagesize,
      show_orders: true
    }, function (data, status, headers, config) {
      console.log(["查询消费者的订单列表成功", data]);
      console.log(["hasMoreOrder", $scope.hasMoreOrder]);
      console.log(["pageindex", pageindex]);
      $rootScope.BRANDID = data[0].brand_id;
      angular.forEach(data, function (item, index) {
        switch (item.status) {
          case "WAIT_BUYER_PAY":
            item.statusCN = "等待买家付款";
            break;
          case 'SELLER_CONSIGNED_PART':
            item.statusCN = "卖家部分发货";
            break;
          case 'WAIT_SELLER_SEND_GOODS':
            item.statusCN = '等待卖家发货';
            break;
          case 'WAIT_BUYER_CONFIRM_GOODS':
            item.statusCN = '等待买家确认收货';
            break;
          case 'WAIT_BUYER_FETCH_GOODS':
            item.statusCN = '等待买家取货';
            break;
          case 'TRADE_FINISHED':
            item.statusCN = '交易成功';
            break;
          case 'TRADE_CLOSED_BY_SYSTEM':
            item.statusCN = '系统自动关闭交易';
            break;
          case 'TRADE_CLOSED_BY_SELLER':
            item.statusCN = '卖家关闭交易';
            break;
          case 'TRADE_CLOSED_BY_BUYER':
            item.statusCN = '买家关闭交易';
            break;
          case 'TRADE_CLOSED_BY_SPLIT':
            item.statusCN = '订单被拆分后关闭交易';
            break;
          default:
            return '等待买家付款';
        }

        item.leftTime = $scope.MillisecondToDate(new Date(item.pay_end_time).getTime() - new Date(item.out_pay_end_time).getTime());
        angular.forEach(item.orders, function (itemOrder, index) {
          itemOrder.pics = itemOrder.pic_path.indexOf(",") > 0 ? itemOrder.pic_path.split(",") :[itemOrder.pic_path] ;
        });
      });
      $scope.productListData = $scope.productListData.concat(data);
      console.log(["data.length", data.length])
      if (data.length >= pagesize) {
        pageindex++;
        console.log(["pageindex+++++++", pageindex])
      } else {
        $scope.hasMoreOrder = false;
        console.log(["hasMoreOrder", $scope.hasMoreOrder])
      }
      $scope.$broadcast('scroll.infiniteScrollComplete');

    }, function (data, status, headers, config) {
      console.log(["查询消费者的订单列表失败", data]);
    });
  }



  $scope.loginsuccess=function(data){
      console.log(["order的回调", data]);
      $scope.login=false;
      $(".redPoint").show();
      //获取订单信息
      getOrderListFunc();
  }
  $scope.loginerror=function(data){

  }



  /**
   * 把毫秒转换为 xx小时xx分钟xx秒的通用方法
   * @param msd
   * @returns {number}
   * @constructor
   */
  $scope.MillisecondToDate = function (msd) {
    var ss = 1000;
    var mi = ss * 60;
    var hh = mi * 60;
    var dd = hh * 24;
    var day = parseInt(msd / dd);
    var hour = parseInt((msd - day * dd) / hh) + day * 24;
    var hour2 = parseInt((msd - day * dd) / hh);
    var minute = parseInt((msd - day * dd - hour2 * hh) / mi);
    var second = parseInt((msd - day * dd - hour2 * hh - minute * mi) / ss);
    var strHour = hour;
    var strMinute = minute < 10 ? '0' + minute : minute;
    var strSecond = second < 10 ? '0' + second : second;
    return "剩余" + strHour + "小时" + strMinute + "分钟" + strSecond + "秒";
  };

  /**
   * 加载更多
   */
  $scope.loadMoreData = function () {
    getOrderListFunc();
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
   * 订单详细信息
   * @param tid
   */
  $scope.orderDetail = function (tid) {
    $state.go("orderDetail", {tid: tid});
  };

  /**
   * 购物车订单列表切换
   */
  $scope.goCart = function () {
    console.log(["goCart userid", $rootScope.USERINFO.id]);
    console.log(["goCart brandid", $rootScope.BRANDID]);
    $state.go("cart", {"userid": $rootScope.USERINFO.id, "brandid": $rootScope.BRANDID});
  };



  $scope.choose = false;
  $log.debug(['choooose', $scope.choose])

}]);
