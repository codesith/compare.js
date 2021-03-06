'use strict';

// Declare app level module which depends on views, and components
angular.module('compareApp', [
  'ngRoute',
  'compareControllers'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/init', {
      templateUrl: 'partials/init.html',
      controller: 'InitController'
    }).
    when('/compare', {
      templateUrl: 'partials/compare.html',
      controller: 'CompareController'
    }).
    otherwise({redirectTo: '/init'});
}]);
