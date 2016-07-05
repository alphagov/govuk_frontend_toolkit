(function(global) {
  "use strict";

  var $ = global.jQuery;
  var GOVUK = global.GOVUK || {};

  GOVUK.analyticsPlugins = GOVUK.analyticsPlugins || {};
  GOVUK.analyticsPlugins.externalLinkTracker = function () {

    var currentHost = GOVUK.analyticsPlugins.externalLinkTracker.getHostname(),
        externalLinkSelector = 'a[href^="http"]:not(a[href*="' + currentHost + '"])';

    $('body').on('click', externalLinkSelector, trackClickEvent);

    function trackClickEvent(evt) {
      var $link = getLinkFromEvent(evt),
          options = {transport: 'beacon'},
          href = $link.attr('href'),
          linkText = $.trim($link.text());

      if (linkText) {
        options.label = linkText;
      }

      GOVUK.analytics.trackEvent('External Link Clicked', href, options);
    }

    function getLinkFromEvent(evt) {
      var $target = $(evt.target);

      if (!$target.is('a')) {
        $target = $target.parents('a');
      }

      return $target;
    }
  }

  GOVUK.analyticsPlugins.externalLinkTracker.getHostname = function() {
    return global.location.hostname;
  }

  global.GOVUK = GOVUK;
})(window);
