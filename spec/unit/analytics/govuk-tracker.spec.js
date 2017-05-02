/* global describe it expect beforeEach spyOn jasmine */

var $ = window.jQuery

describe('GOVUK.GOVUKTracker', function () {
  'use strict'
  var GOVUK = window.GOVUK

  var tracker

  function setupFakeGa (clientId) {
    window.ga = function (cb) {
      cb({
        get: function () { return clientId }
      })
    }
  }

  beforeEach(function () {
    tracker = new GOVUK.GOVUKTracker('http://www.example.com/a.gif')
  })

  describe('sendData', function () {
    it('sends the data using AJAX', function () {
      spyOn($, 'get')

      tracker.sendData({foo: 'bar'})
      expect($.get).toHaveBeenCalledWith('http://www.example.com/a.gif?foo=bar')
    })
  })

  describe('payloadParams', function () {
    it('adds the event type', function () {
      var params = tracker.payloadParams('foo', {bar: 'qux'})

      expect(params.eventType).toEqual('foo')
      expect(params.bar).toEqual('qux')
    })

    it('adds the GA Client ID', function () {
      tracker.gaClientId = '123456.789012'
      var params = tracker.payloadParams('foo')

      expect(params.gaClientId).toEqual('123456.789012')
    })

    it('adds the referrer', function () {
      var params = tracker.payloadParams('foo')

      // Can't stub window.referrer so just test that we got a string, not undefined
      expect(typeof params.referrer).toEqual('string')
    })

    it('adds performance data', function () {
      var params = tracker.payloadParams('foo')

      expect(params.navigationType).toEqual('0')
      expect(params.redirectCount).toEqual('0')

      expect(params.timing_domComplete).toEqual(window.performance.timing.domComplete.toString())
    })

    it('adds custom dimensions', function () {
      tracker.setDimension(1, 'foo')
      tracker.setDimension(10, 'bar')
      var params = tracker.payloadParams('foo')

      expect(params.dimension1).toEqual('foo')
      expect(params.dimension10).toEqual('bar')
    })

    it('adds screen and window measurements', function () {
      var params = tracker.payloadParams('foo')

      expect(params.screenWidth).toEqual(window.screen.width)
      expect(params.screenHeight).toEqual(window.screen.height)
      expect(params.windowWidth).toEqual(window.innerWidth)
      expect(params.windowHeight).toEqual(window.innerHeight)
      expect(params.colorDepth).toEqual(window.screen.colorDepth)
    })
  })

  describe('sendToTracker', function () {
    it('sends when the DOM is complete', function () {
      setupFakeGa('123456.789012')

      spyOn(tracker, 'sendData')
      tracker.sendToTracker('foo')

      expect(tracker.sendData).toHaveBeenCalledWith(jasmine.any(Object))
    })

    it('sets the ga Client ID', function () {
      setupFakeGa('123456.789012')

      spyOn(tracker, 'sendData')
      tracker.sendToTracker('foo')

      expect(tracker.gaClientId).toEqual('123456.789012')
    })
  })

  describe('tracking', function () {
    beforeEach(function () {
      spyOn(tracker, 'sendToTracker')
    })

    describe('when pageviews are tracked', function () {
      it('sends them to the tracker', function () {
        tracker.trackPageview()
        expect(tracker.sendToTracker.calls.mostRecent().args).toEqual(['pageview'])
      })
    })

    describe('when events are tracked', function () {
      it('sends them to the tracker', function () {
        tracker.trackEvent('category', 'action', {label: 'label'})
        expect(tracker.sendToTracker.calls.mostRecent().args).toEqual(
          ['event', {eventCategory: 'category', eventAction: 'action', eventLabel: 'label'}]
        )
      })

      it('tracks custom dimensions', function () {
        tracker.trackEvent('category', 'action', {dimension29: 'Home'})
        expect(tracker.sendToTracker.calls.mostRecent().args).toEqual(
          ['event', {eventCategory: 'category', eventAction: 'action', dimension29: 'Home'}]
        )
      })

      it('the label is optional', function () {
        tracker.trackEvent('category', 'action')
        expect(tracker.sendToTracker.calls.mostRecent().args).toEqual(
          ['event', {eventCategory: 'category', eventAction: 'action'}]
        )
      })

      it('sends the page if supplied', function () {
        tracker.trackEvent('category', 'action', {page: '/path/to/page'})
        expect(tracker.sendToTracker.calls.mostRecent().args).toEqual(
          ['event', {eventCategory: 'category', eventAction: 'action', page: '/path/to/page'}]
        )
      })

      it('tracks multiple events', function () {
        tracker.trackEvent('category', 'action', {label: 'foo'})
        tracker.trackEvent('category', 'action', {label: 'bar'})

        expect(tracker.sendToTracker).toHaveBeenCalledWith(
          'event', {eventCategory: 'category', eventAction: 'action', eventLabel: 'foo'}
        )
        expect(tracker.sendToTracker).toHaveBeenCalledWith(
          'event', {eventCategory: 'category', eventAction: 'action', eventLabel: 'bar'}
        )
      })
    })

    describe('when social events are tracked', function () {
      it('sends them to Google Analytics', function () {
        tracker.trackSocial('network', 'action', 'target')
        expect(tracker.sendToTracker.calls.mostRecent().args).toEqual([
          'social',
          {
            'socialNetwork': 'network',
            'socialAction': 'action',
            'socialTarget': 'target'
          }
        ])
      })
    })
  })
})
