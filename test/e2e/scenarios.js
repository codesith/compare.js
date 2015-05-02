'use strict';

/* https://docs.angularjs.org/guide/e2e-testing */

describe('CompareJS App', function() {
  it('should redirect index to app/#init', function() {
    browser.get('app');
    browser.getLocationAbsUrl().then(function(url) {
      expect(url.split('#')[1]).toBe('/init');
    });
  });

  describe('init', function() {

    beforeEach(function() {
      browser.get('app/#/init');
    });


    it('should render init view', function() {
      expect(element.all(by.css('[ng-view] p')).first().getText()).
        toMatch(/Hello world!/);
    });

  });

});
