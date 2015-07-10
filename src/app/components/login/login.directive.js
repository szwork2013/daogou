'use strict';

angular.module('daogou')
  .directive('login', function ($rootScope, $parse, daogouAPI, $http) {
    return {
      templateUrl: 'app/components/login/login.html',
      link: function ($scope, iElm, iAttrs, controller) {
        $scope.logindate = {
          username: '',
          password: ''
        };
        /*//关闭登录框
        $scope.loginClose = function () {
          //商品详情 需要关闭登陆框  这个跟显示关闭按钮及关闭登陆框有关
          $scope.login = false;
          $(".mengban").hide();
          if (typeof($scope.timer) === "number") {
            clearInterval($scope.timer);
          }
        };*/


        function getverificationcode(telenum) {
          var templatetext = encodeURIComponent("lily商务女装：验证码：%s,请勿将验证码透露给任何人");
          daogouAPI.verificationcode({
            codeTypes: "MOBILE",
            account: telenum,
            template: templatetext
          }, function (data, status, headers, config) {
            console.log(["获取验证码成功", data]);
          }, function (data, status, headers, config) {
            console.log(["获取验证码失败", data]);
          });

        }

        //获取验证码
        $scope.verify = function () {

          $(".yanzhengma").addClass("clickdown").attr({"disabled": "disabled"}).text("重新获取验证码(60s)");
          var remainTime = 60;
          $scope.timer = setInterval(function () {
            remainTime--;
            console.log(["$scope.timer", $scope.timer]);
            $(".yanzhengma").addClass("clickdown").attr({"disabled": "disabled"}).text("重新获取验证码(" + remainTime + "s)");
            if (remainTime <= 0) {
              clearInterval($scope.timer);
              $(".yanzhengma").removeClass("clickdown").text("获取验证码").removeAttr("disabled");
            }
          }, 1000);
          //判断是否注册用户  非注册用户需帮用户注册
          daogouAPI.isRegistered($scope.logindate.username, function (data) {
          }, function (data) {
            //注册account
            daogouAPI.register($scope.logindate.username, function (data) {
            }, function (data) {
            });
            //注册accountinfo
            daogouAPI.registerInfo($scope.logindate, function (data) {
            }, function (data) {
            });
          });
          //通过手机号码获取验证码
          getverificationcode($scope.logindate.username);
        };


        /**
         * 登录
         */
        $scope.submit = function () {
          daogouAPI.login($scope.logindate, function (data) {
            daogouAPI.isAccountLogin(function (accountdata) {
              // 获取用户信息
              daogouAPI.getUserInfo({username: $scope.logindate.username}, function (userinfo) {
                successcallback(userinfo)
              }, function (data) {
                daogouAPI.setUserInfo(accountdata, function (userinfo) {
                  successcallback(userinfo)
                }, function (data) {
                  errorcallback(data)
                })
              })
            }, function (data) {
              errorcallback(data)
            })
          }, function (data) {
            errorcallback(data)
          })
        };
        /**
         * 成功调用函数
         * @param data
         */
        function successcallback(data) {
          var getter = $parse(iAttrs.loginsuccess);
          var loginsuccess = getter($scope);
          loginsuccess(data);
        }

        /**
         * 失败调用函数
         * @param data
         */
        function errorcallback(data) {
          var getter = $parse(iAttrs.loginerror)
          var loginerror = getter($scope);
          loginerror(data);
        }
      }
    };
  })
/**
 *过滤器 显示html字符串成html
 */
  .filter('to_trusted', ['$sce', function ($sce) {
    return function (text) {
      if (text != undefined) {
        text = text.replace("undefined", "");
        return $sce.trustAsHtml(text);
      }
      else {
        return "";
      }
    };
  }]);













