'use strict';

angular.module('daogou')
  .directive('login', function ($rootScope, $parse, daogouAPI, $http, $ionicPopup) {
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
          var templatetext = encodeURIComponent($rootScope.BRANDINFO.brand_name + "：验证码：%s,请勿将验证码透露给任何人");
          daogouAPI.verificationcode({
            codeTypes: "MOBILE",
            account: telenum,
            template: templatetext
          }, function (data, status, headers, config) {
          }, function (data, status, headers, config) {
            var alertPopup = $ionicPopup.alert({
              title: '友情提示',
              template: '获取验证码太过频繁，请10分钟后再试',
              cssClass: 'alerttextcenter',
              okText: '确定',
              okType: 'button-energized'
            });
            alertPopup.then(function (res) {
              console.log('Thank you for not eating my delicious ice cream cone');
            });
          });
        }

        //获取验证码
        $scope.verify = function () {
          $(".yanzhengma").addClass("clickdown").removeClass("yanzhengmared").attr({"disabled": "disabled"}).text("重新获取验证码(60s)");
          var remainTime = 60;
          $scope.timer = setInterval(function () {
            remainTime--;
            $(".yanzhengma").text("重新获取验证码(" + remainTime + "s)");
            if (remainTime <= 0) {
              clearInterval($scope.timer);
              $(".yanzhengma").removeClass("clickdown").addClass("yanzhengmared").text("获取验证码").removeAttr("disabled");
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
         //防止重复加载，先声明点击数为1
        var clicknum=1;
        $scope.submit = function () {
          debugger;
          clicknum++;
          //第一次点击后，clicknum=2，执行else后面的数据加载，第二次点击登录clicknum=3，弹窗提示
          if(clicknum>2){
            var alertPopup = $ionicPopup.alert({
              title: '友情提示',
              template: '您的网速太慢了，数据正在加载中，请不要重复点击登录',
              cssClass: 'alerttextcenter',
              okText: '确定',
              okType: 'button-energized'
            });
            alertPopup.then(function(res) {
              console.log('Thank you for not eating my delicious ice cream cone');
            });
          }else{
          daogouAPI.login($scope.logindate, function (data) {
            daogouAPI.isAccountLogin(function (accountdata) {
              // 获取用户信息
              daogouAPI.getUserInfo({username: $scope.logindate.username}, function (userinfo) {
                window.sessionStorage.setItem("USERINFO", JSON.stringify(userinfo));
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
          })}
        };
        /**
         * 成功调用函数
         * @param data
         */
        function successcallback(data) {
          var getter = $parse(iAttrs.loginsuccess);
          var loginsuccess = getter($scope);
          loginsuccess(data);
          //关闭登录及蒙板
          $scope.login = false;
          $(".mengban").hide();
          //登录成功回调之后，检测用户是否登录，如果登录了购物车中有物品，显示小红点，没有物品不显示小红点
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
        }

        /**
         * 失败调用函数
         * @param data
         */
        function errorcallback(data) {
          var getter = $parse(iAttrs.loginerror)
          var loginerror = getter($scope);
          loginerror(data);
          console.log(data);
          //如果登录失败则显示失败
          var alertPopup = $ionicPopup.alert({
            title: '友情提示',
            template: '请核对您输入的验证码是否有误，或重新获取验证码',
            cssClass: 'alerttextcenter',
            okText: '确定',
            okType: 'button-energized'
          });
          alertPopup.then(function(res) {
            console.log('Thank you for not eating my delicious ice cream cone');
          });
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













