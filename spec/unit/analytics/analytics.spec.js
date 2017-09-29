/* global describe it expect beforeEach jasmine spyOn */

describe('GOVUK.Analytics', function () {
  'use strict'
  var GOVUK = window.GOVUK

  function addGoogleAnalyticsSpy () {
    window.ga = function () {}
    spyOn(window, 'ga')
  }

  var analytics
  var universalSetupArguments

  beforeEach(function () {
    addGoogleAnalyticsSpy()

    analytics = new GOVUK.Analytics({
      universalId: 'universal-id',
      cookieDomain: '.www.gov.uk',
      siteSpeedSampleRate: 100
    })
  })

  describe('when created', function () {
    beforeEach(function () {
      universalSetupArguments = window.ga.calls.allArgs()
    })

    it('configures a universal tracker', function () {
      expect(universalSetupArguments[0]).toEqual(['create', 'universal-id', {cookieDomain: '.www.gov.uk', siteSpeedSampleRate: 100}])
      expect(universalSetupArguments[1]).toEqual(['set', 'anonymizeIp', true])
      expect(universalSetupArguments[2]).toEqual(['set', 'displayFeaturesTask', null])
    })
  })

  describe('when tracking pageviews, events and custom dimensions', function () {
    it('tracks them in universal analytics', function () {
      analytics.trackPageview('/path', 'Title')
      expect(window.ga.calls.mostRecent().args).toEqual(['send', 'pageview', {page: '/path', title: 'Title'}])

      analytics.trackEvent('category', 'action')
      expect(window.ga.calls.mostRecent().args).toEqual(['send', {hitType: 'event', eventCategory: 'category', eventAction: 'action'}])

      analytics.setDimension(1, 'value', 'name')
      expect(window.ga.calls.mostRecent().args).toEqual(['set', 'dimension1', 'value'])
    })

    it('strips email addresses embedded in arguments', function () {
      analytics.trackPageview('/path/to/an/embedded.email@example.com/address/?with=an&email=in.it@example.com', 'an.email@example.com', { label: 'another.email@example.com', value: ['data', 'data', 'someone has added their personal.email@example.com address'] })
      expect(window.ga.calls.mostRecent().args).toEqual(['send', 'pageview', { page: '/path/to/an/[email]/address/?with=an&email=[email]', title: '[email]', label: '[email]', value: ['data', 'data', 'someone has added their [email] address'] }])

      analytics.trackEvent('an_email@example.com_address-category', 'an.email@example.com-action', { label: 'another.email@example.com', value: ['data', 'data', 'someone has added their personal.email@example.com address'] })
      expect(window.ga.calls.mostRecent().args).toEqual(['send', { hitType: 'event', eventCategory: '[email]', eventAction: '[email]', eventLabel: '[email]' }]) // trackEvent ignores options other than label or integer values for value

      analytics.setDimension(1, 'an_email@example.com_address-value', { label: 'another.email@example.com', value: ['data', 'data', 'someone has added their personal.email@example.com address'] })
      expect(window.ga.calls.mostRecent().args).toEqual(['set', 'dimension1', '[email]']) // set dimension ignores extra options
    })

    it('strips postcodes embedded in arguments', function () {
      analytics.trackPageview('/path/to/an/embedded/SW1+1AA/postcode/?with=an&postcode=SP4%207DE', 'TD15 2SE', { label: 'RG209NJ', value: ['data', 'data', 'someone has added their personalIV63 6TU postcode'] })
      expect(window.ga.calls.mostRecent().args).toEqual(['send', 'pageview', { page: '/path/to/an/embedded/[postcode]/postcode/?with=an&postcode=[postcode]', title: '[postcode]', label: '[postcode]', value: ['data', 'data', 'someone has added their personal[postcode] postcode'] }])

      analytics.trackEvent('SW1+1AA-category', 'SP4%207DE-action', { label: 'RG209NJ', value: ['data', 'data', 'someone has added their personalIV63 6TU postcode'] })
      expect(window.ga.calls.mostRecent().args).toEqual(['send', { hitType: 'event', eventCategory: '[postcode]-category', eventAction: '[postcode]-action', eventLabel: '[postcode]' }]) // trackEvent ignores options other than label or integer values for value

      analytics.setDimension(1, 'SW1+1AA-value', { label: 'RG209NJ', value: ['data', 'data', 'someone has added their personalIV63 6TU postcode'] })
      expect(window.ga.calls.mostRecent().args).toEqual(['set', 'dimension1', '[postcode]-value']) // set dimension ignores extra options
    })
  })

  describe('when tracking social media shares', function () {
    it('tracks in universal', function () {
      analytics.trackShare('network')

      expect(window.ga.calls.mostRecent().args).toEqual(['send', {
        hitType: 'social',
        socialNetwork: 'network',
        socialAction: 'share',
        socialTarget: jasmine.any(String)
      }])
    })

    it('strips email addresses embedded in arguments', function () {
      analytics.trackShare('email', {
        to: 'myfriend@example.com',
        label: 'another.email@example.com',
        value: ['data', 'data', 'someone has added their personal.email@example.com address']
      })

      expect(window.ga.calls.mostRecent().args).toEqual(['send', {
        hitType: 'social',
        socialNetwork: 'email',
        socialAction: 'share',
        socialTarget: jasmine.any(String),
        to: '[email]',
        label: '[email]',
        value: ['data', 'data', 'someone has added their [email] address']
      }])
    })

    it('strips postcodes embedded in arguments', function () {
      analytics.trackShare('email', {
        to: 'IV63 6TU',
        label: 'SP4%207DE',
        value: ['data', 'data', 'someone has added their personalTD15 2SE postcode']
      })

      expect(window.ga.calls.mostRecent().args).toEqual(['send', {
        hitType: 'social',
        socialNetwork: 'email',
        socialAction: 'share',
        socialTarget: jasmine.any(String),
        to: '[postcode]',
        label: '[postcode]',
        value: ['data', 'data', 'someone has added their personal[postcode] postcode']
      }])
    })
  })

  describe('when adding a linked domain', function () {
    it('adds a linked domain to universal analytics', function () {
      analytics.addLinkedTrackerDomain('1234', 'test', 'www.example.com')

      var allArgs = window.ga.calls.allArgs()
      expect(allArgs).toContain(['create', '1234', 'auto', {'name': 'test'}])
      expect(allArgs).toContain(['require', 'linker'])
      expect(allArgs).toContain(['test.require', 'linker'])
      expect(allArgs).toContain(['linker:autoLink', ['www.example.com']])
      expect(allArgs).toContain(['test.linker:autoLink', ['www.example.com']])
      expect(allArgs).toContain(['test.set', 'anonymizeIp', true])
      expect(allArgs).toContain(['test.set', 'displayFeaturesTask', null])
      expect(allArgs).toContain(['test.send', 'pageview'])
    })
  })
})
