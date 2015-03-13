(function() {
  "use strict";
  window.GOVUK = window.GOVUK || {};

  // For usage and initialisation see:
  // https://github.com/alphagov/govuk_frontend_toolkit/blob/master/docs/analytics.md#create-an-analytics-tracker

  var Tracker = function(config) {
    this.universal = new GOVUK.GoogleAnalyticsUniversalTracker(config.universalId, config.cookieDomain);
    this.classic = new GOVUK.GoogleAnalyticsClassicTracker(config.classicId, config.cookieDomain);
  };

  Tracker.load = function() {
    GOVUK.GoogleAnalyticsClassicTracker.load();
    GOVUK.GoogleAnalyticsUniversalTracker.load();
  };

  Tracker.prototype.trackPageview = function(path, title) {
    this.classic.trackPageview(path);
    this.universal.trackPageview(path, title);
  };

  /*
    https://developers.google.com/analytics/devguides/collection/analyticsjs/events
    options.label – Useful for categorizing events (eg nav buttons)
    options.value – Values must be non-negative. Useful to pass counts
    options.nonInteraction – Prevent event from impacting bounce rate
  */
  Tracker.prototype.trackEvent = function(category, action, options) {
    this.classic.trackEvent(category, action, options);
    this.universal.trackEvent(category, action, options);
  };

  Tracker.prototype.trackShare = function(network) {
    var target = location.pathname;
    this.classic.trackSocial(network, 'share', target);
    this.universal.trackSocial(network, 'share', target);
  };

  /*
    Assumes that the index of the dimension is the same for both classic and universal.
    Check this for your app before using this
   */
  Tracker.prototype.setDimension = function(index, value, name, scope) {
    this.universal.setDimension(index, value);
    this.classic.setCustomVariable(index, value, name, scope);
  };

  GOVUK.Tracker = Tracker;
})();
