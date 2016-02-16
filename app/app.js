'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('myApp', [
	// angular js module
	'ngRoute',
	'ui.bootstrap',
	'LocalStorageModule',
	'flow',
	'mgo-angular-wizard',
	'ngTagsInput',
	'ui.sortable',
	'ngSanitize',
	// project module
	'myApp.index',
	'myApp.locationList',
	'myApp.gatewayList',
    'myApp.thingList',
    'myApp.onboardingInfo',
	'myApp.apimanagement',
	'myApp.register3rdparty',
	'myApp.registerkii',
	'myApp.righttemplate',
	'myApp.apilist',
	'myApp.apidetail',
	'myApp.exampleCode'
	]).
config(['$routeProvider', '$locationProvider', '$compileProvider', function($routeProvider, $http) {
	$routeProvider.otherwise({redirectTo: '/location_list'});

	$routeProvider.when('/location_list', {
		templateUrl: 'view_location_list/location_list.html',
		controller: 'locationListCtrl'});

	$routeProvider.when('/gateway_list', {
		templateUrl: 'view_gateway_list/gateway_list.html',
		controller: 'gatewayListCtrl'});

    $routeProvider.when('/thing_list', {
        templateUrl: 'view_thing_list/thing_list.html',
        controller: 'thingListCtrl'});

    $routeProvider.when('/onboarding_info', {
        templateUrl: 'view_onboarding_info/onboarding_info.html',
        controller: 'onboardingInfoCtrl'});

}]);

// base url of SOP
var SOP_BASE_URL = "http://114.215.196.178:8080/beehive-portal/api";
// var SOP_BASE_URL = "http://localhost:9090/beehive-portal/api";
// token for access SOP API
var TOKEN = "Bearer super_token";
// Kii App ID for things
var KII_APP_ID = "0af7a7e7";
// // gateway tag
// var TAG_GATEWAY = "Gateway-StreetLight";
// thing type gateway
var TYPE_GATEWAY = "gateway-streetlight";
// thing type LED
var TYPE_LED = "light-streetlight";

////////////////////////////////////////////////////////////////////
// load location map {key: district, value: array of area}
////////////////////////////////////////////////////////////////////
var locationMap = {};

function loadLocationData($http, callback) {
    console.log("loadLocationData");

    // $.ajax({
    //     type: "GET",
    //     url: SOP_BASE_URL + "/tags/locations/",
    //     headers: {
    //       "content-type":"application/json",
    //       "Authorization":TOKEN,
    //     },
    //     success: function(data){
    //         console.log("loadLocation success", data);

    //         setLocationMap(data, callback);
    //     },
    //     error: function(error){
    //         console.log("loadLocation failed", error);
    //     }
    // });

    $http({
        method:'GET',
        url: SOP_BASE_URL + "/tags/locations/",
        headers: {
          "content-type":"application/json",
          "Authorization":TOKEN,
        },
    }).success(function(data,header,config,status){
        console.log("loadLocation success", data);

        setLocationMap(data, callback);
    }).error(function(data,header,config,status){
        console.log("loadLocation failed", error);
    });
}

function setLocationMap(data, callback) {
    console.log("setLocationMap");

    locationMap = {};

    for (var i = 0; i < data.length; i++) {
        // splite location
        var locationLevel1 = undefined;
        var locationLevel2 = undefined;
        var index = data[i].indexOf("-");
        if(index >= 0) {
            locationLevel1 = data[i].substring(0, index);
            locationLevel2 = data[i].substring(index+1);
        } else {
            locationLevel1 = data[i];
        }
        
        // add to locationMap
        if(locationMap[locationLevel1] === undefined) {
            locationMap[locationLevel1] = [];
        }
        if(locationLevel2 !== undefined) {
            locationMap[locationLevel1].push(locationLevel2);
        }
    };

    callback();
}



