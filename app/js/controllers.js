'use strict';

var compareControllers = angular.module('compareControllers', [
  'ngHandsontable'
]);

compareControllers.controller('InitController', ['$scope',
  function($scope) {
    $scope.db = {};
    $scope.db.items = [
      ['',                'Horsepower',   'MSRP',     '0-60',   'Length',   'Width',  'Rear Legroom', 'MPG City', 'MPG Highway'],
      ['Audi S3',         292,            42900.00,   4.4,      176,        71,       35.1,           21,         28],
      ['Audi A3 e-tron',  204,            39850.00,   6.5,      176,        71,       35.1,           86,         86],
      ['Audi S4',         333,            50200.00,   4.9,      185.7,      71.9,     35.2,           18,         28],
      ['Audi A4',         252,            39400.00,   5.2,      185.7,      71.9,     35.2,           24,         31],
      ['Audi S5',         333,            53100.00,   4.9,      182.7,      73,       31.7,           17,         26],
      ['Mercedes CLA45',  375,            49950.00,   4.2,      183.8,      70,       27.1,           23,         30],
      ['Mercedes C43',    362,            52000.00,   4.7,      185.1,      71.3,     35.2,           21,         29],
      ['Mercedes C300',   241,            41500.00,   6.2,      185.1,      71.3,     35.2,           23,         30],
      ['Mercedes E300',   241,            53075.00,   6.5,      193.8,      72.9,     36.3,           22,         29],
      ['BMW 330i X',      248,            40750.00,   5.4,      182.8,      71.3,     35.1,           23,         33],
      ['BMW 340i X',      248,            49900.00,   4.9,      182.8,      71.3,     35.1,           21,         32],
    ];
    $scope.db.attributeReference = {
      'Horsepower':   {order:'desc',  weight:3},
      'MSRP':         {order:'asc',   weight:0},
      '0-60':         {order:'asc',   weight:3},
      'Length':       {order:'asc',   weight:0},
      'Width':        {order:'asc',   weight:1},
      'Rear Legroom': {order:'desc',  weight:3},
      'MPG City':     {order:'desc',  weight:3},
      'MPG Highway':  {order:'desc',  weight:0}
    }
    $scope.afterChange = function() {
      //console.log('afterChange', $scope.db.items);
      $scope.normalize();
      if(!$scope.$$phase) {
        $scope.$apply();
      }
    };

    $scope.afterInit = function() {
      console.log('afterInit');
      $scope.ht = this;
    };

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
          "weight":$scope.db.attributeReference[$scope.db.items[0][i]].weight,
          "order":$scope.db.attributeReference[$scope.db.items[0][i]].order
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
          if ($scope.db.attributes[y-1].order == "asc") {
            score -= value*weight;
          } else {
            score += value*weight;
          }
        }
        $scope.db.scores.push({
          name:data[x][0],
          score:Number(score.toFixed(4)),
          index:x+1
        });
      }
      console.log('scores', $scope.db.scores);
    };

    $scope.toggleAttributeOrder = function(index) {
      console.log("toggleAttributeOrder", $scope.db.attributes[index].order);
      if ($scope.db.attributes[index].order == "asc") {
        $scope.db.attributes[index].order = "desc";
      } else {
        $scope.db.attributes[index].order = "asc";
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

    $scope.highlight = function(index) {
      var cols = jStat.cols($scope.db.items);
      $scope.ht.selectCell(index, 0, index, cols-1);
    }
  }
]);