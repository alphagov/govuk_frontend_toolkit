(function() {
  "use strict";
  GOVUK.analyticsPlugins = GOVUK.analyticsPlugins || {};
  GOVUK.analyticsPlugins.downloadLinkTracker = function () {
    var downloadLinkSelector = 'a[href^="/"][href*="."]',
        downloadLinkRegexp = /\.[a-zA-Z0-9]{3,4}$/; //.pdf, .xslt, etc

    $('body').on('click', downloadLinkSelector, trackDownload);

    function trackDownload(evt) {
      var $target = $(evt.target),
          href,
          linkText;

      if (!$target.is('a')) {
        $target = $target.parents('a');
      }

      href = $target.attr('href'),
      linkText = $.trim($target.text());

      if (downloadLinkRegexp.test(href)) {
        GOVUK.analytics.trackPageview(href, linkText, {transport: 'beacon'});
      }
    }
  }
}());
