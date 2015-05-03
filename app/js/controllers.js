'use strict';

var compareControllers = angular.module('compareControllers', []);

compareControllers.controller('InitController', ['$scope',
  function($scope) {
    $scope.str = 'Hello world!';
  }]);
