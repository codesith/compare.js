'use strict';

/* https://docs.angularjs.org/guide/e2e-testing */

describe('CompareJS App', function() {
  it('should redirect index to app/#init', function() {
    browser.get('app');
    browser.getLocationAbsUrl().then(function(url) {
     expect(url.split('#')[1]).toBe('/init');
    });
  });

  describe('initController', function() {

    beforeEach(function() {
      browser.get('app/#/init');
    });


    it('should render init view with 4x4 table', function() {
      var table = $('[ng-view] div table');
      var tds = table.all(by.css('td'));
      expect(tds.count()).toMatch(20);
      expect(tds.get(0).getText()).toMatch('');
      expect(tds.get(1).getText()).toMatch('Attribute 1');
      expect(tds.get(4).getText()).toMatch('Item 1');
    });

  });

});
