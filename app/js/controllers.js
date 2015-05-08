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
      ['Audi S4',333,57,370.00,4.90,185.7,71.9,35.20],
      ['Audi S5',333,61,965.00,4.80,182.7,73,31.70],
      ['Audi A6',310,58,600.00,5.40,193.9,73.8,37.40],
      ['Audi A4',220,43,875.00,5.60,185.1,71.9,35.20],
      ['Audi A5',220,50,25.00,6.60,182.1,73,31.70],
      ['Mercedes C400',329,55,205.00,4.70,184.5,71.3,35.20],
      ['Mercedes E350',302,63,930.00,6.10,192.1,73,35.80],
      ['BMW 328i X GT',240,50,150.00,5.90,190,72,39.20],
      ['BMW 335i X GT',300,62,275.00,5.20,190,72,39.20],
      ['BMW 328i X',240,42,950.00,5.60,182.5,71.3,35.10],
      ['BMW 335i X',300,60,715.00,4.60,182.5,71.3,35.10],
      ['BMW 428i GC',240,53,525.00,5.50,182.5,71.8,33.70],
      ['BMW 535i X',302,69,675.00,5.30,193.4,73.2,35.30]
    ];

    $scope.afterChange = function() {
      console.log('afterChange', $scope.db.items);
    };

    $scope.compare = function() {
      var data = $.merge([],$scope.db.items);
      // remove the header
      data.shift();
      // normalizing 
      // find means for each column
      var len = data[0].length;
      var means = new Array();
      means.push('means');
      var i = 1;
      for(; i<len; i++) {
        means.push(jStat(jStat.col(data, i)).median(true));
      }
      console.log(means);
      // create normalized table
      var normalizedData = $.merge([], $scope.db.items); 
      var xlen = data.length;
      var ylen = data[0].length;
      var x = 1;
      for(; x < xlen; x++) {
        var row = data[x];
        var y = 1;
        for(; y < ylen; y++) {
          var value=data[x][y];
          var normalizedValue = (value-means[y])/means[y];
          normalizedData[x][y]=normalizedValue;
        } 
      }
      console.log(normalizedData);
    }
  }
]);
