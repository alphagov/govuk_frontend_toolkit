(function() {
  "use strict";
  window.GOVUK = window.GOVUK || {};

  // For usage and initialisation see:
  // https://github.com/alphagov/govuk_frontend_toolkit/blob/master/docs/analytics.md#create-an-analytics-tracker

  var Analytics = function(config) {
    this.trackers = [];
    if (typeof config.universalId != 'undefined') {
      this.trackers.push(new GOVUK.GoogleAnalyticsUniversalTracker(config.universalId, config.cookieDomain));
    }
  };

  Analytics.prototype.sendToTrackers = function(method, args) {
    for (var i = 0, l = this.trackers.length; i < l; i++) {
      var tracker = this.trackers[i],
          fn = tracker[method];

      if (typeof fn === "function") {
        fn.apply(tracker, args);
      }
    }
  };

  Analytics.load = function() {
    GOVUK.GoogleAnalyticsUniversalTracker.load();
  };

  Analytics.prototype.trackPageview = function(path, title) {
    this.sendToTrackers('trackPageview', arguments);
  };

  /*
    https://developers.google.com/analytics/devguides/collection/analyticsjs/events
    options.label – Useful for categorizing events (eg nav buttons)
    options.value – Values must be non-negative. Useful to pass counts
    options.nonInteraction – Prevent event from impacting bounce rate
  */
  Analytics.prototype.trackEvent = function(category, action, options) {
    this.sendToTrackers('trackEvent', arguments);
  };

  Analytics.prototype.trackShare = function(network) {
    this.sendToTrackers('trackSocial', [network, 'share', location.pathname]);
  };

  /*
    The custom dimension index must be configured within the
    Universal Analytics profile
   */
  Analytics.prototype.setDimension = function(index, value) {
    this.sendToTrackers('setDimension', arguments);
  };

  /*
   Add a beacon to track a page in another GA account on another domain.
   */
  Analytics.prototype.addLinkedTrackerDomain = function(trackerId, name, domain) {
    this.sendToTrackers('addLinkedTrackerDomain', arguments);
  };

  GOVUK.Analytics = Analytics;
})();
