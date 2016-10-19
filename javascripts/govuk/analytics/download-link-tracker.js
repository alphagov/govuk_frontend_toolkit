;(function (global) {
  'use strict'

  var $ = global.jQuery
  var GOVUK = global.GOVUK || {}

  GOVUK.analyticsPlugins = GOVUK.analyticsPlugins || {}
  GOVUK.analyticsPlugins.downloadLinkTracker = function (options) {
    options = options || {}
    var downloadLinkSelector = options.selector

    if (downloadLinkSelector) {
      $('body').on('click', downloadLinkSelector, trackDownload)
    }

    function trackDownload (evt) {
      var $link = getLinkFromEvent(evt)
      var href = $link.attr('href')
      var evtOptions = {transport: 'beacon'}
      var linkText = $.trim($link.text())

      if (linkText) {
        evtOptions.label = linkText
      }

      GOVUK.analytics.trackEvent('Download Link Clicked', href, evtOptions)
    }

    function getLinkFromEvent (evt) {
      var $target = $(evt.target)

      if (!$target.is('a')) {
        $target = $target.parents('a')
      }

      return $target
    }
  }

  global.GOVUK = GOVUK
})(window)
