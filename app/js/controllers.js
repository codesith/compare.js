'use strict';

var compareControllers = angular.module('compareControllers', [
  'ngHandsontable'
]);

compareControllers.controller('InitController', ['$scope', 
  function($scope) {
    $scope.minSpareRows = 1;
	  $scope.colHeaders = false;
    $scope.db = {};
    $scope.db.items = [
      ['','Attribute 1', 'Attribute 2', 'Attribute 3'],
      ['Item 1'],
      ['Item 2'],
      ['Item 3']
    ];

    $scope.afterChange = function() {
      console.log('afterChange', $scope.db.items);
    };

    $scope.compare = function() {
      console.log('compare');
    }
  }
]);
