(function() {
  "use strict";
  GOVUK.analyticsPlugins = GOVUK.analyticsPlugins || {};
  GOVUK.analyticsPlugins.externalLinkTracker = function () {

    var currentHost = GOVUK.analyticsPlugins.externalLinkTracker.getHostname(),
        externalLinkSelector = 'a[href^="http"]:not(a[href*="' + currentHost + '"])';

    $('body').on('click', externalLinkSelector, trackClickEvent);

    function trackClickEvent(evt) {
      var $target = $(evt.target),
          href = $target.attr('href'),
          linkText = $.trim($target.text()),
          options = {transport: 'beacon'};

      if (linkText) {
        options.label = linkText;
      }

      GOVUK.analytics.trackEvent('External Link Clicked', href, options);
    }
  }

  GOVUK.analyticsPlugins.externalLinkTracker.getHostname = function() {
    return window.location.hostname;
  }
}());
