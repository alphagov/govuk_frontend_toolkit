;(function (global) {
  'use strict'

  var GOVUK = global.GOVUK || {}
  GOVUK.Modules = GOVUK.Modules || {}

  GOVUK.Modules.AutoTrackEvent = function () {
    this.start = function (element) {
      var options = { nonInteraction: 1 } // automatic events shouldn't affect bounce rate
      var category = element.data('track-category')
      var action = element.data('track-action')
      var label = element.data('track-label')
      var value = element.data('track-value')

      if (typeof label === 'string') {
        options.label = label
      }

      if (value || value === 0) {
        options.value = value
      }

      if (GOVUK.analytics && GOVUK.analytics.trackEvent) {
        GOVUK.analytics.trackEvent(category, action, options)
      }
    }
  }

  global.GOVUK = GOVUK
})(window)
