'use strict';

/* jasmine specs for controllers go here */
describe('Compare controllers', function() {

  beforeEach(function(){
    this.addMatchers({
      toEqualData: function(expected) {
        return angular.equals(this.actual, expected);
      }
    });
  });

  beforeEach(module('compareApp'));

  describe('InitController', function() {
    var $scope, ctrl;

    beforeEach(inject(function($rootScope, $controller) {
      $scope = $rootScope.$new();
      ctrl = $controller('InitController', {$scope: $scope});
      $scope.db.items = [
        ['', 'Horsepower', 'MSRP'],
        ['Car 1', 1, 8],
        ['Car 2', 1, 5],
        ['Car 3', 2, 3]
        ];
      $scope.normalize();
    }));

    it('Check initial compare table', function() {
      expect($scope.db.items.length).toEqual(4);
      expect($scope.db.items[0].length).toEqual(3);
      expect($scope.db.items[0][1]).toEqual('Horsepower');
      expect($scope.db.items[1][0]).toEqual('Car 1');
    });

    it('Check normalize function', function() {
      expect($scope.db.attributes).toEqual([
        {name:'Horsepower', weight: 1, order: "larger"},
        {name:'MSRP', weight: 1, order: "larger"}
      ]);
      expect($scope.db.normalizedData).toEqual([
        ['', 'Horsepower', 'MSRP'],
        ['Car 1', -0.3333, 0.5333],
        ['Car 2', -0.3333, -0.0667],
        ['Car 3', 0.6667, -0.4667]
      ]);
    });

    it('Check score function', function() {
      expect($scope.db.scores).toEqual([
        {name:'Car 1', score: 0.2},
        {name:'Car 2', score: -0.4},
        {name:'Car 3', score: 0.2}
      ]);
      // change attribute weight
      $scope.db.attributes = [
        {name:'Horsepower', weight: 5},
        {name:'MSRP', weight: 2}
      ];
      $scope.score();
      expect($scope.db.scores).toEqual([
        {name:'Car 1', score: -0.5999},
        {name:'Car 2', score: -1.7999},
        {name:'Car 3', score: 2.4001}
      ]);
    });

    it('Check toggleAttributeOrder function', function() {
      $scope.toggleAttributeOrder(0);
      expect($scope.db.attributes[0]).toEqual(
        {name:'Horsepower', weight: 1, order: "smaller"});
        $scope.toggleAttributeOrder(0);
      expect($scope.db.attributes[0]).toEqual(
          {name:'Horsepower', weight: 1, order: "larger"});
    });

    it('Check decreaseWeight function', function() {
      $scope.decreaseWeight(0);
      expect($scope.db.attributes[0]).toEqual(
        {name:'Horsepower', weight: 0, order: "larger"});
      $scope.decreaseWeight(0);
      expect($scope.db.attributes[0]).toEqual(
        {name:'Horsepower', weight: 0, order: "larger"});
    });

    it('Check increaseWeight function', function() {
      $scope.increaseWeight(0);
      expect($scope.db.attributes[0]).toEqual(
        {name:'Horsepower', weight: 2, order: "larger"});
      $scope.db.attributes[0].weight=4;
      $scope.increaseWeight(0);
      expect($scope.db.attributes[0]).toEqual(
        {name:'Horsepower', weight: 5, order: "larger"});
      $scope.increaseWeight(0);
      expect($scope.db.attributes[0]).toEqual(
        {name:'Horsepower', weight: 5, order: "larger"});
    });

  });
});
