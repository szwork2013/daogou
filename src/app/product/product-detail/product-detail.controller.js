'use strict';

var product = angular.module('product',['ionic']);
product.controller('productDetailCtrl',function($rootScope,$scope,$log,$http,$state,$stateParams,URLPort){
	// $rootScope.URLPort = "http://yunwan2.3322.org:57095";
	var URLPort = URLPort();


	$http.get(URLPort+"/items/"+$stateParams.detailId)
	
	// $http.get(URLPort+"/items/100003")

	// $http.get("assets/testdata/product-detail.json")

	.success(function(data){
		console.log(['获得商品详情成功',data]);
		$scope.productDetailData = data;
		$scope.productDetailData.buynum = 0;//买家购买数
		$scope.productDetailData.realquantity = 0;//剩余库存数量
		$scope.productDetailData.picUrlArr =  $scope.productDetailData.pic_url.split(',');//轮播图片url获取
		console.log(["$scope.productDetailData.picUrlArr",$scope.productDetailData.picUrlArr]);

		//$scope.productDetailData.content = $scope.productDetailData.content.substring(6,$scope.productDetailData.content.length-7);//content中间内容获取


		$log.debug(['$scope.productDetailData',$scope.productDetailData.skus]);
		
		console.log(["$scope.productDetailData.skus.length",$scope.productDetailData.skus.length])
		var propertyArr = $scope.productDetailData.skus[0].properties.split(';');//propertyArr.length规格种类
			$scope.productDetailData.specification = [];//$scope上添加的存放规格种类以及内容的数组。
			for(var idx in propertyArr){
				$scope.productDetailData.specification[idx] = {};
				$scope.productDetailData.specification[idx].key = "";//idx规格种类个数，//.key每个规格名//.val每个规格的值
				$scope.productDetailData.specification[idx].val = "";
		}
		
		for(var id in $scope.productDetailData.skus){//sku个数
			var flag = true;
			var propertyArr = $scope.productDetailData.skus[id].properties.split(';');//propertyArr.length参数种类
			$scope.productDetailData.realquantity += $scope.productDetailData.skus[id].real_quantity;//累加所有商品数量
			for(var tz in propertyArr){//一个规格种类一个规格种类来
				var paraArr = propertyArr[tz].split(':');//取每个规格的规格名和规格值
				var iarray = $scope.productDetailData.specification[tz].val.split(" ");
				var ilength=iarray.length-1;
				for(var i=0; i<ilength;i++){//检测新加入的规格值是否已经存在，如果存在则不加入，避免重复
					if(iarray[i] === paraArr[paraArr.length-1]){//paraArr[paraArr.length-1]要加入的参数，
                         flag = false;
					}
				}
				if(flag){
					$scope.productDetailData.specification[tz].val += paraArr[paraArr.length-1]+" ";//规格值
					$log.debug(['$scope.productDetailData.specification',$scope.productDetailData.specification]);
				}else{
					flag = true;//当取同一个sku时，后面的规格需要把flag置为true
				}
			
				$scope.productDetailData.specification[tz].array = $scope.productDetailData.specification[tz].val.split(" ");
				$scope.productDetailData.specification[tz].array.splice($scope.productDetailData.specification[tz].array.length-1,1);
				$scope.productDetailData.specification[tz].key = paraArr[paraArr.length-2];//规格名
				
			}
		}

		$scope.productDetailData.buynum = $scope.productDetailData.realquantity;
	})
	.error(function(data){
		console.log(['获得商品详情失败',data]);
	});


	$log.debug('productDetailCtrl');

//点击导购头像出现个人中心，导购橱窗，购物车，以及关闭
	$scope.showmenu = function(){
		if(parseInt($(".daogou").css("height"))<100){
			$(".daogou").animate({"height":"180"},100);
			$(".redPoint").hide();
		}else{
			$(".daogou").animate({"height":"46"},100);
		}
	}
//打开选取商品尺寸 颜色，初始化商品规格状态，有些已经无货了，控件就不可选
    function propertyMenu(){
    	$(".mengban").show();
    	$(".chooseProductInfoWarp").show();
    	for(var ii in $scope.productDetailData.specification){
    		console.log($scope.productDetailData.specification[ii].array);
    		for(var cc in $scope.productDetailData.specification[ii].array){
    			var total = 0;
    			console.log($scope.productDetailData.specification[ii].array[cc]);

    			for(var dd in $scope.productDetailData.skus){
    				if($scope.productDetailData.skus[dd].properties.indexOf($scope.productDetailData.specification[ii].array[cc])>0){
    					//检测商品每个skus 是否包含 规格值，如果包含查其库存，库存总量为0 则不可选
    					console.log("real_quantity:"+$scope.productDetailData.skus[dd].real_quantity);
    					total += parseInt($scope.productDetailData.skus[dd].real_quantity);
    					console.log("total:"+total);
    				}
    			}

    			if(total === 0){
    					$("input").each(function(){
    						if($(this).val()===$scope.productDetailData.specification[ii].array[cc]){
    							console.log("youyouyou");
    							console.log("$(this).val():"+$(this).val());
    							console.log($scope.productDetailData.specification[ii].array[cc]);
    							$(this).attr({"disabled":"disabled"});
    							$(this).next().addClass("invalid");
    						}
    					})
    			}

    		}   
    	}
    }
//当点击购物车时让设置goCart 和 goOrder 的参数使参数面板的下一步 跳转到购物车还是生成订单
	$scope.propertyShowCart =function(){
		propertyMenu();
		$scope.goCart = false;
		$scope.goOrder = true;
	}
	$scope.propertyShowOrder =function(){
		propertyMenu();
		$scope.goCart = true;
		$scope.goOrder = false;
	}


//关闭选取商品尺寸 颜色
	$scope.propertyClose = function(){
		$(".mengban").hide();
		$(".chooseProductInfoWarp").hide();
	}
//点击+ - 增减商品数
	$scope.delNum = function(num){
		console.log(["$scope.productDetailData.realquantity",$scope.productDetailData.realquantity]);
		console.log(["$scope.productDetailData.buynum",$scope.productDetailData.buynum]);
		if($scope.productDetailData.buynum>1){
			$scope.productDetailData.realquantity++;
			$scope.productDetailData.buynum--;
		}
	}
	$scope.addNum = function(num){
		console.log(["$scope.productDetailData.realquantity",$scope.productDetailData.realquantity]);
		console.log(["$scope.productDetailData.buynum",$scope.productDetailData.buynum]);
		if($scope.productDetailData.realquantity>0){
			$scope.productDetailData.realquantity--;
			$scope.productDetailData.buynum++;
		}
	}
//选择产品规格，显示是否有剩余
    $scope.checkSku = function(name,index){//name传递过来input的规格如 M L, index传递过来的规格项目名称 如尺码 颜色
    	// console.log($("input[name="+name+"]:checked").val());
    	console.log("name:"+name);
    	console.log("index:"+index);
    	for(var bb in $scope.productDetailData.specification){
    		if($scope.productDetailData.specification[bb].key===index){
    			for(var cc in $scope.productDetailData.specification){
		    				if(bb!=cc){
		    					console.log("cc:"+cc);
		    					console.log($scope.productDetailData.specification[cc].array);
		    					var key = $scope.productDetailData.specification[cc].key;
		    						console.log("key:"+key);
		    						$("input[name="+key+"]").removeAttr("disabled");
		    						$("input[name="+key+"]").next().removeClass("invalid");
		    					for(var dd in $scope.productDetailData.specification[cc].array){
		    						var total = 0;
		    						for(var ee in $scope.productDetailData.skus){//如果该sku里含有传递过来的name且含有其他参数值，查询器剩余数量？？？这儿好像有问题,暂时不支持3种规格，前面有选中的呢
		    							if(($scope.productDetailData.skus[ee].properties.indexOf(name)>0)&&($scope.productDetailData.skus[ee].properties.indexOf($scope.productDetailData.specification[cc].array[dd])>0)){
		    								total += parseInt($scope.productDetailData.skus[ee].real_quantity);
		    							}
		    						}

		    						if(total === 0){
		    								$("input").each(function(){
		    									if($(this).val()===$scope.productDetailData.specification[cc].array[dd]){
		    										console.log("youyouyou");
		    										console.log("$(this).val():"+$(this).val());
		    										console.log($scope.productDetailData.specification[cc].array[dd]);
		    										$(this).attr({"disabled":"disabled"});
		    										$(this).next().removeClass("ichoosed").addClass("invalid");
		    									}
		    								})
		    						}
		    					}

    						}
    			}
    			
    		}

            var remain = true;//所有的都选中，在sku.properties中找到和所选中条件相同的,特出现存量
            var strInput = "";
    		for(var nn in $scope.productDetailData.specification){
    			console.log("numnum"+$("input[name="+$scope.productDetailData.specification[nn].key+"]:checked").val());
    			if($("input[name="+$scope.productDetailData.specification[nn].key+"]:checked").val()==="undefined"){
    				remain = false;
    			}else{
    				strInput +=$("input[name="+$scope.productDetailData.specification[nn].key+"]:checked").val();
    			}
    			console.log("strInput:"+strInput);
    		}
    		if(remain){	
				
				for(var id in $scope.productDetailData.skus){//sku个数
					var strSku ="";
					var propertyArr = $scope.productDetailData.skus[id].properties.split(';');//propertyArr.length参数种类
					for(var tz in propertyArr){
						var paraArr = propertyArr[tz].split(':');//取参数名和参数值
						strSku+=paraArr[paraArr.length-1];
					}
					if(strSku===strInput){
						$scope.productDetailData.realquantity = $scope.productDetailData.skus[id].real_quantity;
						$scope.productDetailData.skuid = $scope.productDetailData.skus[id].sku_id;
						$scope.productDetailData.buynum = 0;
						$scope.productDetailData.skudetail = "";
						var skuArray = $scope.productDetailData.skus[id].properties.split(";");
						for (var ff in skuArray){
							var skuffArray = skuArray[ff].split(":");
							$scope.productDetailData.skudetail += skuffArray[skuffArray.length-2]+":"+skuffArray[skuffArray.length-1]+";";
						}
						$scope.productDetailData.skudetail=$scope.productDetailData.skudetail.substring(0,$scope.productDetailData.skudetail.length-1);
						console.log(["$scope.productDetailData.skudetail",$scope.productDetailData.skudetail]);

					}
				}
					 
				
    		}
    	}


    }
	
	$scope.goToOrder = function(){
		console.log(["$scope.productDetailData.brand_id111",$scope.productDetailData.brand_id])
		$state.go("creatorder",{
			title:$scope.productDetailData.title,
			price:$scope.productDetailData.price,
			skudetail:$scope.productDetailData.skudetail,
			skuid:$scope.productDetailData.skuid,
			num:$scope.productDetailData.buynum,
			freight:$scope.productDetailData.freight,
			brandid:$scope.productDetailData.brand_id
		});
	}

	$scope.login = false;//是否显示登录页面
	$scope.goToCart = function(){

		$http.get(URLPort+"/accounts/current")//获得当前登录账号
		.success(function(data){
			console.log(["用户已登录,获得当前登录用户账号",data]);
            console.log(["$scope.loginhandle",$scope.loginhandle]);
            $scope.curUserId = data.id;
			$http.post(URLPort+"/users/"+$scope.curUserId+"/shopping-carts",{
				"user_id":$scope.curUserId,
				"sku_id" : $scope.productDetailData.skuid,
				"num": $scope.productDetailData.buynum,
				"bring_guider_id" : 4
            })
            .success(function(data){
            	console.log(["加入购物车成功",data]);
     	   	$scope.login = false;//是否显示登录页面
     		$(".mengban").hide();
     		$(".chooseProductInfoWarp").hide();
            })
            .error(function(data){
            	console.log(["加入购物车失败",data]);
            })
		})
		.error(function(data){
			//如果未登录,显示登录框，进行登录
			console.log(["用户未登录,没获得当前登录用户账号",data]);
			$scope.login = true;
		})

		// $http.post(URLPort+"/users/"++"/shopping-carts",{})
		// .success(function(data){
		// 	$log.debug(["success data",data]);
		// 	$scope.productData = data;
		// })
		// .error(function(data){
		// 	$log.debug(["error data",data]);
		// })
	}


	//判断手机号是否已经注册account账户
	    function verifyUserNameExist(telenum,callBack,errorCallBack){
	    	$http.get(URLPort+"/accounts/exists?username="+telenum)
	    	.success(function(data){
	    		console.log(["手机号已经注册account",data]);
	    		callBack(telenum);
	    	})
	    	.error(function(data){
	    		console.log(["手机号未注册account",data]);
	    		errorCallBack(telenum);
	    	})
	    }
	//注册account
	    function register(telenum){
	    	$http.post(URLPort+"/accounts/register",{"username": telenum,"password": "admin","enabled": true})
	    	.success(function(data){
	    		console.log(["注册成功",data]);
	    	})
	    	.error(function(data){
	    		console.log(["注册失败",data]);
	    	})
	    }
	 //注册以后第一次保存用户信息 注册accountinfo
		function saveUserInfo(telenum){
				$http.post(URLPort+"/accounts/register/info",{"id": 1,"username": telenum, //required
	            "name": "管理员",
	            "nick": "管理员",
	            "weixin": "weixin",
	            "weixinName": "weixin nick",
	            "mobile": telenum,
	            "email": "fjdk@dkfj.com",
	            "accountId": 1,
	            "birthday": null,
	            "gender": "FEMALE"})
	            .success(function(data){
	            	console.log(["注册accountinfo成功",data]);
	            })
	            .error(function(data){
	            	console.log(["注册accountinfo失败",data]);
	            })
			}
	   //获取登录账号（手机号）获取User信息
	    function getUserInfo(telenum,callBack,errorCallBack){
	    	$http.get(URLPort+"/users/mobiles/"+telenum)//根据手机号码来获取用户信息，检测用户是否存在，如果不存在要先注册
	    	.success(function(data){
	    		console.log(["获取用户User信息,用户存在",data]);
	    		var currentUserId =data.id;
	    		callBack(currentUserId);
	    	})
	    	.error(function(data){
	    		console.log(["获取用户User信息,用户不存在",data]);
	    		errorCallBack();
	    	})
	    }
	    //通过手机号码获取验证码
	    function getverificationcode(telenum){
	    	var templatetext=encodeURIComponent("lily商务女装：验证码：%s");
	    	$http.post(URLPort+"/accounts/verification-code?codeType=MOBILE&account="+telenum+"&template="+templatetext)
	    	.success(function(data){
	    		console.log(["获取验证码成功",data]);
	    	})
	    	.error(function(data){
	    		console.log(["获取验证码失败",data]);
	    	})
	    }
	//获取验证码
		$scope.verify=function(){
			console.log("hihihi");
			console.log("$scope.mainData.telenum:"+$scope.mainData.telenum);
			console.log("$scope.mainData.verificationCode:"+$scope.mainData.verificationCode);
			$(".yanzhengma").addClass("clickdown");

			//判断手机号是否已经注册account账户
			verifyUserNameExist($scope.mainData.telenum,
			function(telenum){//如果用户名存在则读取用户信息
			},
			function(telenum){//手机号未注册account则注册
				register(telenum);//注册account
				saveUserInfo(telenum);//注册后第一次注册accountinfo
			});

			//通过手机号码获取验证码
			getverificationcode($scope.mainData.telenum);
			
		}


	//登录
		$scope.submit=function(){
			// $http.post(URLPort+"/login?username="+$scope.mainData.telenum+"&password="+$scope.mainData.verificationCode)
			$http({
				method: 'POST',
				url: URLPort+'/login',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				transformRequest: function(obj) {
					var str = [];
					for(var p in obj) str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
					return str.join("&");
				},
				data: {username:$scope.mainData.telenum, password: $scope.mainData.verificationCode}
			})
			.success(function(data){
				console.log(["登录成功",data]);
				//获得当前登录账号
			   	$http.get(URLPort+"/accounts/current")
			   	.success(function(data){
			   		console.log(["获得当前登录用户账号,已经登录",data]);
			   		var currentUserName = data.username;
			   		var currentAccountId = data.accountId;
			   		var saveUserMobile = data.mobile;
			   		$scope.curUserId = data.id;
			   		$rootScope.curUserID = data.id;
			   		console.log(["$rootScope.curUserID",$rootScope.curUserID])
	                // $rootScope.curUserInfo

			   		console.log(["$scope.curUserId",$scope.curUserId])
	                //获取登录账号（手机号）获取User信息
			   		getUserInfo(currentUserName,
			   			function(currentUserId){//User存在  根据用户id修改信息
			   				$http.put(URLPort+"/users/"+currentUserId+"",{
			   		              "id": currentUserId,
			   		              "account_id": currentAccountId,
			   		              "name": "老3",
			   		              "gender": 1,
			   		              "nick": "zhang3",
			   		              "email": "zy3@qq.com",
			   		              "birthday": 1420017957000,
			   		              "mobile": saveUserMobile,
			   		              "weixin_no": "zy3@qq.com",
			   		              "weixin_nick": "老3就是我",
			   		              "avatar":"http://brand-guide.b0.upaiyun.com/avatar.jpg"})
			   				.success(function(data){
			   					console.log(["更新User信息成功",data]);
			   				})
			   				.error(function(data){
			   					console.log(["更新User信息失败",data]);
			   				})

			   			},
			   			function(){//User不存在
			   				$http.post(URLPort+"/users",{"account_id": currentAccountId,
			   		            "name" : "老5",
			   		            "name_py": "lao5",
			   		            "gender": 1,
			   		            "nick": "zhang",
			   		            "email": "zy@qq.com",
			   		            "birthday": 1420017957000,
			   		            "mobile": saveUserMobile,
			   		            "weixin_no": "zy@qq.com",
			   		            "weixin_nick":"老5就是我",
			   		            "avatar":"http://brand-guide.b0.upaiyun.com/avatar.jpg"})
			   				.success(function(data){
			   					console.log(["新增User信息成功",data]);
			   				})
			   				.error(function(data){
			   					console.log(["新增User信息失败",data]);
			   				})
			   			})

			   	})
			   	.error(function(data){
			   		console.log(["没获得当前登录用户账号，未登录",data]);
			   	})

   				$http.post(URLPort+"/users/"+$scope.curUserId+"/shopping-carts",{
   					"user_id":$scope.curUserId,
   					"sku_id" : $scope.productDetailData.skuid,
   					"num": $scope.productDetailData.buynum,
   					"bring_guider_id" : 4
   	            })
   	            .success(function(data){
   	            	console.log(["加入购物车成功",data]);
            	   	$scope.login = false;//是否显示登录页面
            		$(".mengban").hide();
            		$(".chooseProductInfoWarp").hide();
   	            })
   	            .error(function(data){
   	            	console.log(["加入购物车失败",data]);
   	            })

			  
			})
			.error(function(data){
				console.log(["登录失败",data]);
			})
		
			
		}

		$scope.guide = function(){
			$state.go("guide")
		}
		$scope.cart = function(){
			$state.go("cart")
		}







})

;