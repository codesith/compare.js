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
    var scope, ctrl, $httpBackend;

    beforeEach(inject(function($rootScope, $controller) {
      scope = $rootScope.$new();
      ctrl = $controller('InitController', {$scope: scope});
    }));

    it('Should pass in str', function() {
      expect(scope.str).toEqual("Hello world!");
    });

  });
});
