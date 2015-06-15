'use strict';

var compareControllers = angular.module('compareControllers', [
  'ngHandsontable'
]);

compareControllers.controller('InitController', ['$scope',
  function($scope) {
    $scope.minSpareRows = 0;
    $scope.colHeaders = false;
    $scope.db = {};
    $scope.db.items = [
      ['','Horsepower', 'MSRP','0-60','Length','Width','Rear legroom'],
      ['Audi S3',292,47995.00,4.80,175.4,70,35.1],
      ['Audi S4',333,57370.00,4.90,185.7,71.9,35.20],
      ['Audi A3',220,33540.00,5.4,175.4,70,35.1],
      ['Audi A4',220,43875.00,5.6,185.1,71.9,35.20],
      ['Mercedes C300',241,45000.00,6.1,184.5,71.3,35.20],
      ['Mercedes C450',360,55205.00,4.70,184.5,71.3,35.20],
      ['Mercedes E350',302,63930.00,6.10,192.1,73,35.80],
      ['BMW 328i X',240,42950.00,5.60,182.5,71.3,35.10],
      ['BMW 335i X',300,60715.00,4.60,182.5,71.3,35.10],
      ['BMW 428i GC',240,53525.00,5.50,182.5,71.8,33.70]
    ];

    $scope.afterChange = function() {
      console.log('afterChange', $scope.db.items);
      $scope.normalize();
      if(!$scope.$$phase) {
        $scope.$apply();
      }
    };

    $scope.afterRemoveRow = function() {
      $scope.afterChange();
    }

    $scope.afterRemoveCol = function() {
      $scope.afterChange();
    }

    $scope.normalize = function() {
      var data = new Array();
      // remove the headers and leading columns
      var cols = jStat.cols($scope.db.items);
      var rows = jStat.rows($scope.db.items);
      var x = 1;
      var y = 1;
      var aRow = new Array();
      for(; x<rows; x++) {
        aRow = new Array();
        y = 1;
        for(; y<cols; y++) {
          aRow.push(Number($scope.db.items[x][y]));
        }
        data.push(aRow);
      }

      // normalizing
      // find min and max for each column
      console.log('data', data);
      var mins = jStat(data).min();
      var maxes = jStat(data).max();
      var means = jStat(data).mean();
      console.log('mins', mins);
      console.log('maxes', maxes);
      console.log('means', means);

      // create normalized table
      $scope.db.normalizedData = new Array();
      cols = jStat.cols(data);
      rows = jStat.rows(data);
      x = 0;
      for(; x < rows; x++) {
        aRow = new Array();
        aRow.push($scope.db.items[x+1][0]);
        y = 0;
        for(; y < cols; y++) {
          var value = data[x][y];
          var min = mins[y];
          var max = maxes[y];
          var mean = means[y];
          var normalizedValue = Number(((value-mean)/(max-min)).toFixed(4));
          aRow.push(normalizedValue);
        }
        $scope.db.normalizedData.push(aRow);
      }
      $scope.db.normalizedData.unshift($scope.db.items[0]);
      console.log('normalizedData', $scope.db.normalizedData);

      // create attribute list
      $scope.db.attributes = new Array();
      var length = $scope.db.items[0].length;
      var i = 1;
      for(; i < length; i++) {
        $scope.db.attributes.push({
          "name":$scope.db.items[0][i],
          "weight":1,
          "order":"larger"
        });
      }
      console.log('attributes',$scope.db.attributes);
      $scope.score();
    }

    $scope.score = function() {
      var data = $scope.db.normalizedData.slice(0);
      // remove the headers
      data.shift();

      $scope.db.scores = new Array();
      var cols = jStat.cols(data);
      var rows = jStat.rows(data);
      var x = 0;
      for(; x < rows; x++) {
        var y = 1;
        var score = 0;
        for(; y < cols; y++) {
          var value = data[x][y];
          var weight = $scope.db.attributes[y-1].weight;
          if ($scope.db.attributes[y-1].order == "smaller") {
            score -= value*weight;
          } else {
            score += value*weight;
          }
        }
        $scope.db.scores.push({name:data[x][0], score:Number(score.toFixed(4))});
      }
      console.log('scores', $scope.db.scores);
    };

    $scope.toggleAttributeOrder = function(index) {
      console.log("toggleAttributeOrder", $scope.db.attributes[index].order);
      if ($scope.db.attributes[index].order == "smaller") {
        $scope.db.attributes[index].order = "larger";
      } else {
        $scope.db.attributes[index].order = "smaller";
      }
      $scope.score();
    };

    $scope.decreaseWeight = function(index) {
      if ($scope.db.attributes[index].weight > 0) {
        $scope.db.attributes[index].weight--;
        $scope.score();
      }
    };

    $scope.increaseWeight = function(index) {
      if ($scope.db.attributes[index].weight < 5) {
        $scope.db.attributes[index].weight++;
        $scope.score();
      }
    };
  }
]);
