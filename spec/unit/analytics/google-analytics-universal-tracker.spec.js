describe("GOVUK.GoogleAnalyticsUniversalTracker", function() {
  function addGoogleAnalyticsSpy() {
    window.ga = function() {};
    spyOn(window, 'ga');
  }

  var universal;
  var setupArguments;

  beforeEach(function() {
    addGoogleAnalyticsSpy();

    universal = new GOVUK.GoogleAnalyticsUniversalTracker('id', {
      cookieDomain: 'cookie-domain.com',
      siteSpeedSampleRate: 100
    });
  });

  it('can load the libraries needed to run universal Google Analytics', function() {
    delete window.ga;
    $('[src="https://www.google-analytics.com/analytics.js"]').remove();
    GOVUK.GoogleAnalyticsUniversalTracker.load();
    expect($('script[async][src="https://www.google-analytics.com/analytics.js"]').length).toBe(1);
    expect(typeof window.ga).toBe('function');

    window.ga('send message');
    expect(window.ga.q[0]).toEqual(jasmine.any(Object));
  });

  describe('when created', function() {
    beforeEach(function() {
      setupArguments = window.ga.calls.allArgs();
    });

    it('configures a Google tracker using the provided profile ID and config', function() {
      expect(setupArguments[0]).toEqual(['create', 'id', {cookieDomain: 'cookie-domain.com', siteSpeedSampleRate: 100}]);
    });

    it('anonymises the IP', function() {
      expect(setupArguments[1]).toEqual(['set', 'anonymizeIp', true]);
    });
  });

  describe('when created (with legacy non-object syntax)', function() {
    beforeEach(function() {
      addGoogleAnalyticsSpy();

      universal = new GOVUK.GoogleAnalyticsUniversalTracker('id', 'cookie-domain.com');
      setupArguments = window.ga.calls.allArgs();
    });

    it('configures a Google tracker using the provided profile ID and cookie domain', function() {
      expect(setupArguments[0]).toEqual(['create', 'id', {cookieDomain: 'cookie-domain.com'}]);
    });
  });

  describe('when pageviews are tracked', function() {
    it('sends them to Google Analytics', function() {
      universal.trackPageview();
      expect(window.ga.calls.mostRecent().args).toEqual(['send', 'pageview']);
    });

    it('can track a virtual pageview', function() {
      universal.trackPageview('/nicholas-page');
      expect(window.ga.calls.mostRecent().args).toEqual(['send', 'pageview', {page: '/nicholas-page'}]);
    });

    it('can track a virtual pageview with a custom title', function() {
      universal.trackPageview('/nicholas-page', 'Nicholas Page');
      expect(window.ga.calls.mostRecent().args).toEqual(['send', 'pageview', {page: '/nicholas-page', title: 'Nicholas Page'}]);
    });

    it('can set the transport method on a pageview', function() {
      universal.trackPageview('/t', 'T', {transport: 'beacon'});
      expect(window.ga.calls.mostRecent().args).toEqual(['send', 'pageview', {page: '/t', title: 'T', transport: 'beacon'}]);
    });
  });

  describe('when events are tracked', function() {
    function eventObjectFromSpy() {
      return window.ga.calls.mostRecent().args[1];
    }

    it('sends them to Google Analytics', function() {
      universal.trackEvent('category', 'action', {label: 'label'});
      expect(window.ga.calls.mostRecent().args).toEqual(
        ['send', {hitType: 'event', eventCategory: 'category', eventAction: 'action', eventLabel: 'label'}]
      );
    });

    it('the label is optional', function() {
      universal.trackEvent('category', 'action');
      expect(window.ga.calls.mostRecent().args).toEqual(
        ['send', {hitType: 'event', eventCategory: 'category', eventAction: 'action'}]
      );
    });

    it('only sends values if they are parseable as numbers', function() {
      universal.trackEvent('category', 'action', {label: 'label', value: '10'});
      expect(eventObjectFromSpy()['eventValue']).toEqual(10);

      universal.trackEvent('category', 'action', {label: 'label', value: 10});
      expect(eventObjectFromSpy()['eventValue']).toEqual(10);

      universal.trackEvent('category', 'action', {label: 'label', value: 'not a number'});
      expect(eventObjectFromSpy()['eventValue']).toEqual(undefined);
    });

    it('can mark an event as non interactive', function() {
      universal.trackEvent('category', 'action', {label: 'label', value: 0, nonInteraction: true});
      expect(window.ga.calls.mostRecent().args).toEqual(
        ['send', {
          hitType: 'event',
          eventCategory: 'category',
          eventAction: 'action',
          eventLabel: 'label',
          eventValue: 0,
          nonInteraction: 1
        }]
      );
    });

    it('sends the page if supplied', function() {
      universal.trackEvent('category', 'action', {page: '/path/to/page'});
      expect(window.ga.calls.mostRecent().args).toEqual(
        ['send', {hitType: 'event', eventCategory: 'category', eventAction: 'action', page: '/path/to/page'}]
      );
    });

    it('can set the transport method on an event', function() {
      universal.trackEvent('category', 'action', {transport: 'beacon'});
      expect(window.ga.calls.mostRecent().args).toEqual(
        ['send', {hitType: 'event', eventCategory: 'category', eventAction: 'action', transport: 'beacon'}]
      );
    });
  });

  describe('when social events are tracked', function() {
    it('sends them to Google Analytics', function() {
      universal.trackSocial('network', 'action', 'target');
      expect(window.ga.calls.mostRecent().args).toEqual(['send', {
        'hitType': 'social',
        'socialNetwork': 'network',
        'socialAction': 'action',
        'socialTarget': 'target'
      }]);
    });
  });

  describe('when setting a custom dimension', function() {
    it('sends the dimension to Google Analytics with the specified index and value', function() {
      universal.setDimension(1, 'value');
      expect(window.ga.calls.mostRecent().args).toEqual(['set', 'dimension1', 'value']);
    });

    it('coerces the value to a string', function() {
      universal.setDimension(1, 10);
      expect(window.ga.calls.mostRecent().args).toEqual(['set', 'dimension1', '10']);
    });
  });
});
