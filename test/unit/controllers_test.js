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
    var scope, ctrl;

    beforeEach(inject(function($rootScope, $controller) {
      scope = $rootScope.$new();
      ctrl = $controller('InitController', {$scope: scope});
    }));

    it('Check initial compare table, 1 header row and 3 empty rows', function() {
      expect(scope.db.items.length).toEqual(4);
      expect(scope.db.items[0][1]).toEqual('Attribute 1');
      expect(scope.db.items[1][0]).toEqual('Item 1');
    });

  });
});
