;(function (global) {
  'use strict'

  var $ = global.jQuery
  var GOVUK = global.GOVUK || {}

  GOVUK.analyticsPlugins = GOVUK.analyticsPlugins || {}
  GOVUK.analyticsPlugins.breadcrumbLinkTracker = function (options) {
    options = options || {}
    var breadcrumbLinkSelector = options.selector

    if (breadcrumbLinkSelector) {
      $('body').on('click', breadcrumbLinkSelector, trackBreadcrumbClick)
    }

    function trackBreadcrumbClick (evt) {
      var linkPosition = $(breadcrumbLinkSelector).index(this)
      var $link = getLinkFromEvent(evt)
      var href = $link.attr('href')
      var linkText = $.trim($link.text())
      var currentPath = $(global).attr('location').pathname
      var evtOptions = {
        page: currentPath,
        label: href,
        transport: 'beacon'
      }

      // Set the link text as a dimension
      // TODO: we need to speak with performance analysts in order to determine
      // what the value should be. For now, it's fake.
      var titleDimension = 12345
      GOVUK.analytics.setDimension(titleDimension, linkText)

      // Custom event for click tracking
      GOVUK.analytics.trackEvent('breadcrumbClicked', linkPosition, evtOptions)
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
