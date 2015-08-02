'use strict';

angular.module('payWay',['ionic'])
.controller('payWayCtrl',function($scope,$log,$http){
  $log.debug("payWayCtrl");
})
.controller('successPayCtrl',function($rootScope,$scope,$log,$http){
  $log.debug("successPayCtrl");
  // $rootScope.PAYNOW=false;
})
;