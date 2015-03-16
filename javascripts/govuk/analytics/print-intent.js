// Extension to monitor attempts to print pages.
(function () {
  "use strict";

  GOVUK.analyticsPlugins = GOVUK.analyticsPlugins || {};

  GOVUK.analyticsPlugins.printIntent = function () {
    var printAttempt = (function () {
      GOVUK.analytics.trackEvent('Print Intent', document.location.pathname);
      GOVUK.analytics.trackPageview('/print' + document.location.pathname);
    });

    // Most browsers
    if (window.matchMedia) {
      var mediaQueryList = window.matchMedia('print'),
        mqlListenerCount = 0;
      mediaQueryList.addListener(function (mql) {
        if (!mql.matches && mqlListenerCount === 0) {
          printAttempt();
          mqlListenerCount++;
          // If we try and print again within 3 seconds, don't log it
          window.setTimeout(function () {
            mqlListenerCount = 0;
            // printing will be tracked again now
          }, 3000);
        }
      });
    }

    // IE < 10
    if (window.onafterprint) {
      window.onafterprint = printAttempt;
    }

  };

}());
