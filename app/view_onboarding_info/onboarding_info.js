'use strict';

angular.module('myApp.onboardingInfo', ['ngRoute', 'LocalStorageModule'])

.controller('onboardingInfoCtrl', function ($scope, localStorageService, $rootScope, $location) {

    // indicate whether the web page is loading
    $scope.isLoading = false;

    $scope.vendorThingID = "";

    $scope.onboardingInfo = {};

    $scope.onboardingInfoFields = [];

    $scope.onboardingResult = {};

    $scope.onboardingResultFields = [];

    $scope.init = function () {
        console.log("init");
    }

    $scope.onClickSearch = function(vendorThingID) {
        loadOnboardingInfo(vendorThingID);
    }

    function loadOnboardingInfo(vendorThingID) {

        $.ajax({
            type: "GET",
            url: SOP_BASE_URL + "/onboardinghelper/" + vendorThingID,
            headers: {
              "content-type":"application/json",
              "Authorization":TOKEN,
            },
            success: function(data){
                console.log("loadOnboardingInfo", data);

                $scope.onboardingInfo = data;
                $scope.onboardingInfo.password = vendorThingID;
                $scope.onboardingInfoFields = Object.keys(data);

                $scope.$apply();
            },
            error: function(error){
                console.log("loadOnboardingInfo failed", error);

                $scope.onboardingInfo = {};
                $scope.onboardingInfoFields = [];
                $scope.$apply();
            }
        });

    }

    $scope.onClickQuickOnboarding = function(onboardingInfo) {

        var requestBody = {
            "thingPassword" : onboardingInfo.password,
            "owner" : "user:" + onboardingInfo.ownerID,
            "vendorThingID" : onboardingInfo.vendorThingID
            // "thingType" : "LED"
        };
        
        var ajaxParam={};
        ajaxParam["success"]=function(anything, textStatus,jqXHR) {
            console.log("request success");
            console.log(anything);
            console.log(textStatus);
            console.log(jqXHR);
        };
        ajaxParam["error"]=function(jqXHR,textStatus,errorThrown){
            console.log("request fail");
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
       };

        ajaxParam["type"]="POST";
        ajaxParam["headers"]={
                "accept": "*/*",
                "Content-Type": "application/vnd.kii.OnboardingWithVendorThingIDByOwner+json",
                "Authorization": "Bearer " + onboardingInfo.ownerToken,
        };
        ajaxParam["data"]=JSON.stringify(requestBody);

        var path = onboardingInfo.kiiSiteUrl + "/thing-if/apps/" + onboardingInfo.kiiAppID + "/onboardings";
        $.ajax(path, ajaxParam);


        // $.ajax({
        //     type: "POST",
        //     url: onboardingInfo.kiiSiteUrl + "/thing-if/apps/" + onboardingInfo.kiiAppID + "/onboardings",
        //     headers: {
        //         "accept": "*/*",
        //         "Content-Type": "application/vnd.kii.OnboardingWithVendorThingIDByOwner+json",
        //         "Authorization": "Bearer " + onboardingInfo.ownerToken,
        //     },
        //     data: JSON.stringify(requestBody),
        //     success: function(data){
        //         console.log("onboarding", data);

        //         $scope.onboardingResult = data;
        //         $scope.onboardingResultFields = Object.keys(data);

        //         $scope.$apply();
        //     },
        //     error: function(error){
        //         console.log("onboarding failed", error);
        //     }
        // });
    }
})
