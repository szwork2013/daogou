'use strict';

angular.module('payWay',['ionic'])
.controller('payWayCtrl',['$scope','$log','$http',function($scope,$log,$http){
  $log.debug("payWayCtrl");
}])
.controller('successPayCtrl',['$scope','$log','$http',function($scope,$log,$http){
  $log.debug("successPayCtrl");
  $rootScope.PAYNOW=false;
}])
;