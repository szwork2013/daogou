'use strict';
angular.module('daogou')
  .directive('floatCenter', function ($rootScope, daogouAPI, $stateParams) {
    return {
      templateUrl: 'app/components/floatCenter/floatCenter.html',
      link: function ($scope, iElm, iAttrs, controller) {
        //默认情况下个人中心小红点是没显示的
        $(".redPoint").hide();
        //检测用户是否登录，如果登录了购物车中有物品，显示小红点，没有物品不显示小红点
        daogouAPI.isLogin(function () {
          $(".redPoint").show();
        }, function () {
          $(".redPoint").hide();

        })
        //点击导购头像出现个人中心，导购橱窗，购物车，以及关闭
        $scope.showmenu = function () {
          daogouAPI.isLogin(function () {
            $(".redPoint").show();
          }, function () {
            $(".redPoint").hide();
          })
          if (parseInt($(".daogou").css("height")) < 100) {
            $(".daogou").animate({"height": "210"}, 100);
          } else {
            $(".daogou").animate({"height": "46"}, 100);
          }
        }
      }
    };
  })
