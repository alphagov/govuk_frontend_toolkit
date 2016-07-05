// Extension to monitor attempts to print pages.
(function (global) {
  "use strict";

  var GOVUK = global.GOVUK || {};

  GOVUK.analyticsPlugins = GOVUK.analyticsPlugins || {};

  GOVUK.analyticsPlugins.printIntent = function () {
    var printAttempt = (function () {
      GOVUK.analytics.trackEvent('Print Intent', document.location.pathname);
      GOVUK.analytics.trackPageview('/print' + document.location.pathname);
    });

    // Most browsers
    if (global.matchMedia) {
      var mediaQueryList = global.matchMedia('print'),
        mqlListenerCount = 0;
      mediaQueryList.addListener(function (mql) {
        if (!mql.matches && mqlListenerCount === 0) {
          printAttempt();
          mqlListenerCount++;
          // If we try and print again within 3 seconds, don't log it
          setTimeout(function () {
            mqlListenerCount = 0;
            // printing will be tracked again now
          }, 3000);
        }
      });
    }

    // IE < 10
    if (global.onafterprint) {
      global.onafterprint = printAttempt;
    }

  };

  global.GOVUK = GOVUK;
})(window);
