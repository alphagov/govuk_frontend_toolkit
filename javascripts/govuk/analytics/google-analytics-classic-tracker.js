(function() {
  "use strict";
  window.GOVUK = window.GOVUK || {};

  var GoogleAnalyticsClassicTracker = function(id, cookieDomain) {
    window._gaq = window._gaq || [];
    configureProfile(id, cookieDomain);
    allowCrossDomainTracking();
    anonymizeIp();

    function configureProfile(id, cookieDomain) {
      _gaq.push(['_setAccount', id]);
      _gaq.push(['_setDomainName', cookieDomain]);
    }

    function allowCrossDomainTracking() {
      _gaq.push(['_setAllowLinker', true]);
    }

    // https://developers.google.com/analytics/devguides/collection/gajs/methods/gaJSApi_gat#_gat._anonymizeIp
    function anonymizeIp() {
      _gaq.push(['_gat._anonymizeIp']);
    }
  };

  GoogleAnalyticsClassicTracker.load = function() {
    var ga = document.createElement('script'),
        s = document.getElementsByTagName('script')[0];

    ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    s.parentNode.insertBefore(ga, s);
  };

  // https://developers.google.com/analytics/devguides/collection/gajs/asyncMigrationExamples#VirtualPageviews
  GoogleAnalyticsClassicTracker.prototype.trackPageview = function(path) {
    var pageview = ['_trackPageview'];

    if (typeof path === "string") {
      pageview.push(path);
    }

    _gaq.push(pageview);
  };

  // https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide
  GoogleAnalyticsClassicTracker.prototype.trackEvent = function(category, action, options) {
    var value,
        options = options || {},
        hasLabel = false,
        hasValue = false,
        evt = ["_trackEvent", category, action];

    // Label is optional
    if (typeof options.label === "string") {
      hasLabel = true;
      evt.push(options.label);
    }

    // Value is optional, but when used must be an
    // integer, otherwise the event will be invalid
    // and not logged
    if (options.value || options.value === 0) {
      value = parseInt(options.value, 10);
      if (typeof value === "number" && !isNaN(value)) {
        hasValue = true;

        // Push an empty label if not set for correct final argument order
        if (!hasLabel) {
          evt.push('');
        }

        evt.push(value);
      }
    }

    // Prevents an event from affecting bounce rate
    // https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide#non-interaction
    if (options.nonInteraction) {

      // Push empty label/value if not already set, for correct final argument order
      if (!hasValue) {
        if (!hasLabel) {
          evt.push('');
        }
        evt.push(0);
      }

      evt.push(true);
    }

    _gaq.push(evt);
  };

  /*
    https://developers.google.com/analytics/devguides/collection/gajs/methods/gaJSApiSocialTracking
    network – The network on which the action occurs (e.g. Facebook, Twitter)
    action – The type of action that happens (e.g. Like, Send, Tweet)
    target – The text value that indicates the subject of the action
  */
  GoogleAnalyticsClassicTracker.prototype.trackSocial = function(network, action, target) {
    _gaq.push(['_trackSocial', network, action, target]);
  };

  // https://developers.google.com/analytics/devguides/collection/gajs/gaTrackingCustomVariables
  GoogleAnalyticsClassicTracker.prototype.setCustomVariable = function(index, value, name, scope) {
    var PAGE_LEVEL_SCOPE = 3;
    scope = scope || PAGE_LEVEL_SCOPE;

    if (typeof index !== "number") {
      index = parseInt(index, 10);
    }

    if (typeof scope !== "number") {
      scope = parseInt(scope, 10);
    }

    _gaq.push(['_setCustomVar', index, name, String(value), scope]);
  };

  // Match tracker and universal API
  GoogleAnalyticsClassicTracker.prototype.setDimension = function(index, value, name, scope) {
    this.setCustomVariable(index, value, name, scope);
  }

  GOVUK.GoogleAnalyticsClassicTracker = GoogleAnalyticsClassicTracker;
})();
