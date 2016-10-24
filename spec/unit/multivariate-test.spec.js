/* global describe it expect beforeEach afterEach jasmine spyOn */

var $ = window.jQuery

describe('MultivariateTest', function () {
  'use strict'
  var GOVUK = window.GOVUK

  beforeEach(function () {
    GOVUK.cookie = jasmine.createSpy('GOVUK.cookie')
    GOVUK.analytics = {setDimension: function () {}, trackEvent: function () {}}
    spyOn(GOVUK.analytics, 'setDimension')
    spyOn(GOVUK.analytics, 'trackEvent')
  })

  afterEach(function () {
    delete GOVUK.analytics
  })

  describe('#run', function () {
    it('should pick a random cohort on first run', function () {
      GOVUK.cookie.and.returnValue(null)
      var fooSpy = jasmine.createSpy('fooSpy')
      var barSpy = jasmine.createSpy('barSpy')
      new GOVUK.MultivariateTest({ // eslint-disable-line no-new
        name: 'stuff',
        cohorts: {
          foo: {callback: fooSpy},
          bar: {callback: barSpy}
        }
      })

      expect(GOVUK.cookie.calls.count()).toEqual(2)
      expect(GOVUK.cookie.calls.argsFor(1)[0]).toEqual('multivariatetest_cohort_stuff')
      if (GOVUK.cookie.calls.argsFor(1)[1] === 'foo') {
        expect(fooSpy).toHaveBeenCalled()
      } else {
        expect(barSpy).toHaveBeenCalled()
      }
    })

    it('should use an existing cohort choice on subsequent runs', function () {
      GOVUK.cookie.and.returnValue('foo')
      var fooSpy = jasmine.createSpy('fooSpy')
      var barSpy = jasmine.createSpy('barSpy')
      new GOVUK.MultivariateTest({ // eslint-disable-line no-new
        name: 'stuff',
        cohorts: {
          foo: {callback: fooSpy},
          bar: {callback: barSpy}
        }
      })
      expect(fooSpy).toHaveBeenCalled()
    })

    it('should set a custom var with the name and cohort if one is defined', function () {
      GOVUK.cookie.and.returnValue('foo')
      new GOVUK.MultivariateTest({ // eslint-disable-line no-new
        name: 'stuff',
        cohorts: {
          foo: {},
          bar: {}
        },
        customDimensionIndex: 2
      })
      expect(GOVUK.analytics.setDimension).toHaveBeenCalledWith(
        2,
        'multivariatetest_cohort_stuff__foo'
      )
    })

    it('should be able to set multiple custom vars with the name and cohort if one is defined as an array', function () {
      GOVUK.cookie.and.returnValue('foo')
      new GOVUK.MultivariateTest({ // eslint-disable-line no-new
        name: 'stuff',
        cohorts: {
          foo: {},
          bar: {}
        },
        customDimensionIndex: [2, 3]
      })
      expect(GOVUK.analytics.setDimension).toHaveBeenCalledWith(
        2,
        'multivariatetest_cohort_stuff__foo'
      )
      expect(GOVUK.analytics.setDimension).toHaveBeenCalledWith(
        3,
        'multivariatetest_cohort_stuff__foo'
      )
    })

    it('should trigger an event to track that the test has been run', function () {
      GOVUK.cookie.and.returnValue('foo')
      new GOVUK.MultivariateTest({ // eslint-disable-line no-new
        name: 'stuff',
        cohorts: {
          foo: {},
          bar: {}
        }
      })
      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith(
        'multivariatetest_cohort_stuff',
        'run',
        {nonInteraction: true}
      )
    })

    it('should set html for a cohort', function () {
      GOVUK.cookie.and.returnValue('foo')
      var $el = $('<div>')
      new GOVUK.MultivariateTest({ // eslint-disable-line no-new
        name: 'stuff',
        el: $el,
        cohorts: {
          foo: {html: 'foo'},
          bar: {html: 'bar'}
        }
      })
      expect($el.html()).toEqual('foo')
    })

    it('should call the callback for a cohort', function () {
      var fooSpy = jasmine.createSpy('fooSpy')
      var barSpy = jasmine.createSpy('barSpy')
      GOVUK.cookie.and.returnValue('bar')
      var $el = $('<div>')
      new GOVUK.MultivariateTest({ // eslint-disable-line no-new
        name: 'stuff',
        el: $el,
        cohorts: {
          foo: {callback: fooSpy},
          bar: {callback: barSpy}
        }
      })
      expect(barSpy).toHaveBeenCalled()
    })

    it('should call the callback for a cohort if it is a string', function () {
      GOVUK.cookie.and.returnValue('foo')
      var test = new GOVUK.MultivariateTest({
        name: 'stuff',
        cohorts: {
          foo: {callback: 'fooCallback'},
          bar: {}
        },
        runImmediately: false
      })
      test.fooCallback = jasmine.createSpy('fooCallback')
      test.run()
      expect(test.fooCallback).toHaveBeenCalled()
    })

    it("should assign 30 if cookieDuration isn't defined", function () {
      GOVUK.cookie.and.returnValue('foo')
      var test = new GOVUK.MultivariateTest({
        name: 'cookie_duration_test',
        cohorts: {
          foo: {callback: function () {}}
        }
      })
      expect(test.cookieDuration).toEqual(30)
    })

    it("should assign the user's cookie duration, when cookieDuration is defined", function () {
      GOVUK.cookie.and.returnValue('foo')
      var test = new GOVUK.MultivariateTest({
        name: 'cookie_duration_test',
        cookieDuration: 14,
        cohorts: {
          foo: {callback: function () {}}
        }
      })
      expect(test.cookieDuration).toEqual(14)
    })

    it('should assign a new random cohort if the assigned cohort does not exist', function () {
      var fooSpy = jasmine.createSpy('fooSpy')
      var barSpy = jasmine.createSpy('barSpy')
      GOVUK.cookie.and.returnValue('baz')
      new GOVUK.MultivariateTest({ // eslint-disable-line no-new
        name: 'stuff',
        cohorts: {
          foo: {callback: fooSpy},
          bar: {callback: barSpy}
        }
      })
      if (GOVUK.cookie.calls.argsFor(1)[1] === 'foo') {
        expect(fooSpy).toHaveBeenCalled()
      } else {
        expect(barSpy).toHaveBeenCalled()
      }
    })
  })

  describe('#weightedCohortNames', function () {
    it('should return the weighted names of the cohorts when no weights are defined', function () {
      var test = new GOVUK.MultivariateTest({
        name: 'stuff',
        cohorts: {foo: {}, bar: {}, baz: {}}
      })
      expect(test.weightedCohortNames()).toEqual(['foo', 'bar', 'baz'])
    })

    it('should return the weighted names of the cohorts when weights are defined', function () {
      var test = new GOVUK.MultivariateTest({
        name: 'stuff',
        cohorts: {foo: { weight: 2 }, bar: { weight: 1 }, baz: { weight: 3 }}
      })
      expect(test.weightedCohortNames()).toEqual(['foo', 'foo', 'bar', 'baz', 'baz', 'baz'])
    })

    it('should return the weighted names of the cohorts using default weighting', function () {
      var test = new GOVUK.MultivariateTest({
        name: 'stuff',
        defaultWeight: 2,
        cohorts: {foo: {}, bar: {}, baz: {}}
      })
      expect(test.weightedCohortNames()).toEqual(['foo', 'foo', 'bar', 'bar', 'baz', 'baz'])
    })

    it('should return the weighted names of the cohorts using default weighting or defined weighting', function () {
      var test = new GOVUK.MultivariateTest({
        name: 'stuff',
        defaultWeight: 2,
        cohorts: {foo: {}, bar: { weight: 1 }, baz: {}}
      })
      expect(test.weightedCohortNames()).toEqual(['foo', 'foo', 'bar', 'baz', 'baz'])
    })
  })

  describe('#chooseRandomCohort', function () {
    it('should choose a random cohort', function () {
      var test = new GOVUK.MultivariateTest({
        name: 'stuff',
        cohorts: {foo: {}, bar: {}}
      })
      expect(['foo', 'bar']).toContain(test.chooseRandomCohort())
    })
  })

  describe('Google Content Experiment Integration', function () {
    beforeEach(function () {
      window.ga = function () {}
      spyOn(window, 'ga')
    })

    it('should report the experiment data to Google', function () {
      new GOVUK.MultivariateTest({ // eslint-disable-line no-new
        name: 'stuff',
        contentExperimentId: 'asdfsadasdfa',
        cohorts: {foo: {variantId: 0, weight: 1}, bar: {variantId: 1, weight: 0}}
      })
      expect(window.ga.calls.first().args).toEqual(['set', 'expId', 'asdfsadasdfa'])
      expect(window.ga.calls.mostRecent().args).toEqual(['set', 'expVar', 0])
      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith(
        'multivariatetest_cohort_stuff',
        'run',
        {nonInteraction: true}
      )
    })
  })
})
