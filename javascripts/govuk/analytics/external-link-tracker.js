(function() {
  "use strict";
  GOVUK.analyticsPlugins = GOVUK.analyticsPlugins || {};
  GOVUK.analyticsPlugins.externalLinkTracker = function () {

    var currentHost = GOVUK.analyticsPlugins.externalLinkTracker.getHostname(),
        externalLinkSelector = 'a[href^="http"]:not(a[href*="' + currentHost + '"])';

    $('body').on('click', externalLinkSelector, trackClickEvent);

    function trackClickEvent(evt) {
      var $target = $(evt.target),
          options = {transport: 'beacon'},
          href,
          linkText;

      if (!$target.is('a')) {
        $target = $target.parents('a');
      }

      href = $target.attr('href');
      linkText = $.trim($target.text());

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
