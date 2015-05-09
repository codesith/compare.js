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
    }));

    it('Check initial compare table', function() {
      expect($scope.db.items.length).toEqual(14);
      expect($scope.db.items[0][1]).toEqual('Horsepower');
      expect($scope.db.items[1][0]).toEqual('Audi S4');
    });

    it('Check normalize function', function() {
      $scope.db.items = [
        ['', 'Horspower', 'MSRP'],
        ['Car 1', 1, 3],
        ['Car 2', 1, 5],
        ['Car 3', 2, 8]
        ];
      $scope.normalize();
      expect($scope.db.attributes).toEqual([
        {name:'Horspower', weight: 1},
        {name:'MSRP', weight: 1}
      ]);
      expect($scope.db.normalizedData).toEqual([
        ['', 'Horspower', 'MSRP'],
        ['Car 1', 0, 0],
        ['Car 2', 0, 0.4],
        ['Car 3', 1, 1]
      ]);
    });

    it('Check score function', function() {
      $scope.db.items = [
        ['', 'Horspower', 'MSRP'],
        ['Car 1', 1, 3],
        ['Car 2', 1, 5],
        ['Car 3', 2, 8]
        ];
      $scope.normalize();
      expect($scope.db.scores).toEqual([
        {name:'Car 1', score: 0},
        {name:'Car 2', score: 0.4},
        {name:'Car 3', score: 2}
      ]);
      // change attribute weight
      $scope.db.attributes = [
        {name:'Horspower', weight: 5},
        {name:'MSRP', weight: 2}
      ];
      $scope.score();
      expect($scope.db.scores).toEqual([
        {name:'Car 1', score: 0},
        {name:'Car 2', score: 0.8},
        {name:'Car 3', score: 7}
      ]);
    });
  });
});
