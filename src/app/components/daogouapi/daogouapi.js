'use strict';

angular.module('daogou')
  .factory('daogouAPI', function ($rootScope, $http, $log, URLPort) {
    // 正式接口

    var ROOT_URL = 'http://yunwan2.3322.org:57099';

    ROOT_URL = URLPort();
    // 测试接口
    // ROOT_URL='';

    var daogouAPI = {
      /*
       通用url拼接方法
       apiurl(action,data)
       */
      apiurl: apiurl,

      /*
       通用get方法
       get(url,scallback,ecallback)
       */
      get: get,

      /*
       通用post方法
       post(url,scallback,ecallback)
       */
      post: post,
      /*
       通用patch方法
       patch(url,scallback,ecallback)
       */
      patch: patch,
      /*
       通用delete方法
       delete(url,scallback,ecallback)
       */
      deletef: deletef,
      /*
       通用put方法
       put(url,scallback,ecallback)
       */
      put: put,
      /*
       /*
       查询消费者的订单列表
       getOrderList(actionurl,dataobj,scallback,ecallback)
       actionurl 接口
       dataobj(接口数据)  {object}   [必填]
       scallback 成功的回调函数 {function} [必填]
       ecallback 失败的回调函数 {function} [必填]
       */
      getOrderList: getOrderList,

      /*
       daogouProductList(actionurl,dataobj,scallback,ecallback)
       */
      daogouProductList: daogouProductList,

      /*
       hopAddress(actionurl,dataobj,scallback,ecallback)
       */
      shopAddress: shopAddress,

      /*
       提交退货信息
       submitRefundInfo(actionurl,dataobj,scallback,ecallback)
       actionurl 接口
       dataobj(接口数据)  {object}   [必填]
       scallback 成功的回调函数 {function} [必填]
       ecallback 失败的回调函数 {function} [必填]
       */
      submitRefundInfo: submitRefundInfo,

      // /accounts/current 类似于这种请求地址，没有？。。。后面的参数也不带 {}
      // getshortUrl(url,callback,callbackerror)
      getshortUrl: getshortUrl,

      /*
       登录接口
       login(dataobj,password,callback)
       dataobj(接口数据)  {object}   [必填]
       username(账号)	{string}
       password(验证码)	{string}
       scallback 成功的回调函数 {function} [必填]
       ecallback 失败的回调函数 {function} [必填]
       */
      login: login,
      /*
       获取购物车商品列表接口
       scallback 成功的回调函数 {function} [必填]
       ecallback 失败的回调函数 {function} [必填]
       */
      shopcart: shopcart,
      /*
       批量删除购物车商品
       scallback 成功的回调函数 {function} [必填]
       ecallback 失败的回调函数 {function} [必填]
       */
      deleteCartProduct: deleteCartProduct,
      /**
       * 更新购物车商品
       */
      updateCartProduct: updateCartProduct,

      /*
       account注册用户
       */
      register: register,

      /*
       account添加用户info
       */
      registerInfo: registerInfo,

      /*
       检测用户是否存在
       */
      isRegistered: isRegistered,

      /*
       检测用户是否登录  返回user信息
       */
      isLogin: isLogin,

      /*
       检测用户是否登录  返回account信息
       */
      isAccountLogin: isAccountLogin,

      /*
       设置默认取货门店
       */
      defaultstore: defaultstore,
      /*
       获取用户取货可选时间范围
       */
      fetchTime: fetchTime,
      /*
       user获取用户信息
       */
      getUserInfo: getUserInfo,

      /*
       user添加用户信息
       */
      setUserInfo: setUserInfo,

      /*
       退出登录
       */
      logout: logout,
      /*
       查询省
       */
      searchProvinces: searchProvinces,
      /*
       根据选择的省查询市
       */
      provinceSelect: provinceSelect,
      /*
       根据选择的市查询地区
       */
      citySelect: citySelect,
      /*
       添加地址
       */
      addAddress: addAddress,


      /*
       获取微信ticket
       */
      WXgetTicket: WXgetTicket,

      /*
       获取微信授权地址
       */

      WXgetAuthurl: WXgetAuthurl,

      /*
       根据品牌id获取公众号信息
       */
      WXgetAppid: WXgetAppid,

      /*
       设置默认收货地址
       */
      defaultAddress: defaultAddress,


      /*支付接口*/
      tradesPay: tradesPay,
      /*
       删除收货地址
       */
      deleteAddress: deleteAddress,
      /*
       获取收货地址
       */
      getAddress: getAddress,
      /*
       修改收货地址
       */
      editAddress: editAddress,
      /*
       获取验证码
       */
      verificationcode: verificationcode,

      /*
       根据地区代码查询下属地区
       */
      codegetarea: codegetarea,


      /*
       取openid
       */
      getOpenid: getOpenid,

      /*
       绑定用户的openid
       */
      bindOpenid: bindOpenid,

      /*获取导购详情*/
      getGuidInfo: getGuidInfo,

      /*获取物流信息*/
      logistics: logistics,

      /*上传文件*/
      uploadfile: uploadfile,

      /*根据地区获得门店*/
      storeAddress: storeAddress,

      /*根据经纬度获得所有的门店*/
      shopAddressAll: shopAddressAll,

      /*根据id获取门店*/
      shopAddressId: shopAddressId,
      /*产品规格格式化*/
      formatSku: formatSku,
      /*产品规格格式化*/
      formatSkuP: formatSkuP,
      /**
       * 品牌信息
       */
      getBrandInfo: getBrandInfo,
      /**
       * 是否支持门店取货和门店退货
       */
      checkServices: checkServices,
      /**
       *取消订单
       */
      cancelOrder: cancelOrder,

      /*
       取门店信息
       */
      getStoreInfo: getStoreInfo,

    };

    return daogouAPI;

    function apiurl(action, data) {

      var url = ROOT_URL + action;

      if (typeof data === 'object') {
        url += '?';
        for (var key in data) {
          url += key + '=' + data[key] + '&';
        }
        url = url.slice(0, url.length - 1);
      }
      // console.log(["apiurl",url]);
      return url;
    }

    function get(url, scallback, ecallback) {
      $http.get(url)
        .success(function (data, status, headers, config) {
          scallback(data, status, headers, config);
        })
        .error(function (data, status, headers, config) {
          if (ecallback) {
            ecallback(data, status, headers, config);
          }
        });
    }

    function post(action, data, scallback, ecallback) {
      var url = ROOT_URL + action;
      $http.post(url, data)
        .success(function (data, status, headers, config) {
          scallback(data, status, headers, config);
        })
        .error(function (data, status, headers, config) {
          ecallback(data, status, headers, config);
        });
    }

    function put(action, data, scallback, ecallback) {
      var url = ROOT_URL + action;
      $http.put(url, data)
        .success(function (data, status, headers, config) {
          scallback(data, status, headers, config);
        })
        .error(function (data, status, headers, config) {
          ecallback(data, status, headers, config);
        });
    }

    function deletef(url, scallback, ecallback) {
      $http.delete(url)
        .success(function (data, status, headers, config) {
          scallback(data, status, headers, config);
        })
        .error(function (data, status, headers, config) {
          ecallback(data, status, headers, config);
        });
    }


    function patch(action, data, scallback, ecallback) {
      var url = ROOT_URL + action;
      $http.patch(url, data)
        .success(function (data, status, headers, config) {
          scallback(data, status, headers, config);
        })
        .error(function (data, status, headers, config) {
          ecallback(data, status, headers, config);
        });
    }

    function getOrderList(actionurl, dataobj, scallback, ecallback) {
      var action = actionurl;
      var data = {
        page: typeof dataobj.page === 'number' ? dataobj.page : 1,
        per_page: typeof dataobj.per_page === 'number' ? dataobj.per_page : 5,
        show_orders: typeof dataobj.show_orders === 'boolean' ? dataobj.show_orders : false
      };

      daogouAPI.get(daogouAPI.apiurl(action, data), scallback, ecallback);
    }


    function daogouProductList(actionurl, dataobj, scallback, ecallback) {
      var action = actionurl;
      var data = {
        guiderId: dataobj.guiderId,
        brandId: dataobj.brandId,
        page: typeof dataobj.page === 'number' ? dataobj.page : 1,
        per_page: typeof dataobj.per_page === 'number' ? dataobj.per_page : 5
      };

      daogouAPI.get(daogouAPI.apiurl(action, data), scallback, ecallback);
    }

    function shopAddress(actionurl, dataobj, scallback, ecallback) {
      var action = actionurl;
      var data = {
        user_id: dataobj.user_id,
        longitude: dataobj.longitude,
        latitude: dataobj.latitude,
        page: typeof dataobj.page === 'number' ? dataobj.page : 1,
        per_page: typeof dataobj.per_page === 'number' ? dataobj.per_page : 5
      };

      daogouAPI.get(daogouAPI.apiurl(action, data), scallback, ecallback);
    }

    function shopAddressAll(actionurl, dataobj, scallback, ecallback) {
      var action = actionurl;
      var data = {
        user_id: dataobj.user_id,
        longitude: dataobj.longitude,
        latitude: dataobj.latitude,
        // page: typeof dataobj.page === 'number' ? dataobj.page : 1,
        // per_page: typeof dataobj.per_page === 'number' ? dataobj.per_page : 5
      };

      daogouAPI.get(daogouAPI.apiurl(action, data), scallback, ecallback);
    }

    function shopAddressId(actionurl, dataobj, scallback, ecallback) {
      var action = actionurl;
      var data = {
        user_id: dataobj.user_id,
        // page: typeof dataobj.page === 'number' ? dataobj.page : 1,
        // per_page: typeof dataobj.per_page === 'number' ? dataobj.per_page : 5
      };

      daogouAPI.get(daogouAPI.apiurl(action, data), scallback, ecallback);
    }

    function storeAddress(actionurl, dataobj, scallback, ecallback) {
      var action = actionurl;
      var data = {
        user_id: dataobj.user_id,
        state_code: dataobj.state_code,
        city_code: dataobj.city_code,
        district_code: dataobj.district_code,
        page: typeof dataobj.page === 'number' ? dataobj.page : 1,
        per_page: typeof dataobj.per_page === 'number' ? dataobj.per_page : 5
      };

      daogouAPI.get(daogouAPI.apiurl(action, data), scallback, ecallback);
    }


    function submitRefundInfo(actionurl, dataobj, scallback, ecallback) {
      var action = actionurl;
      var data = {
        page: typeof dataobj.page === 'number' ? dataobj.page : 1,
        per_page: typeof dataobj.per_page === 'number' ? dataobj.per_page : 5,
        show_orders: typeof dataobj.show_orders === 'boolean' ? dataobj.show_orders : false
      };

      daogouAPI.post(daogouAPI.apiurl(action, data), scallback, ecallback);
    }


    function getshortUrl(url, callback, callbackerror) {
      $http.get(url)
        .success(function (data) {
          callback(data);
        })
        .error(function (data) {
          callbackerror(data);
        })
    }


    function login(dataobj, scallback, ecallback) {

      if (!angular.isString(dataobj.username) || !angular.isString(dataobj.password)) {
        ecallback('daogouAPI.login传入参数错误 username,password');
        return;
      }
      var action = '/brand-login';
      var data = {
        username: dataobj.username,
        password: dataobj.password,
      };

      daogouAPI.get(daogouAPI.apiurl(action, data), scallback, ecallback);
    }


    function shopcart(dataobj, scallback, ecallback) {

      var action = '/users/' + dataobj.userid + '/shopping-carts';
      var data = {
        brand_id: dataobj.brand_id,
        page: typeof dataobj.page === 'number' ? dataobj.page : 1,
        per_page: typeof dataobj.per_page === 'number' ? dataobj.per_page : 5
      };

      daogouAPI.get(daogouAPI.apiurl(action, data), scallback, ecallback);
    }


    function register(username, scallback, ecallback) {
      var action = '/accounts/register';
      var data = {
        username: username,
        password: 'admin',
        enabled: true,
      };

      daogouAPI.post(action, data, scallback, ecallback);
    }

    function registerInfo(dataobj, scallback, ecallback) {
      var action = '/accounts/register/info';
      var data = {
        username: dataobj.username,
        mobile: dataobj.username,
      };
      daogouAPI.post(action, data, scallback, ecallback);
    }

    function isRegistered(username, scallback, ecallback) {
      if (!angular.isString(username) && !angular.isNumber(username)) {
        ecallback('daogouAPI.isRegistered传入的username不是字符串');
        return;
      }
      var action = '/accounts/exists';
      var data = {
        username: username
      };
      daogouAPI.get(daogouAPI.apiurl(action, data), scallback, ecallback);
    }


    function isLogin(scallback, ecallback) {
      var action = '/accounts/current';
      var data = '';
      daogouAPI.get(daogouAPI.apiurl(action, data), function (data) {
        data.username = data.mobile;
        daogouAPI.getUserInfo(data, scallback, ecallback)
      }, ecallback);
    }

    function isAccountLogin(scallback, ecallback) {
      var action = '/accounts/current';
      var data = '';

      daogouAPI.get(daogouAPI.apiurl(action, data), scallback, ecallback);
    }

    function deleteCartProduct(dataobj, scallback, ecallback) {

      var action = '/users/' + dataobj.userid + '/shopping-carts';
      var data = {
        ids: dataobj.ids
      };

      daogouAPI.deletef(daogouAPI.apiurl(action, data), scallback, ecallback);
    }

    function updateCartProduct(dataobj, scallback, ecallback) {
      var action = '/users/' + dataobj.userid + '/shopping-carts/' + dataobj.cartId;
      var data = {
        "id": dataobj.cartId,
        "num": dataobj.num,
        "user_id": dataobj.userid
      };
      daogouAPI.put(action, data, scallback, ecallback);

    }

    function defaultstore(dataobj, scallback, ecallback) {

      var action = '/brands/' + dataobj.brand_id + '/users/' + dataobj.user_id + '/stores/' + dataobj.store_id + '/store-fetch/default';
      var data = '';

      daogouAPI.patch(action, data, scallback, ecallback);
    }

    function fetchTime(dataobj, scallback, ecallback) {

      var action = '/brands/' + dataobj.brand_id + '/users/' + dataobj.user_id + '/stores/' + dataobj.store_id + '/store-fetch/time-range';
      var data = {
        tid: dataobj.store_id
      };

      daogouAPI.get(daogouAPI.apiurl(action, data), scallback, ecallback);
    }


    function getUserInfo(dataobj, scallback, ecallback) {
      var action = '/users/mobiles/' + dataobj.username;
      var data = '';
      daogouAPI.get(daogouAPI.apiurl(action, data), function (data) {
        window.sessionStorage.setItem("USERINFO", JSON.stringify(data));
        if (scallback) {
          scallback(data);
        }
      }, ecallback);
    }

    function setUserInfo(dataobj, scallback, ecallback) {
      var action = '/users';
      var data = {
        username: dataobj.username,
        mobile: dataobj.username,
        accountId: dataobj.accountId,
      };

      daogouAPI.post(action, data, scallback, ecallback);

    }

    function logout(scallback, ecallback) {
      var action = '/logout';
      var data = '';
      daogouAPI.get(daogouAPI.apiurl(action, data), scallback, ecallback);
    }


    function searchProvinces(dataobj, scallback, ecallback) {
      var action = '/provinces';
      var data = '';
      daogouAPI.get(daogouAPI.apiurl(action, data), scallback, ecallback);

    }


    function checkServices(scallback, ecallback) {
      var action = "/brands/" + $rootScope.BRANDID + "/check-services";
      var data = '';
      daogouAPI.get(daogouAPI.apiurl(action, data), scallback, ecallback);
    }


    function provinceSelect(dataobj, scallback, ecallback) {
      var action = "/provinces/" + dataobj.pinyin + "/cities";
      var data = '';

      daogouAPI.get(daogouAPI.apiurl(action, data), scallback, ecallback);

    }

    function citySelect(dataobj, scallback, ecallback) {
      var action = "/provinces/" + dataobj.pinyin1 + "/cities/" + dataobj.pinyin2 + "/districts";
      var data = '';

      daogouAPI.get(daogouAPI.apiurl(action, data), scallback, ecallback);

    }

    function addAddress(dataobj, scallback, ecallback) {
      var action = "/users/" + dataobj.user_id + "/shipping-addresses";
      var data = {
        user_id: dataobj.user_id,
        name: dataobj.name,
        state: dataobj.state,
        state_code: dataobj.state_code,
        city: dataobj.city,
        city_code: dataobj.city_code,
        district: dataobj.district,
        district_code: dataobj.district_code,
        address: dataobj.address,
        zip: dataobj.zip,
        mobile: dataobj.mobile,
        is_default: dataobj.is_default
      };

      daogouAPI.post(action, data, scallback, ecallback);

    }

    function WXgetTicket(brand_id, scallback, ecallback) {
      var action = '/weixin/jsapi-ticket';
      var data = {
        brand_id: brand_id
      };
      daogouAPI.get(daogouAPI.apiurl(action, data), scallback, ecallback);
    }

    function WXgetAuthurl(dataobj, scallback, ecallback) {
      var action = '/weixin/auth/url';
      var data = {
        brand_id: dataobj.brand_id,
        redirect_uri: dataobj.redirect_uri
      };
      daogouAPI.post(action, data, scallback, ecallback);
    }


    function WXgetAppid(brand_id, scallback, ecallback) {
      var action = '/weixin/accounts/brands/' + brand_id;
      var data = "";
      daogouAPI.get(daogouAPI.apiurl(action, data), function (wxdata) {
        $rootScope.WXINFO = {
          appid: wxdata.appid,
          js_api_ticket: wxdata.js_api_ticket,
          mch_key: wxdata.mch_key,
          secret: wxdata.secret
        }
        scallback(wxdata)
      }, ecallback);
    }

    function defaultAddress(dataobj, scallback, ecallback) {

      var action = '/users/' + dataobj.user_id + '/shipping-addresses/' + dataobj.address_id + '/default';
      var data = '';

      daogouAPI.patch(action, data, scallback, ecallback);
    }

    function tradesPay(dataobj, scallback, ecallback) {
      var action = '/trades/' + dataobj.tid + '/buyer-pay';
      var data = {
        tid: dataobj.tid,
        pay_type: dataobj.pay_type
      };
      daogouAPI.patch(action, data, scallback, ecallback);
    }


    function deleteAddress(dataobj, scallback, ecallback) {
      var action = '/users/' + dataobj.user_id + '/shipping-addresses/' + dataobj.address_id;
      var data = '';
      daogouAPI.deletef(daogouAPI.apiurl(action, data), scallback, ecallback);
    }

    function getAddress(dataobj, scallback, ecallback) {
      var action = '/users/' + dataobj.user_id + '/shipping-addresses/' + dataobj.address_id;
      var data = '';
      daogouAPI.get(daogouAPI.apiurl(action, data), scallback, ecallback);
    }

    function editAddress(dataobj, scallback, ecallback) {
      var action = '/users/' + dataobj.user_id + '/shipping-addresses/' + dataobj.id;
      var data = {
        id: dataobj.address_id,
        user_id: dataobj.user_id,
        name: dataobj.name,
        state: dataobj.state,
        state_code: dataobj.state_code,
        city: dataobj.city,
        city_code: dataobj.city_code,
        district: dataobj.district,
        district_code: dataobj.district_code,
        address: dataobj.address,
        zip: dataobj.zip,
        mobile: dataobj.mobile,
        is_default: dataobj.is_default
      };
      daogouAPI.put(action, data, scallback, ecallback);
    }


    function verificationcode(dataobj, scallback, ecallback) {
      var action = '/accounts/verification-code';
      var data = {
        codeType: dataobj.codeTypes,
        account: dataobj.account,
        template: dataobj.template
      };
      daogouAPI.post(daogouAPI.apiurl(action, data), '', scallback, ecallback);
    }


    function codegetarea(dataobj, scallback, ecallback) {
      var action = '/area-code/' + dataobj.areacode + '/children';
      var data = '';
      daogouAPI.get(daogouAPI.apiurl(action, data), scallback, ecallback);
    }

    function getOpenid(dataobj, scallback, ecallback) {
      var action = '/weixin/page-access-token';
      var data = {
        code: dataobj.code,
        brand_id: dataobj.brand_id,
      };
      daogouAPI.get(daogouAPI.apiurl(action, data), scallback, ecallback);
    }

    function bindOpenid(dataobj, scallback, ecallback) {
      var action = '/users/bind/weixin';
      var data = {
        brand_id: dataobj.brand_id,
        user_id: dataobj.user_id,
        wx_open_id: dataobj.wx_open_id
      };
      daogouAPI.post(action, data, scallback, ecallback);
    }

    function getBrandInfo(scallback, ecallback) {
      var action = "/brands/" + $rootScope.BRANDID;
      var data = '';
      daogouAPI.get(daogouAPI.apiurl(action, data), scallback, ecallback);
    }

    function getGuidInfo(scallback, ecallback) {
      var action = "/brands/" + $rootScope.BRANDID + "/guiders/" + $rootScope.GUIDID + "/details";
      var data = '';

      daogouAPI.get(daogouAPI.apiurl(action, data), scallback, ecallback);
    }


    function logistics(dataobj, scallback, ecallback) {
      var action = '/logistics';
      var data = {
        express_company_code: dataobj.express_company,
        express_no: dataobj.express_no
      };
      daogouAPI.get(daogouAPI.apiurl(action, data), scallback, ecallback);
    }


    function uploadfile(dataobj, scallback, ecallback) {
      var action = '/attachments/file/upload';
      var data = {
        zip: typeof dataobj.zip === 'string' ? dataobj.zip : small,
      };
      daogouAPI.post(daogouAPI.apiurl(action, data), scallback, ecallback);
    }


    function formatSku(dataArr) {
      for (var i in dataArr) {
        var skuString = "";
        var skuArr = [];
        skuArr = dataArr[i].sku_properties_name.split(";");
        for (var j in skuArr) {
          var proArr = [];
          proArr = skuArr[j].split(":");
          skuString += proArr[proArr.length - 2] + ":" + proArr[proArr.length - 1] + ";";
        }
        dataArr[i].sku_properties_name = skuString.substring(0, skuString.length - 1);

      }
    }

    function formatSkuP(dataArr) {
      for (var i in dataArr) {
        var skuString = "";
        console.log(["dataArr[i].properties", dataArr[i].properties]);
        var skuArr = [];
        skuArr = dataArr[i].properties.split(";");
        for (var j in skuArr) {
          var proArr = [];
          proArr = skuArr[j].split(":");
          skuString += proArr[proArr.length - 2] + ":" + proArr[proArr.length - 1] + ";";
        }
        dataArr[i].properties = skuString.substring(0, skuString.length - 1);

      }
    }

    function cancelOrder(dataobj, scallback, ecallback) {

      var action = '/trades/' + dataobj.tid + '/cancel-by-buyer';
      var data = '';

      daogouAPI.patch(action, data, scallback, ecallback);
    }


    function getStoreInfo(storeid, scallback, ecallback) {
      var action = '/brands/' + $rootScope.BRANDID + '/store-details/' + storeid;
      var data = '';
      daogouAPI.get(daogouAPI.apiurl(action, data), scallback, ecallback);
    }

  });































