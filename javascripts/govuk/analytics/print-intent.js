// Extension to monitor attempts to print pages.
(function() {

    "use strict";
    var printAttempt = (function() {
        GOVUK.analytics.trackEvent('Print Intent', document.location.pathname);
    });

    // Most browsers
    if (window.matchMedia) {
        var mediaQueryList = window.matchMedia('print'),
            mqlListenerCount = 0;
        mediaQueryList.addListener(function(mql) {
            if (!mql.matches && mqlListenerCount === 0) {
                printAttempt();
                mqlListenerCount++;
                // If we try and print again in 3 seconds, don't log it
                window.setTimeout(function(){
                    mqlListenerCount = 0;
                    // printing will be tracked again now
                },1e3);
            }
        });
    }

    // IE < 10
    if(window.onafterprint){
        window.onafterprint = printAttempt;
    }

}());
