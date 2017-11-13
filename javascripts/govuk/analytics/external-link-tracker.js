;(function (global) {
  'use strict'

  var $ = global.jQuery
  var GOVUK = global.GOVUK || {}

  GOVUK.analyticsPlugins = GOVUK.analyticsPlugins || {}
  GOVUK.analyticsPlugins.externalLinkTracker = function (options) {
    options = options || {}
    var externalLinkUploadCustomDimension = options.externalLinkUploadCustomDimension
    var currentHost = GOVUK.analyticsPlugins.externalLinkTracker.getHostname()
    var externalLinkSelector = 'a[href^="http"]:not(a[href*="' + currentHost + '"])'

    $('body').on('click', externalLinkSelector, trackClickEvent)

    function trackClickEvent (evt) {
      var $link = getLinkFromEvent(evt)
      var options = {transport: 'beacon'}
      var href = $link.attr('href')
      var linkText = $.trim($link.text())

      if (linkText) {
        options.label = linkText
      }

      if (externalLinkUploadCustomDimension !== undefined) {
        // This custom dimension will be used to duplicate the url information
        // that we normally send in an "event action". This will be used to join
        // up with a scheduled custom upload called "External Link Status".
        // We can only join uploads on custom dimensions, not on `event actions`
        // where we normally add the url info.
        var externalLinkToJoinUploadOn = href

        GOVUK.analytics.setDimension(externalLinkUploadCustomDimension, externalLinkToJoinUploadOn)
      }

      GOVUK.analytics.trackEvent('External Link Clicked', href, options)
    }

    function getLinkFromEvent (evt) {
      var $target = $(evt.target)

      if (!$target.is('a')) {
        $target = $target.parents('a')
      }

      return $target
    }
  }

  GOVUK.analyticsPlugins.externalLinkTracker.getHostname = function () {
    return global.location.hostname
  }

  global.GOVUK = GOVUK
})(window)
