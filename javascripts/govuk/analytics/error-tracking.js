// Extension to track errors using google analytics as a data store.
(function() {
  "use strict";
  GOVUK.analyticsPlugins = GOVUK.analyticsPlugins || {};

  GOVUK.analyticsPlugins.error = function (options) {
    var options = options || {},
        filenameMustMatch = options.filenameMustMatch;

    var trackJavaScriptError = function (e) {
      var errorFilename = e.filename,
          errorSource = errorFilename + ': ' + e.lineno;

      if (shouldTrackThisError(errorFilename)) {
        GOVUK.analytics.trackEvent('JavaScript Error', e.message, {
          label: errorSource,
          value: 1,
          nonInteraction: true
        });
      }
    };

    function shouldTrackThisError(errorFilename) {
      // Errors in page should always be tracked
      // If there's no filename filter, everything is tracked
      if (!errorFilename || !filenameMustMatch) {
        return true;
      }

      // If there's a filter and the error matches it, track it
      if (filenameMustMatch.test(errorFilename)) {
        return true;
      }

      return false;
    }

    if (window.addEventListener) {
      window.addEventListener('error', trackJavaScriptError, false);
    } else if (window.attachEvent) {
      window.attachEvent('onerror', trackJavaScriptError);
    } else {
      window.onerror = trackJavaScriptError;
    }
  }
}());
