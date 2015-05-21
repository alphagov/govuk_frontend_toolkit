describe("GOVUK.Analytics", function() {
  var analytics;

  beforeEach(function() {
    window.ga = function() {};
    spyOn(window, 'ga');
    this.config = {
      universalId: 'universal-id',
      cookieDomain: '.www.gov.uk'
    };

    analytics = new GOVUK.Analytics(this.config);
  });

  describe('when created', function() {
    it('configures a universal tracker', function () {
      var universalSetupArguments = window.ga.calls.allArgs();
      expect(universalSetupArguments[0]).toEqual(['create', 'universal-id', {'cookieDomain': '.www.gov.uk'}]);
    });
  });

  describe('when tracking pageviews, events and custom dimensions', function() {
    it('tracks them in universal analytics', function() {
      analytics.trackPageview('/path', 'Title');
      expect(window.ga.calls.mostRecent().args).toEqual(['send', 'pageview', {page: '/path', title: 'Title'}]);

      analytics.trackEvent('category', 'action');
      expect(window.ga.calls.mostRecent().args).toEqual(['send', {hitType: 'event', eventCategory: 'category', eventAction: 'action'}]);

      analytics.setDimension(1, 'value', 'name');
      expect(window.ga.calls.mostRecent().args).toEqual(['set', 'dimension1', 'value']);
    });
  });

  describe('when tracking social media shares', function() {
    it('tracks in universal', function() {
      analytics.trackShare('network');

      expect(window.ga.calls.mostRecent().args).toEqual(['send', {
        hitType: 'social',
        socialNetwork: 'network',
        socialAction: 'share',
        socialTarget: jasmine.any(String)
      }]);
    });
  });

  describe('when adding a linked domain', function() {
    it('adds a linked domain to universal analytics', function() {
      analytics.addLinkedTrackerDomain('1234', 'test', 'www.example.com');

      var allArgs = window.ga.calls.allArgs()
      expect(allArgs).toContain(['create', '1234', 'auto', {'name': 'test'}]);
      expect(allArgs).toContain(['require', 'linker']);
      expect(allArgs).toContain(['test.require', 'linker']);
      expect(allArgs).toContain(['linker:autoLink', ['www.example.com']]);
      expect(allArgs).toContain(['test.linker:autoLink', ['www.example.com']]);
      expect(allArgs).toContain(['test.set', 'anonymizeIp', true]);
      expect(allArgs).toContain(['test.send', 'pageview']);
    });
  });

});
