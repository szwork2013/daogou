'use strict';

angular.module('goodsReturn', ['ionic'])
  .controller('returnApplyCtrl', ['$rootScope', '$scope', '$log', '$http', 'checklocalimg', '$stateParams', 'URLPort', '$state', 'daogouAPI', 'getLocation','$ionicLoading', function ($rootScope, $scope, $log, $http, checklocalimg, $stateParams, URLPort, $state, daogouAPI, getLocation,$ionicLoading) {

    if ($stateParams.oid) {
      $rootScope.refundsOid = $stateParams.oid;
    }
    if ($stateParams.tid) {
      $rootScope.refundsTid = $stateParams.tid;
    }
    var userInfo = window.sessionStorage.getItem("USERINFO");
    if (userInfo == null) {
    }
    else {
      $scope.USERINFO = JSON.parse(userInfo);
      $scope.USERID = $scope.USERINFO.id;
    }


    var URLPort = URLPort();

    $http.get(URLPort+"/trades/"+$rootScope.refundsTid+"/refunds")
    .success(function(data){
    	console.log(["获取可退货商品成功",data]);
    	for(var i in data.details){
    		var picArr = data.details[i].pic_path.split(",");
    		console.log(["picArr",picArr]);
    		data.details[i].pic = picArr[0];
    		data.details[i].seleted = false;
    	}
    	$scope.refundData = data;
      daogouAPI.formatSku($scope.refundData.details);

    })
    .error(function(data){
    	console.log(["获取可退货商品失败",data])
    })

    //快递方式退货和门店退货 模块色显示与隐藏
    $scope.expressway = false;
    $scope.fetchway = true;

    $scope.shippingData = [
      {shipping_typeCN: "请选择退货门店", shippingtype: ""},
      {shipping_typeCN: "门店退货", shippingtype: "STORE"}
      // {shipping_typeCN: "快递", shippingtype: "EXPRESS"},
      // {shipping_typeCN: "直接退款", shippingtype: "IMMEDIATE"}
    ]
    $scope.refundInputInfo = {};
    $scope.refundInputInfo.shipping_type =  $scope.shippingData[0];
    // $scope.refundInputInfo = {
    //   shipping_type: $scope.defaultShipping
    //   // buyer_memo: "",
    //   // prove_images: "http://brand-guide.b0.upaiyun.com/refund-qr-code/1434009839066_495203.jpg"
    // }
    if ($rootScope.selectedStoreId) {//如果是选择门店
      $scope.expressway = false;
      $scope.fetchway = true;
    }
    $scope.refundInputInfo.shipping_type.shippingtype = "STORE";
    $scope.selectRefundway = function () {
      console.log(["$scope.refundInputInfo.shipping_type", $scope.refundInputInfo.shipping_type]);
      if ($scope.refundInputInfo.shipping_type.shippingtype === "STORE") {
        $scope.expressway = false;
        $scope.fetchway = true;
        if ($rootScope.selectedStoreId) {//如果是选择门店地址
          ;
        } else {
          $rootScope.ListTwoStores = [];
          // var x=document.getElementById("demo");
          getLocation(function (lng, lat) {
            daogouAPI.shopAddressAll('/brands/' + $rootScope.BRANDID + '/stores/store-fetch', {
              user_id: $scope.USERID,
              longitude: lng,
              latitude: lat
            }, function (data, status, headers, config) {
              console.log(['查询门店列表成功', data]);
              getTwoStore(data);
            }, function (data, status, headers, config) {
              console.log(['查询门店列表失败', data]);
            });
          }, function () {
            daogouAPI.shopAddressId('/brands/' + $rootScope.BRANDID + '/stores/store-fetch', {
              user_id: $scope.USERID
            }, function (data, status, headers, config) {
              console.log(['查询门店列表成功', data]);
              getTwoStore(data);
            }, function (data, status, headers, config) {
              console.log(['查询门店列表失败', data]);
            });
          });
        }//if($rootScope.selectedAddressId)

      } else if ($scope.refundInputInfo.shipping_type.shippingtype === "EXPRESS") {
        $scope.expressway = true;
        $scope.fetchway = false;
      } else {
        $scope.expressway = true;
        $scope.fetchway = false;
      }
    }

    $scope.selectRefundway();
    function getTwoStore(data) {
      $scope.shopaddressData = data;
      var flag = false;
      var defaultIndex = 0;
      for (var i in $scope.shopaddressData) {
        if ($scope.shopaddressData[i].is_default === 1) {
          flag = true;//如果有默认地址 flag为true
          defaultIndex = i;
        }
      }
      if (flag === true) {//有默认地址
        console.log('有默认地址');
        $rootScope.minDistance = $scope.shopaddressData[defaultIndex];
        console.log(["$rootScope.minDistance", $rootScope.minDistance]);
        $rootScope.ListTwoStores[0] = $rootScope.minDistance;
        $scope.shopaddressData.splice(defaultIndex, 1);
        var minIndex = 0;
        for (var i = 0; i < $scope.shopaddressData.length - 1; i++) {
          if (parseFloat($scope.shopaddressData[i + 1].distance) > parseFloat($scope.shopaddressData[i].distance)) {
            minIndex = i + 1;
          }
        }
        $rootScope.ListTwoStores[1] = $scope.shopaddressData[minIndex];
      } else {//没有默认地址
        console.log('无有默认地址');
        var minIndex = 0;
        for (var i = 0; i < data.length - 1; i++) {
          if (parseFloat(data[i + 1].distance) > parseFloat(data[i].distance)) {
            minIndex = i + 1;
          }
        }
        $rootScope.minDistance = data[minIndex];
        $rootScope.ListTwoStores[0] = $rootScope.minDistance;
        $scope.shopaddressData.splice(minIndex, 1);
        var minIndex = 0;
        for (var i = 0; i < $scope.shopaddressData.length - 1; i++) {
          if (parseFloat($scope.shopaddressData[i + 1].distance) > parseFloat($scope.shopaddressData[i].distance)) {
            minIndex = i + 1;
          }
        }
        $rootScope.ListTwoStores[1] = $scope.shopaddressData[minIndex];
        console.log(["$rootScope.minDistance", $rootScope.minDistance]);
      }

    }

    $scope.goGoodsShop = function () {//门店地址列表页面
      $state.go('goodsShop', {'userid': $scope.USERID, 'refunds': 1});
    }
    //通过点击选中圆圈选中
    $scope.changeCheck = function (index) {
      console.log(["indexindexindex", index])
      if ($scope.refundData.details[index].seleted === true) {
        $scope.refundData.details[index].seleted = false;
      } else {
        $scope.refundData.details[index].seleted = true;
      }
    }

    $scope.submitRefund = function () {
      var detailsData = [];
      var k = 0;
      for (var i in $scope.refundData.details) {
        console.log(["$scope.refundData.details[i].seleted", $scope.refundData.details[i].seleted]);
        if ($scope.refundData.details[i].seleted === true) {
          console.log(["$scope.refundData.details[i].seleted", i]);
          detailsData[k] = {
            "oid": $scope.refundData.details[i].oid,
            "num": $scope.refundData.details[i].item_num
          }
          k++;
        }
      }
      console.log(["detailsData", detailsData]);
      var picUrls = "";
      console.log($("#img1").attr("src"))
      for (var i = 1; i < 4; i++) {
        if ($("#img" + i).attr("src") !== "assets/images/addImg.png") {
          picUrls += $("#img" + i).attr("src") + ",";
        }
      }

      console.log(["picUrls", picUrls]);
      $http.post(URLPort + "/refunds", {
        "tid": $rootScope.refundsTid,
        "shipping_type": $scope.refundInputInfo.shipping_type.shippingtype,
        "buyer_user_id": 4,
        "brand_id": $rootScope.BRANDID,
        "buyer_memo": $scope.refundInputInfo.buyer_memo,
        "details": detailsData,
        "prove_images": "assets/images/addImg.png,assets/images/pic1.png"
      })
        .success(function (data) {
          console.log(["提交退货成功", data]);
          console.log(["退货编号data.id", data.id])
          data.id = "33914552763954000";
          $state.go("returnOrderDetail", {"id": data.id});

        })
        .error(function (data) {
          console.log(["提交退货失败", data])
        })
      // 	var fid="33914552763954000";
      // $state.go("returnOrderDetail",{"id":fid})

    }

    $scope.uploadImg = function (id) {
      checklocalimg(function (data) {
        console.log(["img   data.......:", data]);
        console.log(["img   data.src.......:", data.src]);
        $("#" + id + "").attr("src", data.src);

        daogouAPI.uploadfile({
          zip: "small"
        }, function (data, status, headers, config) {
          console.log(['上传文件成功', data]);
          $scope.uploadfileData = data;
        }, function (data, status, headers, config) {
          console.log(['上传文件失败', data]);
        });
      })

    }

    /**
     * 调用微信内置地图
     */
    $scope.openLocation=function(){
      console.log("获取路线");
      $ionicLoading.show({
        template: '加载中...'
      })
      //获取门店信息  ”获取路线“功能需要门店经纬度
      daogouAPI.getStoreInfo( $rootScope.minDistance.id,function(storedata){
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

  }])


  .controller('returnOrderDetailCtrl', ['$scope', '$log', '$http', 'checklocalimg', '$stateParams', 'URLPort', '$state', function ($scope, $log, $http, checklocalimg, $stateParams, URLPort, $state) {
    //退货编号22514566335310000
    var URLPort = URLPort();
    $scope.fetchAddress = false;//退货地址 门店
    $scope.fetchQRcode = false;//退货二维码 门店
    $scope.expressAddress = false;//退货地址 快递
    $scope.logisticInfo = false;//物流信息 快递
    $scope.fetchSuccess = false;//退货成功模块 门店
    $scope.refundReason = false;//退款原因
    $scope.refundpics = false;//证明图片
    $scope.cancelRefundInputlogis = false;//footer 取消退货 填写物流信息 快递
    $scope.cancelRefund = false;//footer 取消退货
    $scope.changeLogistic = false;//footer 修改物流信息 快递

    console.log(["$stateParams.id", $stateParams.id]);
    $http.get(URLPort + "/refunds/" + $stateParams.id + "?show_orders=true")
      .success(function (data) {
        console.log(["获取订单的退货信息成功", data]);
        for (var i in data.details) {
          var picArr = data.details[i].pic_path.split(",");
          console.log(["picArr", picArr]);
          data.details[i].pic = picArr[0];
        }
        if (data.buyer_memo !== "") {
          $scope.refundReason = true;
        }
        if (typeof(data.prove_images) !== "undefined") {
          $scope.refundpics = true;
          $scope.refundpicUrls = data.prove_images.split(",");
        }

        if (data.status === "WAIT_SELLER_CONFIRM_GOODS") {
          data.statusCN = "等待卖家同意";
          $scope.cancelRefund = true;//footer 取消退货
        } else if (data.status === "WAIT_BUYER_REFUND") {
          data.statusCN = "卖家已同意，等待退货";
          if (data.shipping_type === "EXPRESS") {
            $scope.expressAddress = true;//退货地址 快递
            $scope.cancelRefundInputlogis = true;//footer 取消退货 填写物流信息 快递
          } else {
            $scope.fetchAddress = true;//退货地址 门店
            $scope.fetchQRcode = true;//退货二维码 门店
            $scope.cancelRefund = true;//footer 取消退货
          }

        } else if (data.status === "WAIT_SELLER_CONFIRM_REFUND") {
          data.statusCN = "买家已退货，等待卖家确认";
          $scope.expressAddress = true;//退货地址 快递
          $scope.logisticInfo = true;//物流信息 快递
          $scope.changeLogistic = true;//footer 修改物流信息 快递
        } else if (data.status === "BUYER_CLOSED") {
          data.statusCN = "买家关闭退货";
          if (data.shipping_type === "EXPRESS") {
            $scope.expressAddress = true;//退货地址 快递
          } else {
            $scope.fetchAddress = true;//退货地址 门店
            $scope.fetchQRcode = true;//退货二维码 门店
          }
        } else if (data.status === "SELLER_CLOSED") {
          data.statusCN = "卖家关闭退货";
          if (data.shipping_type === "EXPRESS") {
            $scope.expressAddress = true;//退货地址 快递
          } else {
            $scope.fetchAddress = true;//退货地址 门店
            $scope.fetchQRcode = true;//退货二维码 门店
          }
        } else if (data.status === "FINISHED") {
          data.statusCN = "已完成";
          if (data.shipping_type === "EXPRESS") {
            $scope.expressAddress = true;//退货地址 快递
            $scope.logisticInfo = true;//物流信息 快递
          } else {
            $scope.fetchSuccess = true;//退货成功模块 门店
          }
        }


        $scope.refundOrderData = data;

      })
      .error(function (data) {
        console.log(["获取订单的退货信息失败", data])
      })


    //根据导购编号和品牌编号获取导购名和工作号
    // if($scope.refundOrderData.receive_guider_id){
    // 	$http.get(URLPort+"/brands/"+$scope.refundOrderData.brand_id+"/guiders/"+$scope.refundOrderData.receive_guider_id+"/details")
    // 	.success(function(data){
    // 		console.log(["获取导购信息成功",data]);
    // 		$scope.guiderData = data;
    // 	})
    // 	.error(function(data){
    // 		console.log(["获取导购信息失败",data])
    // 	})
    // }

   

  }])

;
