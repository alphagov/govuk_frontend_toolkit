// Extension to track errors using google analytics as a data store.
(function() {

  "use strict";

  GOVUK.analyticsPlugins = GOVUK.analyticsPlugins || {};

  GOVUK.analyticsPlugins.error = function () {
    var trackJavaScriptError = function (e) {
      var errorSource = e.filename + ': ' + e.lineno;
      GOVUK.analytics.trackEvent('JavaScript Error', e.message, {
        label: errorSource,
        value: 1,
        nonInteraction: true
      });
    };

    if (window.addEventListener) {
      window.addEventListener('error', trackJavaScriptError, false);
    } else if (window.attachEvent) {
      window.attachEvent('onerror', trackJavaScriptError);
    } else {
      window.onerror = trackJavaScriptError;
    }
  }

}());
