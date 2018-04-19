;(function (global) {
  'use strict'

  var GOVUK = global.GOVUK || {}
  var EMAIL_PATTERN = /[^\s=/?&]+(?:@|%40)[^\s=/?&]+/g
  var POSTCODE_PATTERN = /[A-PR-UWYZ][A-HJ-Z]?[0-9][0-9A-HJKMNPR-Y]?(?:[\s+]|%20)*[0-9][ABD-HJLNPQ-Z]{2}/gi
  var DATE_PATTERN = /\d{4}(-?)\d{2}(-?)\d{2}/g

  // For usage and initialisation see:
  // https://github.com/alphagov/govuk_frontend_toolkit/blob/master/docs/analytics.md#create-an-analytics-tracker

  var Analytics = function (config) {
    this.stripDatePII = false
    if (typeof config.stripDatePII !== 'undefined') {
      this.stripDatePII = (config.stripDatePII === true)
      // remove the option so we don't pass it to other trackers - it's not
      // their concern
      delete config.stripDatePII
    }
    this.stripPostcodePII = false
    if (typeof config.stripPostcodePII !== 'undefined') {
      this.stripPostcodePII = (config.stripPostcodePII === true)
      // remove the option so we don't pass it to other trackers - it's not
      // their concern
      delete config.stripPostcodePII
    }
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

  var PIISafe = function (value) {
    this.value = value
  }
  Analytics.PIISafe = PIISafe

  Analytics.prototype.stripPII = function (value) {
    if (typeof value === 'string') {
      return this.stripPIIFromString(value)
    } else if (Object.prototype.toString.call(value) === '[object Array]' || Object.prototype.toString.call(value) === '[object Arguments]') {
      return this.stripPIIFromArray(value)
    } else if (typeof value === 'object') {
      return this.stripPIIFromObject(value)
    } else {
      return value
    }
  }

  Analytics.prototype.stripPIIFromString = function (string) {
    var stripped = string.replace(EMAIL_PATTERN, '[email]')
    if (this.stripDatePII === true) {
      stripped = stripped.replace(DATE_PATTERN, '[date]')
    }
    if (this.stripPostcodePII === true) {
      stripped = stripped.replace(POSTCODE_PATTERN, '[postcode]')
    }
    return stripped
  }

  Analytics.prototype.stripPIIFromObject = function (object) {
    if (object instanceof Analytics.PIISafe) {
      return object.value
    } else {
      for (var property in object) {
        var value = object[property]

        object[property] = this.stripPII(value)
      }
      return object
    }
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

  Analytics.prototype.defaultPathForTrackPageview = function (location) {
    // Get the page path including querystring, but ignoring the anchor
    // as per default behaviour of GA (see: https://developers.google.com/analytics/devguides/collection/analyticsjs/pages#overview)
    // we ignore the possibility of there being campaign variables in the
    // anchor because we wouldn't know how to detect and parse them if they
    // were present
    return this.stripPIIFromString(location.href.substring(location.origin.length).split('#')[0])
  }

  Analytics.prototype.trackPageview = function (path, title, options) {
    arguments[0] = arguments[0] || this.defaultPathForTrackPageview(window.location)
    if (arguments.length === 0) { arguments.length = 1 }
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
