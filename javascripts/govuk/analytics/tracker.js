(function() {
  "use strict";
  window.GOVUK = window.GOVUK || {};

  // For usage and initialisation see:
  // https://github.com/alphagov/govuk_frontend_toolkit/blob/master/docs/analytics.md#create-an-analytics-tracker

  var Tracker = function(config) {
    this.trackers = [];
    if (typeof config.universalId != 'undefined') {
      this.trackers.push(new GOVUK.GoogleAnalyticsUniversalTracker(config.universalId, config.cookieDomain));
    }
    if (typeof config.classicId != 'undefined') {
      this.trackers.push(new GOVUK.GoogleAnalyticsClassicTracker(config.classicId, config.cookieDomain));
    }
  };

  Tracker.load = function() {
    GOVUK.GoogleAnalyticsClassicTracker.load();
    GOVUK.GoogleAnalyticsUniversalTracker.load();
  };

  Tracker.prototype.trackPageview = function(path, title) {
    for (var i=0; i < this.trackers.length; i++) {
      this.trackers[i].trackPageview(path, title);
    }
  };

  /*
    https://developers.google.com/analytics/devguides/collection/analyticsjs/events
    options.label – Useful for categorizing events (eg nav buttons)
    options.value – Values must be non-negative. Useful to pass counts
    options.nonInteraction – Prevent event from impacting bounce rate
  */
  Tracker.prototype.trackEvent = function(category, action, options) {
    for (var i=0; i < this.trackers.length; i++) {
      this.trackers[i].trackEvent(category, action, options);
    }
  };

  Tracker.prototype.trackShare = function(network) {
    var target = location.pathname;
    for (var i=0; i < this.trackers.length; i++) {
      this.trackers[i].trackSocial(network, 'share', target);
    }
  };

  /*
    Assumes that the index of the dimension is the same for both classic and universal.
    Check this for your app before using this
   */
  Tracker.prototype.setDimension = function(index, value, name, scope) {
    for (var i=0; i < this.trackers.length; i++) {
      this.trackers[i].setDimension(index, value, name, scope);
    }
  };

  /*
   Add a beacon to track a page in another GA account on another domain.
   */
  Tracker.prototype.addLinkedTrackerDomain = function(trackerId, name, domain) {
    for (var i=0; i < this.trackers.length; i++) {
      this.trackers[i].addLinkedTrackerDomain(trackerId, name, domain);
    }
  };

  GOVUK.Tracker = Tracker;
})();
