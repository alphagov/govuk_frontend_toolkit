describe("GOVUK.GoogleAnalyticsClassicTracker", function() {
  var classic;

  beforeEach(function() {
    window._gaq = [];
    classic = new GOVUK.GoogleAnalyticsClassicTracker('id', 'cookie-domain.com');
  });

  it('can load the libraries needed to run classic Google Analytics', function() {
    delete window._gaq;
    $('[src*="google-analytics.com/ga.js"]').remove();

    GOVUK.GoogleAnalyticsClassicTracker.load();
    expect($('script[async][src*="google-analytics.com/ga.js"]').length).toBe(1);
  });

  describe('when created', function() {
    it('configures a Google tracker using the provided profile ID and cookie domain', function() {
      expect(window._gaq[0]).toEqual(['_setAccount', 'id']);
      expect(window._gaq[1]).toEqual(['_setDomainName', 'cookie-domain.com']);
    });

    it('allows cross site linking', function() {
      expect(window._gaq[2]).toEqual(['_setAllowLinker', true]);
    });

    it('anonymises the IP', function() {
      expect(window._gaq[3]).toEqual(['_gat._anonymizeIp']);
    });
  });

  describe('when pageviews are tracked', function() {
    beforeEach(function() {
      // reset queue after setup
      window._gaq = [];
    });

    it('sends them to Google Analytics', function() {
      classic.trackPageview();
      expect(window._gaq[0]).toEqual(['_trackPageview']);
    });

    it('can track a virtual pageview', function() {
      classic.trackPageview('/nicholas-page');
      expect(window._gaq[0]).toEqual(['_trackPageview', '/nicholas-page']);
    });
  });

  describe('when events are tracked', function() {
    beforeEach(function() {
      // reset queue after setup
      window._gaq = [];
    });

    it('sends them to Google Analytics', function() {
      classic.trackEvent('category', 'action', {label: 'label'});
      expect(window._gaq[0]).toEqual(['_trackEvent', 'category', 'action', 'label']);
    });

    it('the label is optional', function() {
      classic.trackEvent('category', 'action');
      expect(window._gaq[0]).toEqual(['_trackEvent', 'category', 'action']);
    });

    it('a value can be tracked if the label is omitted', function() {
      classic.trackEvent('category', 'action', {value: 10});
      expect(window._gaq[0]).toEqual(['_trackEvent', 'category', 'action', '', 10]);
    });

    it('only sends values if they are parseable as numbers', function() {
      classic.trackEvent('category', 'action', {label: 'label', value: '10'});
      expect(window._gaq[0]).toEqual(['_trackEvent', 'category', 'action', 'label', 10]);

      classic.trackEvent('category', 'action', {label: 'label', value: 10});
      expect(window._gaq[1]).toEqual(['_trackEvent', 'category', 'action', 'label', 10]);

      classic.trackEvent('category', 'action', {label: 'label', value: 'not a number'});
      expect(window._gaq[2]).toEqual(['_trackEvent', 'category', 'action', 'label']);
    });

    it('can mark an event as non interactive', function() {
      classic.trackEvent('category', 'action', {label: 'label', value: 1, nonInteraction: true});
      expect(window._gaq[0]).toEqual(['_trackEvent', 'category', 'action', 'label', 1, true]);
    });

    it('can mark an event as non interactive without a value', function() {
      classic.trackEvent('category', 'action', {label: 'label', nonInteraction: true});
      expect(window._gaq[0]).toEqual(['_trackEvent', 'category', 'action', 'label', 0, true]);
    });

    it('can mark an event as non interactive without a label or value', function() {
      classic.trackEvent('category', 'action', {nonInteraction: true});
      expect(window._gaq[0]).toEqual(['_trackEvent', 'category', 'action', '', 0, true]);
    });
  });

  describe('when social events are tracked', function() {
    beforeEach(function() {
      window._gaq = [];
    });

    it('sends them to Google Analytics', function() {
      classic.trackSocial('network', 'action', 'target');
      expect(window._gaq[0]).toEqual(['_trackSocial', 'network', 'action', 'target']);
    });
  });

  describe('when setting a custom variable', function() {
    beforeEach(function() {
      // reset queue after setup
      window._gaq = [];
    });

    it('sends the variable to Google Analytics', function() {
      classic.setCustomVariable(1, 'value', 'name', 10);
      expect(window._gaq[0]).toEqual(['_setCustomVar', 1, 'name', 'value', 10]);
    });

    it('coerces the value to a string', function() {
      classic.setCustomVariable(1, 100, 'name', 10);
      expect(window._gaq[0]).toEqual(['_setCustomVar', 1, 'name', '100', 10]);
    });
  });
});
