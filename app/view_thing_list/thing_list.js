'use strict';

angular.module('myApp.thingList', ['ngRoute', 'LocalStorageModule'])

.controller('thingListCtrl', function ($scope, localStorageService, $rootScope, $location, $http) {

    // indicate whether the web page is loading
    $scope.isLoading = false;

    $scope.thingTableForm = {};

    $scope.thingSingleForm = {};

    $scope.selectedLocationInTable = {};

    $scope.init = function() {

        loadLocationData($http, initCallback); 

    }

    function initCallback() {
        console.log("init");

        // set basic info in ThingSingleForm and ThingTableForm
        var districtList = [];
        var areaList = [];
        var district = "";
        var area = "";
        
        var districtList = Object.keys(locationMap);
        
        if(districtList.length > 0) {
            district = districtList[0];
            areaList = locationMap[district];
        }
        
        if(areaList.length > 0) {
            area = areaList[0];
        }

        initThingSingleForm(districtList, areaList);
        initThingTableForm(districtList, areaList);

        // load thing list in ThingTableForm
        if(district.length > 0 && area.length > 0) {
            loadThingListInThingTableForm(district, area);
        }
    }

    function initThingSingleForm(districtList, areaList) {

        $scope.thingSingleForm = {
            "districtList" : districtList,
            "areaList" : areaList,
            "district": ((districtList.length > 0)? districtList[0]:""),
            "area": ((areaList.length > 0)? areaList[0]:""),
            "vendorThingID": "",
            "type": TYPE_LED,
            "kiiAppID" : KII_APP_ID
        };

        console.log("initThingSingleForm", $scope.thingSingleForm);
    }

    function initThingTableForm(districtList, areaList) {
        $scope.thingTableForm = {
            "districtList" : districtList,
            "areaList" : areaList,
            "district": ((districtList.length > 0)? districtList[0]:""),
            "area": ((areaList.length > 0)? areaList[0]:""),
            "thingList": []
        };

        console.log("initThingTableForm", $scope.thingTableForm);
    }

    function loadThingListInThingTableForm(district, area) {

        $.ajax({
            type: "GET",
            url: SOP_BASE_URL + "/things/search?tagType=Location&displayName=" + (district + "-" + area),
            headers: {
              "content-type":"application/json",
              "Authorization":TOKEN,
            },
            success: function(data){
                console.log("loadThingTableForm", data);

                var thingList = [];
                for (var i = 0; i < data.length; i++) {
                    if(data[i].type == TYPE_LED) {
                        thingList.push(data[i]);
                    }
                };

                $scope.thingTableForm.district = district;
                $scope.thingTableForm.area = area;
                $scope.thingTableForm.thingList = thingList;

                $scope.$apply();
            },
            error: function(error){
                console.log("loadThingTableForm failed", error);
            }
        });

    }

    //////////////////////////////////////////////////
    // below functions for thing single form
    //////////////////////////////////////////////////

    $scope.onChangeDistrictInThingSingleForm = function(district) {
        var areaList = locationMap[district];
        $scope.thingSingleForm.areaList = areaList;
        $scope.thingSingleForm.area = ((areaList.length > 0)? areaList[0]:"");
    }

    $scope.onClickSaveThing = function(thingSingleForm) {
        
        thingSingleForm.location = thingSingleForm.district + "-" + thingSingleForm.area;

        $.ajax({
            type: "POST",
            url: SOP_BASE_URL + "/things",
            headers: {
              "content-type":"application/json",
              "Authorization":TOKEN,
            },
            data: JSON.stringify(thingSingleForm),
            success: function(data){
                console.log("saveThingInfo", data);

                var districtList = $scope.thingSingleForm.districtList;
                var areaList = locationMap[districtList[0]];

                // clear thing single form
                initThingSingleForm(districtList, areaList);

                $scope.$apply();

                alert("Done");
            },
            error: function(error){
                console.log("saveThingInfo failed", error);
            }
        });
    }

    //////////////////////////////////////////////////
    // below functions for thing table form
    //////////////////////////////////////////////////
    
    $scope.onClickDistrictInThingTableForm = function() {
        console.log("onClickDistrictInGatwayTableForm", $scope.thingTableForm.district);
        var areaList = locationMap[$scope.thingTableForm.district];
        $scope.thingTableForm.areaList = areaList;
        $scope.thingTableForm.area = ((areaList.length > 0)? areaList[0]:"");
    }

    $scope.onClickAreaInThingTableForm = function() {
        console.log("onClickAreaInGatewayTableForm", $scope.thingTableForm.area);
        loadThingListInThingTableForm($scope.thingTableForm.district, $scope.thingTableForm.area);
    }

    $scope.onClickThingInThingTableForm = function(thing) {

    }


// master data of gateway tag:
//
// insert into tag_index(tag_type, display_name) values('Custom', 'Gateway-StreetLight');

})
