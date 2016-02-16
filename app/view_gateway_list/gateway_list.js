'use strict';

angular.module('myApp.gatewayList', ['ngRoute', 'LocalStorageModule'])

.controller('gatewayListCtrl', function ($scope, localStorageService, $rootScope, $location, $http) {

    // indicate whether the web page is loading
    $scope.isLoading = false;

    $scope.gatewayTableForm = {};

    $scope.gatewaySingleForm = {};

    $scope.selectedLocationInTable = {};

    $scope.init = function() {

        loadLocationData($http, initCallback); 

    }

    function initCallback() {
        console.log("init");

        // set location info in GatewaySingleForm and GatewayTableForm
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

        initGatewaySingleForm(districtList, areaList);
        initGatewayTableForm(districtList, areaList);

        // load gateway list in GatewayTableForm
        if(district.length > 0 && area.length > 0) {
            loadGatewayListInGatewayTableForm(district, area);
        }
    }

    function initGatewaySingleForm(districtList, areaList) {

        $scope.gatewaySingleForm = {
            "districtList" : districtList,
            "areaList" : areaList,
            "district": ((districtList.length > 0)? districtList[0]:""),
            "area": ((areaList.length > 0)? areaList[0]:""),
            "vendorThingID": "",
            "type": TYPE_GATEWAY,
            "kiiAppID" : KII_APP_ID
        };

        console.log("initGatewaySingleForm", $scope.gatewaySingleForm);
    }

    function initGatewayTableForm(districtList, areaList) {
        $scope.gatewayTableForm = {
            "districtList" : districtList,
            "areaList" : areaList,
            "district": ((districtList.length > 0)? districtList[0]:""),
            "area": ((areaList.length > 0)? areaList[0]:""),
            "gatewayList": []
        };

        console.log("initGatewayTableForm", $scope.gatewayTableForm);
    }

    function loadGatewayListInGatewayTableForm(district, area) {

        $.ajax({
            type: "GET",
            url: SOP_BASE_URL + "/things/search?tagType=Location&displayName=" + (district + "-" + area),
            headers: {
              "content-type":"application/json",
              "Authorization":TOKEN,
            },
            success: function(data){
                console.log("loadGatewayTableForm", data);

                var gatewayList = [];
                for (var i = 0; i < data.length; i++) {
                    if(data[i].type == TYPE_GATEWAY) {
                        gatewayList.push(data[i]);
                    }
                };

                $scope.gatewayTableForm.district = district;
                $scope.gatewayTableForm.area = area;
                $scope.gatewayTableForm.gatewayList = gatewayList;

                $scope.$apply();
            },
            error: function(error){
                console.log("loadGatewayTableForm failed", error);
            }
        });

    }

    //////////////////////////////////////////////////
    // below functions for gateway single form
    //////////////////////////////////////////////////

    $scope.onChangeDistrictInGatewaySingleForm = function(district) {
        var areaList = locationMap[district];
        $scope.gatewaySingleForm.areaList = areaList;
        $scope.gatewaySingleForm.area = ((areaList.length > 0)? areaList[0]:"");
    }

    $scope.onClickSaveGateway = function(gatewaySingleForm) {
        
        gatewaySingleForm.location = gatewaySingleForm.district + "-" + gatewaySingleForm.area;

        $.ajax({
            type: "POST",
            url: SOP_BASE_URL + "/things",
            headers: {
              "content-type":"application/json",
              "Authorization":TOKEN,
            },
            data: JSON.stringify(gatewaySingleForm),
            success: function(data){
                console.log("saveGatewayInfo", data);
                
                // bindGatewayTag(data.globalThingID);

                var districtList = $scope.gatewaySingleForm.districtList;
                var areaList = locationMap[districtList[0]];

                // clear gateway single form
                initGatewaySingleForm(districtList, areaList);

                $scope.$apply();

                alert("Done");
            },
            error: function(error){
                console.log("saveGatewayInfo failed", error);
            }
        });
    }

    // function bindGatewayTag(globalThingID) {

    //     $.ajax({
    //         type: "POST",
    //         url: SOP_BASE_URL + "/things/" + globalThingID + "/tags/custom/" + TAG_GATEWAY,
    //         headers: {
    //           "content-type":"application/json",
    //           "Authorization":TOKEN,
    //         },
    //         success: function(data){
    //             console.log("bindGatewayTag", data);

    //             $scope.$apply();
    //         },
    //         error: function(error){
    //             console.log("bindGatewayTag failed", error);
    //         }
    //     });
    // }

    //////////////////////////////////////////////////
    // below functions for gateway table form
    //////////////////////////////////////////////////
    
    $scope.onClickDistrictInGatwayTableForm = function() {
        console.log("onClickDistrictInGatwayTableForm", $scope.gatewayTableForm.district);
        var areaList = locationMap[$scope.gatewayTableForm.district];
        $scope.gatewayTableForm.areaList = areaList;
        $scope.gatewayTableForm.area = ((areaList.length > 0)? areaList[0]:"");
    }

    $scope.onClickAreaInGatewayTableForm = function() {
        console.log("onClickAreaInGatewayTableForm", $scope.gatewayTableForm.area);
        loadGatewayListInGatewayTableForm($scope.gatewayTableForm.district, $scope.gatewayTableForm.area);
    }

    $scope.onClickGateWayInGatewayTableForm = function(gateway) {

    }


// master data of gateway tag:
//
// insert into tag_index(tag_type, display_name) values('Custom', 'Gateway-StreetLight');

})
