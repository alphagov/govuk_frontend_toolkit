;(function (global) {
  'use strict'

  var $ = global.jQuery
  var GOVUK = global.GOVUK || {}

  // A multivariate test framework
  //
  // Based loosely on https://github.com/jamesyu/cohorts
  //
  // Full documentation is in README.md.
  //
  function MultivariateTest (options) {
    this.$el = $(options.el)
    this._loadOption(options, 'name')
    this._loadOption(options, 'customDimensionIndex', null)
    this._loadOption(options, 'cohorts')
    this._loadOption(options, 'runImmediately', true)
    this._loadOption(options, 'defaultWeight', 1)
    this._loadOption(options, 'contentExperimentId', null)
    this._loadOption(options, 'cookieDuration', 30)

    if (this.runImmediately) {
      this.run()
    }
  }

  MultivariateTest.prototype._loadOption = function (options, key, defaultValue) {
    if (options[key] !== undefined) {
      this[key] = options[key]
    }
    if (this[key] === undefined) {
      if (defaultValue === undefined) {
        throw new Error(key + ' option is required for a multivariate test')
      } else {
        this[key] = defaultValue
      }
    }
  }

  MultivariateTest.prototype.run = function () {
    var cohort = this.getCohort()
    if (cohort) {
      this.setUpContentExperiment(cohort)
      this.setCustomVar(cohort)
      this.executeCohort(cohort)
      this.createDummyEvent(cohort)
    }
  }

  MultivariateTest.prototype.executeCohort = function (cohort) {
    var cohortObj = this.cohorts[cohort]
    if (cohortObj.callback) {
      if (typeof cohortObj.callback === 'string') {
        this[cohortObj.callback]()
      } else {
        cohortObj.callback()
      }
    }
    if (cohortObj.html) {
      this.$el.html(cohortObj.html)
      this.$el.show()
    }
  }

  // Get the current cohort or assign one if it has not been already
  MultivariateTest.prototype.getCohort = function () {
    var cohort = GOVUK.cookie(this.cookieName())
    if (!cohort || !this.cohorts[cohort]) {
      cohort = this.chooseRandomCohort()
      GOVUK.cookie(this.cookieName(), cohort, {days: this.cookieDuration})
    }
    return cohort
  }

  MultivariateTest.prototype.setCustomVar = function (cohort) {
    if (this.customDimensionIndex &&
      this.customDimensionIndex.constructor === Array) {
      for (var index = 0; index < this.customDimensionIndex.length; index++) {
        this.setDimension(cohort, this.customDimensionIndex[index])
      }
    } else if (this.customDimensionIndex) {
      this.setDimension(cohort, this.customDimensionIndex)
    }
  }

  MultivariateTest.prototype.setDimension = function (cohort, dimension) {
    GOVUK.analytics.setDimension(
      dimension,
      this.cookieName() + '__' + cohort
    )
  }

  MultivariateTest.prototype.setUpContentExperiment = function (cohort) {
    var contentExperimentId = this.contentExperimentId
    var cohortVariantId = this.cohorts[cohort]['variantId']
    if (typeof contentExperimentId !== 'undefined' &&
      typeof cohortVariantId !== 'undefined' &&
      typeof window.ga === 'function') {
      window.ga('set', 'expId', contentExperimentId)
      window.ga('set', 'expVar', cohortVariantId)
    };
  }

  MultivariateTest.prototype.createDummyEvent = function (cohort) {
    // Fire off a dummy event to set the custom var and the content experiment on the page.
    // Ideally we'd be able to call setCustomVar before trackPageview,
    // but would need reordering the existing GA code.
    GOVUK.analytics.trackEvent(this.cookieName(), 'run', {nonInteraction: true})
  }

  MultivariateTest.prototype.weightedCohortNames = function () {
    var names = []
    var defaultWeight = this.defaultWeight

    $.each(this.cohorts, function (key, cohortSettings) {
      var numberForCohort, i

      if (typeof cohortSettings.weight === 'undefined') {
        numberForCohort = defaultWeight
      } else {
        numberForCohort = cohortSettings.weight
      }

      for (i = 0; i < numberForCohort; i++) {
        names.push(key)
      }
    })

    return names
  }

  MultivariateTest.prototype.chooseRandomCohort = function () {
    var names = this.weightedCohortNames()
    return names[Math.floor(Math.random() * names.length)]
  }

  MultivariateTest.prototype.cookieName = function () {
    return 'multivariatetest_cohort_' + this.name
  }

  GOVUK.MultivariateTest = MultivariateTest

  global.GOVUK = GOVUK
})(window)
