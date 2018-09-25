/* global describe it expect beforeEach afterEach jasmine */

var $ = window.jQuery

describe('stageprompt', function () {
  'use strict'
  var GOVUK = window.GOVUK

  var analyticsCallback

  beforeEach(function () {
    $('<div id="sandbox"></div>').appendTo('body')
  })

  afterEach(function () {
    $('#sandbox').remove()
  })

  it('should exist in a namespace', function () {
    expect(GOVUK.performance.stageprompt).not.toBeNull()
  })

  it('should not blow up if there are no data-journey tags', function () {
    expect($('[data-journey]').length).toBe(0)
    GOVUK.performance.stageprompt.setup(function () {})
  })

  describe('fire the analytics callback when a data-journey tag is found', function () {
    beforeEach(function () {
      analyticsCallback = jasmine.createSpy()
      $('<div id="sandbox"></div>').appendTo('body')
    })

    afterEach(function () {
      $('#sandbox').remove()
      $('[data-journey]').removeAttr('data-journey')
    })

    it('should send an event if the page has a data-journey tag on the body', function () {
      $('body').attr('data-journey', 'test-journey:someStage')
      GOVUK.performance.stageprompt.setup(analyticsCallback)

      expect(analyticsCallback).toHaveBeenCalledWith('test-journey', 'someStage')
    })

    it('should send an event if the page has a data-journey tag on another tag', function () {
      $('#sandbox').attr('data-journey', 'test-journey:nextStep')

      GOVUK.performance.stageprompt.setup(analyticsCallback)

      expect(analyticsCallback).toHaveBeenCalledWith('test-journey', 'nextStep')
    })

    it('should send one event if the page has multiple elements with data-journey attribute', function () {
      $('#sandbox').attr('data-journey', 'test-journey:stuff')
      $('#sandbox').html('<p id="foo" data-journey="test-journey:moreStuff">something</p>')

      GOVUK.performance.stageprompt.setup(analyticsCallback)

      expect(analyticsCallback.calls.count()).toBe(1)
    })
  })

  describe('callback arguments', function () {
    var analyticsCallback

    beforeEach(function () {
      analyticsCallback = jasmine.createSpy()
      $('<div id="sandbox"></div>').appendTo('body')
    })

    afterEach(function () {
      $('#sandbox').remove()
      $('[data-journey]').removeAttr('data-journey')
    })

    it('should pass action parts as separate arguments to the callback', function () {
      $('#sandbox').attr('data-journey', 'part-1:part-2')

      GOVUK.performance.stageprompt.setup(analyticsCallback)

      expect(analyticsCallback).toHaveBeenCalledWith('part-1', 'part-2')
    })

    it('should pass a single-part action as one argument', function () {
      $('#sandbox').attr('data-journey', 'single-part')

      GOVUK.performance.stageprompt.setup(analyticsCallback)

      expect(analyticsCallback).toHaveBeenCalledWith('single-part')
    })

    it('should pass at most three arguments to the callback', function () {
      $('#sandbox').attr('data-journey', 'part-1:part-2:part-3:additional-content')

      GOVUK.performance.stageprompt.setup(analyticsCallback)

      expect(analyticsCallback).toHaveBeenCalledWith('part-1', 'part-2', 'part-3:additional-content')
    })
  })

  describe('sending events for click actions', function () {
    beforeEach(function () {
      analyticsCallback = jasmine.createSpy()
      $('<div id="sandbox"></div>').appendTo('body')
    })

    afterEach(function () {
      $('#sandbox').remove()
    })

    it('should send an event when a help link is clicked', function () {
      $('#sandbox').attr('data-journey-click', 'test-journey:stuff:help')
      GOVUK.performance.stageprompt.setup(analyticsCallback)

      $('#sandbox').click()

      expect(analyticsCallback).toHaveBeenCalledWith('test-journey', 'stuff', 'help')
    })

    it('should send events for multiple help elements on the same page', function () {
      $('#sandbox').append('<a href="#" id="1" data-journey-click="a">foo</a>')
      $('#sandbox').append('<a href="#" id="2" data-journey-click="b">bar</a>')

      GOVUK.performance.stageprompt.setup(analyticsCallback)
      $('#1').click()
      $('#2').click()

      expect(analyticsCallback).toHaveBeenCalledWith('a')
      expect(analyticsCallback).toHaveBeenCalledWith('b')
    })

    it('should send one event per click on tagged item', function () {
      $('#sandbox').append('<a href="#" id="1" data-journey-click="a">foo</a>')
      GOVUK.performance.stageprompt.setup(analyticsCallback)

      $('#1').click()
      $('#1').click()

      expect(analyticsCallback.calls.count()).toBe(2)
    })
  })

  describe('out-of-the-box Google Analytics setup', function () {
    beforeEach(function () {
      $('<div id="gaTest" data-journey="thisIsATest"></div>').appendTo('body')
    })

    afterEach(function () {
      $('#gaTest').remove()
    })

    it('should get set up to send events to google analytics using ga() if it exists', function () {
      window.ga = jasmine.createSpy('ga')

      GOVUK.performance.stageprompt.setupForGoogleAnalytics()

      expect(window.ga).toHaveBeenCalledWith('send', 'event', 'thisIsATest', undefined, undefined, { nonInteraction: true })
    })

    it('should get set up to send events to google analytics using gaq.push() if ga() does not exist', function () {
      delete window.ga
      window._gaq = {push: jasmine.createSpy('_gaq.push')}

      GOVUK.performance.stageprompt.setupForGoogleAnalytics()

      expect(window._gaq.push).toHaveBeenCalledWith(['_trackEvent', 'thisIsATest', undefined, undefined, undefined, true])
    })
  })
})
