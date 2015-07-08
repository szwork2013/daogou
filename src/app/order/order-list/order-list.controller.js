'use strict';

var order = angular.module('orderList', ['ionic']);
order.controller('orderListCtrl', ['$scope', '$log', '$http', 'URLPort', 'daogouAPI', '$state', '$stateParams', '$rootScope', function ($scope, $log, $http, URLPort, daogouAPI, $state, $stateParams, $rootScope) {

  if ($rootScope.USERINFO == null) {
    daogouAPI.isLogin(function (data) {
      $rootScope.USERINFO = data;
      getOrderListFunc();
    }, function (data) {
      //如果未检测到用户信息，则显示登录界面
      $scope.login = true;
    });
  }
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
      $rootScope.BRANDID = data[0].brand_id;
      angular.forEach(data, function (item, index) {
        switch (item.status) {
          case "WAIT_BUYER_PAY":
            var created_at = new Date(item.created_at);
            var newDate = new Date(created_at.setDate(created_at.getDate() + 3));
            item.leftTime = $scope.MillisecondToDate(newDate.getTime() - new Date().getTime());
            item.statusCN = "待付款";
            break;
          case 'SELLER_CONSIGNED_PART':
            item.statusCN = "卖家部分发货";
            break;
          case 'WAIT_SELLER_SEND_GOODS':
            item.statusCN = '待发货';
            break;
          case 'WAIT_BUYER_CONFIRM_GOODS':
            item.statusCN = '待确认收货';
            break;
          case 'WAIT_BUYER_FETCH_GOODS':
            item.leftTime = $scope.MillisecondToDate(new Date(item.fetch_subscribe_begin_time).getTime() - new Date().getTime());
            if (item.leftTime.indexOf("-") > 0) {
              item.leftTime = "剩余0时0分0秒";
            }
            item.statusCN = '待取货';
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
        angular.forEach(item.orders, function (itemOrder, index) {
          itemOrder.pics = itemOrder.pic_path.indexOf(",") > 0 ? itemOrder.pic_path.split(",") : [itemOrder.pic_path];
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

  $scope.loginsuccess = function (data) {
    console.log(["order的回调", data]);
    $scope.login = false;
    $(".redPoint").show();
    //获取订单信息
    getOrderListFunc();
  }
  $scope.loginerror = function (data) {

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
   * 时间-添加
   * @param interval
   * @param number
   * @returns {Date}
   */
  Date.prototype.add = function (interval, number) {
    /*
     *   功能:实现VBScript的DateAdd功能.
     *   参数:interval,字符串表达式，表示要添加的时间间隔.
     *   参数:number,数值表达式，表示要添加的时间间隔的个数.
     *   参数:date,时间对象.
     *   返回:新的时间对象.
     *   var   now   =   new   Date();
     *   var   newDate   =   DateAdd("d",5,now);
     *---------------   DateAdd(interval,number,date)   -----------------
     */
    switch (interval) {
      case "y"   :
      {
        this.setFullYear(this.getFullYear() + number);

        break;
      }
      case "q"   :
      {
        this.setMonth(this.getMonth() + number * 3);

        break;
      }
      case "m"   :
      {
        this.setMonth(this.getMonth() + number);

        break;
      }
      case "w"   :
      {
        this.setDate(this.getDate() + number * 7);

        break;
      }
      case "d"   :
      {
        this.setDate(this.getDate() + number);

        break;
      }
      case "h"   :
      {
        this.setHours(this.getHours() + number);

        break;
      }
      case "M"   :
      {
        this.setMinutes(date.getMinutes() + number);

        break;
      }
      case "s"   :
      {
        this.setSeconds(date.getSeconds() + number);

        break;
      }
      default   :
      {
        this.setDate(d.getDate() + number);
        break;
      }
    }
    return this;
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
    $state.go("cart", {"userid": $rootScope.USERINFO.id, "brandid": $rootScope.BRANDID});
  };

}]);
