(function(global) {
  "use strict";

  var $ = global.jQuery;
  var GOVUK = global.GOVUK || {};

  GOVUK.analyticsPlugins = GOVUK.analyticsPlugins || {};
  GOVUK.analyticsPlugins.mailtoLinkTracker = function () {

    var mailtoLinkSelector = 'a[href^="mailto:"]';

    $('body').on('click', mailtoLinkSelector, trackClickEvent);

    function trackClickEvent(evt) {
      var $link = getLinkFromEvent(evt),
          options = {transport: 'beacon'},
          href = $link.attr('href'),
          linkText = $.trim($link.text());

      if (linkText) {
        options.label = linkText;
      }

      GOVUK.analytics.trackEvent('Mailto Link Clicked', href, options);
    }

    function getLinkFromEvent(evt) {
      var $target = $(evt.target);

      if (!$target.is('a')) {
        $target = $target.parents('a');
      }

      return $target;
    }
  }

  global.GOVUK = GOVUK;
})(window);
