/* global describe it expect beforeEach afterEach spyOn */

var $ = window.jQuery

describe('GOVUK.analyticsPlugins.externalLinkTracker', function () {
  'use strict'
  var GOVUK = window.GOVUK

  var $links

  beforeEach(function () {
    $links = $(
      '<div class="external-links">' +
        '<a href="http://www.nationalarchives.gov.uk"> National Archives </a>' +
        '<a href="https://www.nationalarchives.gov.uk"></a>' +
        '<a href="https://www.nationalarchives.gov.uk/one.pdf">National Archives PDF</a>' +
        '<a href="https://www.nationalarchives.gov.uk/an/image/link.png"><img src="/img" /></a>' +
      '</div>' +
      '<div class="internal-links">' +
        '<a href="/some-path">Local link</a>' +
        '<a href="http://fake-hostname.com/some-path">Another local link</a>' +
      '</div>'
    )

    $('html').on('click', function (evt) { evt.preventDefault() })
    $('body').append($links)
    GOVUK.analytics = {
      trackEvent: function () {},
      setDimension: function () {}
    }

    spyOn(GOVUK.analyticsPlugins.externalLinkTracker, 'getHostname').and.returnValue('fake-hostname.com')
  })

  afterEach(function () {
    $('html').off()
    $('body').off()
    $links.remove()
    delete GOVUK.analytics
  })

  it('listens to click events on only external links', function () {
    GOVUK.analyticsPlugins.externalLinkTracker({externalLinkUploadCustomDimension: 36})

    spyOn(GOVUK.analytics, 'trackEvent')

    $('.external-links a').each(function () {
      $(this).trigger('click')
      expect(GOVUK.analytics.trackEvent).toHaveBeenCalled()
      GOVUK.analytics.trackEvent.calls.reset()
    })

    $('.internal-links a').each(function () {
      $(this).trigger('click')
      expect(GOVUK.analytics.trackEvent).not.toHaveBeenCalled()
      GOVUK.analytics.trackEvent.calls.reset()
    })
  })

  it('listens to click events on elements within external links', function () {
    GOVUK.analyticsPlugins.externalLinkTracker({externalLinkUploadCustomDimension: 36})

    spyOn(GOVUK.analytics, 'trackEvent')

    $('.external-links a img').trigger('click')
    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith(
      'External Link Clicked', 'https://www.nationalarchives.gov.uk/an/image/link.png', {transport: 'beacon'})
  })

  it('tracks an external link\'s href and link text', function () {
    GOVUK.analyticsPlugins.externalLinkTracker({externalLinkUploadCustomDimension: 36})

    spyOn(GOVUK.analytics, 'trackEvent')
    $('.external-links a').trigger('click')

    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith(
      'External Link Clicked', 'http://www.nationalarchives.gov.uk', {transport: 'beacon', label: 'National Archives'})

    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith(
      'External Link Clicked', 'https://www.nationalarchives.gov.uk', {transport: 'beacon'})

    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith(
      'External Link Clicked', 'https://www.nationalarchives.gov.uk/one.pdf', {transport: 'beacon', label: 'National Archives PDF'})
  })

  it('duplicates the url info in a custom dimension to be used to join with a Google Analytics upload', function () {
    GOVUK.analyticsPlugins.externalLinkTracker({externalLinkUploadCustomDimension: 36})

    spyOn(GOVUK.analytics, 'setDimension')
    spyOn(GOVUK.analytics, 'trackEvent')
    $('.external-links a').trigger('click')

    expect(GOVUK.analytics.setDimension).toHaveBeenCalledWith(36, 'http://www.nationalarchives.gov.uk')
    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith(
      'External Link Clicked', 'http://www.nationalarchives.gov.uk', {transport: 'beacon', label: 'National Archives'})
  })

  it('does not duplicate the url info if a custom dimension is not provided', function () {
    GOVUK.analyticsPlugins.externalLinkTracker()

    spyOn(GOVUK.analytics, 'setDimension')
    spyOn(GOVUK.analytics, 'trackEvent')
    $('.external-links a').trigger('click')

    expect(GOVUK.analytics.setDimension).not.toHaveBeenCalled()
    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith(
      'External Link Clicked', 'http://www.nationalarchives.gov.uk', {transport: 'beacon', label: 'National Archives'})
  })
})
