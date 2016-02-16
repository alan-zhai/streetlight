'use strict';

angular.module('myApp.locationList', ['ngRoute', 'LocalStorageModule'])

.controller('locationListCtrl', function ($scope, localStorageService, $rootScope, $location, $http) {

    // indicate whether the web page is loading
    $scope.isLoading = false;   

    $scope.districtList = [];

    $scope.areaList = [];

    // // json array of {key: vendor, value: api}
    // $scope.vendorList = [];

    // // json array of {key: device, value: api}
    // $scope.deviceList = [];

    // // json array of api register entity
    // $scope.featureList = [];

    // $scope.isShowSearchBox = false;

    $scope.init = function () {

        loadLocationData($http, initCallback);  
    }

    function initCallback() {
        console.log("init");

        // set districtList
        $scope.districtList = Object.keys(locationMap);
        // set areaList
        if($scope.districtList.length > 0) {
            flushAreaList($scope.districtList[0]);
        }

    }

    $scope.onClickDistrict = function(district) {
        console.log("onClickDistrict", district);
        flushAreaList(district);
    }

    function flushAreaList(district) {
        console.log("flushAreaList", district);
        $scope.areaList = locationMap[district];
    }

// master data of location:
//
// insert into tag_index(tag_type, display_name) values('Location', 'districtA-area1');
// insert into tag_index(tag_type, display_name) values('Location', 'districtA-area2');
// insert into tag_index(tag_type, display_name) values('Location', 'districtB-area4');
// insert into tag_index(tag_type, display_name) values('Location', 'districtB-area5');
// insert into tag_index(tag_type, display_name) values('Location', 'districtB-area6');

})
