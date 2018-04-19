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

    it('is configured not to strip date data from GA calls', function () {
      expect(analytics.stripDatePII).toEqual(false)
    })

    it('can be told to strip date data from GA calls', function () {
      analytics = new GOVUK.Analytics({
        universalId: 'universal-id',
        cookieDomain: '.www.gov.uk',
        siteSpeedSampleRate: 100,
        stripDatePII: true
      })

      expect(analytics.stripDatePII).toEqual(true)
    })

    it('is configured not to strip postcode data from GA calls', function () {
      expect(analytics.stripPostcodePII).toEqual(false)
    })

    it('can be told to strip postcode data from GA calls', function () {
      analytics = new GOVUK.Analytics({
        universalId: 'universal-id',
        cookieDomain: '.www.gov.uk',
        siteSpeedSampleRate: 100,
        stripPostcodePII: true
      })

      expect(analytics.stripPostcodePII).toEqual(true)
    })
  })

  describe('extracting the default path for a page view', function () {
    it('returns a path extracted from the location', function () {
      var location = {
        href: 'https://govuk-frontend-toolkit.example.com/a/path',
        origin: 'https://govuk-frontend-toolkit.example.com'
      }
      expect(analytics.defaultPathForTrackPageview(location)).toEqual('/a/path')
    })

    it('includes the querystring in the path extracted from the location', function () {
      var location = {
        href: 'https://govuk-frontend-toolkit.example.com/a/path?with=a&query=string',
        origin: 'https://govuk-frontend-toolkit.example.com'
      }
      expect(analytics.defaultPathForTrackPageview(location)).toEqual('/a/path?with=a&query=string')
    })

    it('removes any anchor from the path extracted from the location', function () {
      var location = {
        href: 'https://govuk-frontend-toolkit.example.com/a/path#with-an-anchor',
        origin: 'https://govuk-frontend-toolkit.example.com'
      }
      expect(analytics.defaultPathForTrackPageview(location)).toEqual('/a/path')
      location.href = 'https://govuk-frontend-toolkit.example.com/a/path?with=a&query=string#with-an-anchor'
      expect(analytics.defaultPathForTrackPageview(location)).toEqual('/a/path?with=a&query=string')
    })
  })

  describe('tracking pageviews', function () {
    beforeEach(function () {
      spyOn(analytics, 'defaultPathForTrackPageview').and.returnValue('/a/page?with=a&query=string')
    })

    it('injects a default path if no args are supplied', function () {
      analytics.trackPageview()
      console.log(window.ga.calls.mostRecent().args)
      expect(window.ga.calls.mostRecent().args[2].page).toEqual('/a/page?with=a&query=string')
    })

    it('injects a default path if args are supplied, but the path arg is blank', function () {
      analytics.trackPageview(null)
      console.log(window.ga.calls.mostRecent().args)
      expect(window.ga.calls.mostRecent().args[2].page).toEqual('/a/page?with=a&query=string')

      analytics.trackPageview(undefined)
      console.log(window.ga.calls.mostRecent().args)
      expect(window.ga.calls.mostRecent().args[2].page).toEqual('/a/page?with=a&query=string')
    })

    it('uses the supplied path', function () {
      analytics.trackPageview('/foo')
      console.log(window.ga.calls.mostRecent().args)
      expect(window.ga.calls.mostRecent().args[2].page).toEqual('/foo')
    })

    it('does not inject a default title if no args are supplied', function () {
      analytics.trackPageview()
      console.log(window.ga.calls.mostRecent().args)
      expect(window.ga.calls.mostRecent().args[2].title).toEqual(undefined)
    })

    it('does not inject a default title if args are supplied, but the title arg is blank', function () {
      analytics.trackPageview('/foo', null)
      console.log(window.ga.calls.mostRecent().args)
      expect(window.ga.calls.mostRecent().args[2].title).toEqual(undefined)

      analytics.trackPageview('/foo', undefined)
      console.log(window.ga.calls.mostRecent().args)
      expect(window.ga.calls.mostRecent().args[2].title).toEqual(undefined)
    })

    it('uses the supplied title', function () {
      analytics.trackPageview('/foo', 'A page')
      console.log(window.ga.calls.mostRecent().args)
      expect(window.ga.calls.mostRecent().args[2].title).toEqual('A page')
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

    it('leaves dates embedded in arguments by default', function () {
      analytics.trackPageview('/path/to/an/embedded/2018-01-01/postcode/?with=an&postcode=2017-01-01', '20192217', { label: '12345678', value: ['data', 'data', 'someone has added their personal9999-9999 postcode'] })
      expect(window.ga.calls.mostRecent().args).toEqual(['send', 'pageview', { page: '/path/to/an/embedded/2018-01-01/postcode/?with=an&postcode=2017-01-01', title: '20192217', label: '12345678', value: ['data', 'data', 'someone has added their personal9999-9999 postcode'] }])

      analytics.trackEvent('2017-01-01-category', '20192217-action', { label: '12345678', value: ['data', 'data', 'someone has added their personal9999-9999 postcode'] })
      expect(window.ga.calls.mostRecent().args).toEqual(['send', { hitType: 'event', eventCategory: '2017-01-01-category', eventAction: '20192217-action', eventLabel: '12345678' }]) // trackEvent ignores options other than label or integer values for value

      analytics.setDimension(1, '2017-01-01-value', { label: '12345678', value: ['data', 'data', 'someone has added their personal9999-9999 postcode'] })
      expect(window.ga.calls.mostRecent().args).toEqual(['set', 'dimension1', '2017-01-01-value']) // set dimension ignores extra options
    })

    it('strips dates embedded in arguments if configured to do so', function () {
      analytics = new GOVUK.Analytics({
        universalId: 'universal-id',
        cookieDomain: '.www.gov.uk',
        siteSpeedSampleRate: 100,
        stripDatePII: true
      })

      analytics.trackPageview('/path/to/an/embedded/2018-01-01/postcode/?with=an&postcode=2017-01-01', '20192217', { label: '12345678', value: ['data', 'data', 'someone has added their personal9999-9999 postcode'] })
      expect(window.ga.calls.mostRecent().args).toEqual(['send', 'pageview', { page: '/path/to/an/embedded/[date]/postcode/?with=an&postcode=[date]', title: '[date]', label: '[date]', value: ['data', 'data', 'someone has added their personal[date] postcode'] }])

      analytics.trackEvent('2017-01-01-category', '20192217-action', { label: '12345678', value: ['data', 'data', 'someone has added their personal9999-9999 postcode'] })
      expect(window.ga.calls.mostRecent().args).toEqual(['send', { hitType: 'event', eventCategory: '[date]-category', eventAction: '[date]-action', eventLabel: '[date]' }]) // trackEvent ignores options other than label or integer values for value

      analytics.setDimension(1, '2017-01-01-value', { label: '12345678', value: ['data', 'data', 'someone has added their personal9999-9999 postcode'] })
      expect(window.ga.calls.mostRecent().args).toEqual(['set', 'dimension1', '[date]-value']) // set dimension ignores extra options
    })

    it('leaves postcodes embedded in arguments by default', function () {
      analytics.trackPageview('/path/to/an/embedded/SW1+1AA/postcode/?with=an&postcode=SP4%207DE', 'TD15 2SE', { label: 'RG209NJ', value: ['data', 'data', 'someone has added their personalIV63 6TU postcode'] })
      expect(window.ga.calls.mostRecent().args).toEqual(['send', 'pageview', { page: '/path/to/an/embedded/SW1+1AA/postcode/?with=an&postcode=SP4%207DE', title: 'TD15 2SE', label: 'RG209NJ', value: ['data', 'data', 'someone has added their personalIV63 6TU postcode'] }])

      analytics.trackEvent('SW1+1AA-category', 'SP4%207DE-action', { label: 'RG209NJ', value: ['data', 'data', 'someone has added their personalIV63 6TU postcode'] })
      expect(window.ga.calls.mostRecent().args).toEqual(['send', { hitType: 'event', eventCategory: 'SW1+1AA-category', eventAction: 'SP4%207DE-action', eventLabel: 'RG209NJ' }]) // trackEvent ignores options other than label or integer values for value

      analytics.setDimension(1, 'SW1+1AA-value', { label: 'RG209NJ', value: ['data', 'data', 'someone has added their personalIV63 6TU postcode'] })
      expect(window.ga.calls.mostRecent().args).toEqual(['set', 'dimension1', 'SW1+1AA-value']) // set dimension ignores extra options
    })

    it('strips postcodes embedded in arguments if configured to do so', function () {
      analytics = new GOVUK.Analytics({
        universalId: 'universal-id',
        cookieDomain: '.www.gov.uk',
        siteSpeedSampleRate: 100,
        stripPostcodePII: true
      })

      analytics.trackPageview('/path/to/an/embedded/SW1+1AA/postcode/?with=an&postcode=SP4%207DE', 'TD15 2SE', { label: 'RG209NJ', value: ['data', 'data', 'someone has added their personalIV63 6TU postcode'] })
      expect(window.ga.calls.mostRecent().args).toEqual(['send', 'pageview', { page: '/path/to/an/embedded/[postcode]/postcode/?with=an&postcode=[postcode]', title: '[postcode]', label: '[postcode]', value: ['data', 'data', 'someone has added their personal[postcode] postcode'] }])

      analytics.trackEvent('SW1+1AA-category', 'SP4%207DE-action', { label: 'RG209NJ', value: ['data', 'data', 'someone has added their personalIV63 6TU postcode'] })
      expect(window.ga.calls.mostRecent().args).toEqual(['send', { hitType: 'event', eventCategory: '[postcode]-category', eventAction: '[postcode]-action', eventLabel: '[postcode]' }]) // trackEvent ignores options other than label or integer values for value

      analytics.setDimension(1, 'SW1+1AA-value', { label: 'RG209NJ', value: ['data', 'data', 'someone has added their personalIV63 6TU postcode'] })
      expect(window.ga.calls.mostRecent().args).toEqual(['set', 'dimension1', '[postcode]-value']) // set dimension ignores extra options
    })

    it('ignores any PIISafe arguments even if they look like emails, dates, or postcodes', function () {
      analytics = new GOVUK.Analytics({
        universalId: 'universal-id',
        cookieDomain: '.www.gov.uk',
        siteSpeedSampleRate: 100,
        stripDatePII: true,
        stripPostcodePII: true
      })

      analytics.trackPageview(new GOVUK.Analytics.PIISafe('/path/to/an/embedded/SW1+1AA/postcode/?with=an&postcode=SP4%207DE'), new GOVUK.Analytics.PIISafe('an.email@example.com 2017-01-01'), { label: new GOVUK.Analytics.PIISafe('another.email@example.com'), value: ['data', 'data', new GOVUK.Analytics.PIISafe('someone has added their personalIV63 6TU postcode')] })
      expect(window.ga.calls.mostRecent().args).toEqual(['send', 'pageview', { page: '/path/to/an/embedded/SW1+1AA/postcode/?with=an&postcode=SP4%207DE', title: 'an.email@example.com 2017-01-01', label: 'another.email@example.com', value: ['data', 'data', 'someone has added their personalIV63 6TU postcode'] }])

      analytics.trackEvent(new GOVUK.Analytics.PIISafe('SW1+1AA-category'), new GOVUK.Analytics.PIISafe('an.email@example.com-action 2017-01-01'), { label: new GOVUK.Analytics.PIISafe('RG209NJ'), value: ['data', 'data', 'someone has added their personalIV63 6TU postcode'] })
      expect(window.ga.calls.mostRecent().args).toEqual(['send', { hitType: 'event', eventCategory: 'SW1+1AA-category', eventAction: 'an.email@example.com-action 2017-01-01', eventLabel: 'RG209NJ' }]) // trackEvent ignores options other than label or integer values for value

      analytics.setDimension(1, new GOVUK.Analytics.PIISafe('an.email@SW1+1AA-value.com 2017-01-01'), { label: new GOVUK.Analytics.PIISafe('RG209NJ'), value: ['data', 'data', new GOVUK.Analytics.PIISafe('someone has added their personalIV63 6TU postcode')] })
      expect(window.ga.calls.mostRecent().args).toEqual(['set', 'dimension1', 'an.email@SW1+1AA-value.com 2017-01-01']) // set dimension ignores extra options
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

    it('leaves dates embedded in arguments by default', function () {
      analytics.trackShare('email', {
        to: '2017-01-01',
        label: '20170101',
        value: ['data', 'data', 'someone has added their personal29990303 postcode']
      })

      expect(window.ga.calls.mostRecent().args).toEqual(['send', {
        hitType: 'social',
        socialNetwork: 'email',
        socialAction: 'share',
        socialTarget: jasmine.any(String),
        to: '2017-01-01',
        label: '20170101',
        value: ['data', 'data', 'someone has added their personal29990303 postcode']
      }])
    })

    it('strips dates embedded in arguments if configured to do so', function () {
      analytics = new GOVUK.Analytics({
        universalId: 'universal-id',
        cookieDomain: '.www.gov.uk',
        siteSpeedSampleRate: 100,
        stripDatePII: true
      })

      analytics.trackShare('email', {
        to: '2017-01-01',
        label: '20170101',
        value: ['data', 'data', 'someone has added their personal29990303 postcode']
      })

      expect(window.ga.calls.mostRecent().args).toEqual(['send', {
        hitType: 'social',
        socialNetwork: 'email',
        socialAction: 'share',
        socialTarget: jasmine.any(String),
        to: '[date]',
        label: '[date]',
        value: ['data', 'data', 'someone has added their personal[date] postcode']
      }])
    })

    it('leaves postcodes embedded in arguments by default', function () {
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
        to: 'IV63 6TU',
        label: 'SP4%207DE',
        value: ['data', 'data', 'someone has added their personalTD15 2SE postcode']
      }])
    })

    it('strips postcodes embedded in arguments if configured to do so', function () {
      analytics = new GOVUK.Analytics({
        universalId: 'universal-id',
        cookieDomain: '.www.gov.uk',
        siteSpeedSampleRate: 100,
        stripPostcodePII: true
      })

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

    it('ignores any PIISafe arguments even if they look like emails, dates, or postcodes', function () {
      analytics = new GOVUK.Analytics({
        universalId: 'universal-id',
        cookieDomain: '.www.gov.uk',
        siteSpeedSampleRate: 100,
        stripPostcodePII: true
      })

      analytics.trackShare('email', {
        to: new GOVUK.Analytics.PIISafe('IV63 6TU'),
        label: new GOVUK.Analytics.PIISafe('an.email@example.com 2017-01-01'),
        value: new GOVUK.Analytics.PIISafe(['data', 'another.email@example.com', 'someone has added their personalTD15 2SE postcode'])
      })

      expect(window.ga.calls.mostRecent().args).toEqual(['send', {
        hitType: 'social',
        socialNetwork: 'email',
        socialAction: 'share',
        socialTarget: jasmine.any(String),
        to: 'IV63 6TU',
        label: 'an.email@example.com 2017-01-01',
        value: ['data', 'another.email@example.com', 'someone has added their personalTD15 2SE postcode']
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
