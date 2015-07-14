'use strict';
angular.module('daogou')
  .directive('floatCenter', function ($rootScope, daogouAPI, $stateParams) {
    return {
      templateUrl: 'app/components/floatCenter/floatCenter.html',
      link: function ($scope, iElm, iAttrs, controller) {
        //默认情况下个人中心小红点是没显示的
        $(".redPoint").hide();
        $(".redPointCart").hide();
        //检测用户是否登录，如果登录了购物车中有物品，显示小红点，没有物品不显示小红点
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
          }, function(data, status, headers, config) {
            if(data.length>0){
              $('.redPoint').show()
            }
          }, function(data, status, headers, config) {});
        }, function () {});
        //点击导购头像出现个人中心，导购橱窗，购物车，以及关闭
        $scope.showmenu = function () {
          if (parseInt($(".daogou").css("height")) < 100) {
            $(".daogou").animate({"height": "170"}, 100);
            daogouAPI.isLogin(function() {
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
              }, function(data, status, headers, config) {
                if (data.length > 0) {
                  $('.redPoint').hide();
                  $('.redPointCart').show();
                }
              }, function(data, status, headers, config) {});
            }, function() {});
          } else {
            $(".daogou").animate({"height": "46"}, 100);
            daogouAPI.isLogin(function() {
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
              }, function(data, status, headers, config) {
                if (data.length > 0) {
                  $('.redPoint').show();
                  $('.redPointCart').hide();
                }
              }, function(data, status, headers, config) {});
            }, function() {});
          }
        }
      }
    };
  })
