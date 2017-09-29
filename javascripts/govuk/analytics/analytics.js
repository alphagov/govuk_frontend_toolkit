;(function (global) {
  'use strict'

  var GOVUK = global.GOVUK || {}

  // For usage and initialisation see:
  // https://github.com/alphagov/govuk_frontend_toolkit/blob/master/docs/analytics.md#create-an-analytics-tracker

  var Analytics = function (config) {
    this.trackers = []
    if (typeof config.universalId !== 'undefined') {
      var universalId = config.universalId
      delete config.universalId
      this.trackers.push(new GOVUK.GoogleAnalyticsUniversalTracker(universalId, config))
    }
    if (typeof config.govukTrackerUrl !== 'undefined') {
      var govukTrackerUrl = config.govukTrackerUrl
      delete config.govukTrackerUrl
      this.trackers.push(new GOVUK.GOVUKTracker(govukTrackerUrl))
    }
  }

  Analytics.prototype.stripPII = function (value) {
    if (typeof value === 'string') {
      return this.stripPIIFromString(value)
    } else if (Object.prototype.toString.call(value) === '[object Array]') {
      return this.stripPIIFromArray(value)
    } else if (typeof value === 'object') {
      return this.stripPIIFromObject(value)
    } else {
      return value
    }
  }

  Analytics.prototype.stripPIIFromString = function (string) {
    return string.replace(/[^\s=/?&]+(?:@|%40)[^\s=/?&]+/g, '[email]')
  }

  Analytics.prototype.stripPIIFromObject = function (object) {
    for (var property in object) {
      var value = object[property]

      object[property] = this.stripPII(value)
    }
    return object
  }

  Analytics.prototype.stripPIIFromArray = function (array) {
    for (var i = 0, l = array.length; i < l; i++) {
      var elem = array[i]

      array[i] = this.stripPII(elem)
    }
    return array
  }

  Analytics.prototype.sendToTrackers = function (method, args) {
    for (var i = 0, l = this.trackers.length; i < l; i++) {
      var tracker = this.trackers[i]
      var fn = tracker[method]

      if (typeof fn === 'function') {
        fn.apply(tracker, args)
      }
    }
  }

  Analytics.load = function () {
    GOVUK.GoogleAnalyticsUniversalTracker.load()
    GOVUK.GOVUKTracker.load()
  }

  Analytics.prototype.trackPageview = function (path, title, options) {
    this.sendToTrackers('trackPageview', this.stripPII(arguments))
  }

  /*
    https://developers.google.com/analytics/devguides/collection/analyticsjs/events
    options.label – Useful for categorizing events (eg nav buttons)
    options.value – Values must be non-negative. Useful to pass counts
    options.nonInteraction – Prevent event from impacting bounce rate
  */
  Analytics.prototype.trackEvent = function (category, action, options) {
    this.sendToTrackers('trackEvent', this.stripPII(arguments))
  }

  Analytics.prototype.trackShare = function (network, options) {
    this.sendToTrackers('trackSocial', this.stripPII([network, 'share', global.location.pathname, options]))
  }

  /*
    The custom dimension index must be configured within the
    Universal Analytics profile
   */
  Analytics.prototype.setDimension = function (index, value) {
    this.sendToTrackers('setDimension', this.stripPII(arguments))
  }

  /*
   Add a beacon to track a page in another GA account on another domain.
   */
  Analytics.prototype.addLinkedTrackerDomain = function (trackerId, name, domain) {
    this.sendToTrackers('addLinkedTrackerDomain', arguments)
  }

  GOVUK.Analytics = Analytics

  global.GOVUK = GOVUK
})(window)
