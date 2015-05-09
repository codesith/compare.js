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
      ['','Horsepower', 'MSRP','0-60','Length','Width','Rear legroom'],
      ['Audi S4',333,57370.00,4.90,185.7,71.9,35.20],
      ['Audi S5',333,61965.00,4.80,182.7,73,31.70],
      ['Audi A6',310,58600.00,5.40,193.9,73.8,37.40],
      ['Audi A4',220,43875.00,5.60,185.1,71.9,35.20],
      ['Audi A5',220,5025.00,6.60,182.1,73,31.70],
      ['Mercedes C400',329,55205.00,4.70,184.5,71.3,35.20],
      ['Mercedes E350',302,63930.00,6.10,192.1,73,35.80],
      ['BMW 328i X GT',240,50150.00,5.90,190,72,39.20],
      ['BMW 335i X GT',300,62275.00,5.20,190,72,39.20],
      ['BMW 328i X',240,42950.00,5.60,182.5,71.3,35.10],
      ['BMW 335i X',300,60715.00,4.60,182.5,71.3,35.10],
      ['BMW 428i GC',240,53525.00,5.50,182.5,71.8,33.70],
      ['BMW 535i X',302,69675.00,5.30,193.4,73.2,35.30]
    ];

    $scope.afterItemsChange = function() {
      console.log('afterItemsChange', $scope.db.items);
    };

    $scope.compare = function() {
      var data = $.merge([],$scope.db.items);
      // remove the header
      data.shift();
      data.pop();

      // normalizing
      // find min and max for each column
      var mins = jStat.min(data);
      var maxes = jStat.max(data);
      console.log(mins);
      console.log(maxes);

      // create normalized table
      var normalizedData = new Array();
      var cols = jStat.cols(data);
      var rows = jStat.rows(data);
      var x = 0;
      for(; x < rows; x++) {
        var aRow = new Array();
        aRow.push(data[x][0]);
        var y = 1;
        for(; y < cols; y++) {
          var value=data[x][y];
          var min=mins[y];
          var max=maxes[y];
          var normalizedValue = (value-min)/(max-min);
          aRow.push(normalizedValue);
        }
        normalizedData.push(aRow);
      }
      normalizedData.unshift($scope.db.items[0]);
      console.log(normalizedData);

      // create attribute list
      $scope.db.attributes=new Array();
      var length = $scope.db.items[0].length;
      var i = 1;
      for(; i < length; i++) {
        $scope.db.attributes.push($scope.db.items[0][i]);
      }
      console.log($scope.db.attributes);
    }

    $scope.afterAttributesChange = function() {
      console.log('afterAttributesChange', $scope.db.attributes);
    };
  }
]);
