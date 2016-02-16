'use strict';

angular.module('myApp.index', ['ngRoute', 'LocalStorageModule'])

.controller('appCtrl', ['$scope','$location', 'localStorageService', function($scope, $location, localStorageService) {
 
// ###########################################################################
// Function Part Start
// ###########################################################################
    
    /**
     * page frame init 
     */
    $scope.init = function (){

        // init left navigator bar
        $scope.views = [
        {
            "href": "#/location_list",
            "icon": "fa fa-list-alt fa-fw",
            "display": "location list"
        },
        {
            "href": "#/gateway_list",
            "icon": "fa fa-list-alt fa-fw",
            "display": "gateway list"
        },
        {
            "href": "#/thing_list",
            "icon": "fa fa-list-alt fa-fw",
            "display": "thing list"
        },
        {
            "href": "#/onboarding_info",
            "icon": "fa fa-list-alt fa-fw",
            "display": "onboarding info"
        }
        ];

    }

// ###########################################################################
// Function Part End
// ###########################################################################
}]);
