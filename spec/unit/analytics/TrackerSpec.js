describe("GOVUK.Tracker", function() {
  var tracker;

  beforeEach(function() {
    window._gaq = [];
    window.ga = function() {};
    spyOn(window, 'ga');
    this.config = {
      universalId: 'universal-id',
      classicId: 'classic-id',
      cookieDomain: '.www.gov.uk'
    };
  });

  describe('when created', function() {
    var universalSetupArguments;

    beforeEach(function () {
      tracker = new GOVUK.Tracker(this.config);
      universalSetupArguments = window.ga.calls.allArgs();
    });

    it('configures classic and universal trackers', function () {
      expect(window._gaq[0]).toEqual(['_setAccount', 'classic-id']);
      expect(window._gaq[1]).toEqual(['_setDomainName', '.www.gov.uk']);
      expect(universalSetupArguments[0]).toEqual(['create', 'universal-id', {'cookieDomain': '.www.gov.uk'}]);
    });
  });

  describe('when tracking pageviews, events and custom dimensions', function() {

    beforeEach(function() {
      tracker = new GOVUK.Tracker(this.config);
    });

    it('tracks in both classic and universal', function() {
      window._gaq = [];
      tracker.trackPageview('/path', 'Title');
      expect(window._gaq[0]).toEqual(['_trackPageview', '/path']);
      expect(window.ga.calls.mostRecent().args).toEqual(['send', 'pageview', {page: '/path', title: 'Title'}]);

      window._gaq = [];
      tracker.trackEvent('category', 'action');
      expect(window._gaq[0]).toEqual(['_trackEvent', 'category', 'action']);
      expect(window.ga.calls.mostRecent().args).toEqual(['send', {hitType: 'event', eventCategory: 'category', eventAction: 'action'}]);

      window._gaq = [];
      tracker.setDimension(1, 'value', 'name');
      expect(window._gaq[0]).toEqual(['_setCustomVar', 1, 'name', 'value', 3]);
      expect(window.ga.calls.mostRecent().args).toEqual(['set', 'dimension1', 'value']);
    });
  });

  describe('when tracking social media shares', function() {

    beforeEach(function() {
      tracker = new GOVUK.Tracker(this.config);
    });

    it('tracks in both classic and universal', function() {
      window._gaq = [];
      tracker.trackShare('network');

      expect(window._gaq[0]).toEqual(['_trackSocial', 'network', 'share', jasmine.any(String)]);
      expect(window.ga.calls.mostRecent().args).toEqual(['send', {
        hitType: 'social',
        socialNetwork: 'network',
        socialAction: 'share',
        socialTarget: jasmine.any(String)
      }]);
    });
  });

});
