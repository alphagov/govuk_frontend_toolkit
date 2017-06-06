/* global describe it expect beforeEach afterEach spyOn */

var $ = window.jQuery

describe('GOVUK.analyticsPlugins.breadcrumbLinkTracker', function () {
  'use strict'
  var GOVUK = window.GOVUK

  var $links

  beforeEach(function () {
    $links = $(
      '<div class="govuk-breadcrumbs">' +
        '<ol>' +
          '<li>' +
              '<a href="/">Home</a>' +
          '</li>' +
          '<li>' +
              '<a href="/browse/benefits">Benefits</a>' +
          '</li>' +
          '<li>' +
              '<a href="/browse/benefits/entitlement">Benefits entitlement</a>' +
          '</li>' +
        '</ol>' +
      '</div>' +
      '<div class="other-links">' +
        '<a href="/another-link">Another link</a>' +
      '</div>'
    )

    $('html').on('click', function (evt) { evt.preventDefault() })
    $('body').append($links)
    GOVUK.analytics = {
      setDimension: function () {},
      trackEvent: function () {}
    }
    GOVUK.analyticsPlugins.breadcrumbLinkTracker({selector: '.govuk-breadcrumbs a'})
  })

  afterEach(function () {
    $('html').off()
    $('body').off()
    $links.remove()
    delete GOVUK.analytics
  })

  it('listens to clicks on links that match the selector', function () {
    spyOn(GOVUK.analytics, 'trackEvent')
    spyOn(GOVUK.analytics, 'setDimension')

    $('.govuk-breadcrumbs a').each(function () {
      $(this).trigger('click')
      expect(GOVUK.analytics.setDimension).toHaveBeenCalled()
      expect(GOVUK.analytics.trackEvent).toHaveBeenCalled()
      GOVUK.analytics.trackEvent.calls.reset()
      GOVUK.analytics.setDimension.calls.reset()
    })

    $('.other-links a').each(function () {
      $(this).trigger('click')
      expect(GOVUK.analytics.trackEvent).not.toHaveBeenCalled()
      GOVUK.analytics.trackEvent.calls.reset()
    })
  })

  it('sets the dimension with the link text and sends a track event', function() {
    spyOn(GOVUK.analytics, 'trackEvent')
    spyOn(GOVUK.analytics, 'setDimension')
    spyOn(window.location.pathname, '/benefit-cap'

    var homeLink = $('.govuk-breadcrumbs a').first()
    homeLink.trigger('click')

    expect(GOVUK.analytics.setDimension).toHaveBeenCalledWith(12345, 'Home')
    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith(
      'breadcrumbClicked',
      1,
      {
        page: '/benefit-cap',
        label: '/',
        transport: 'beacon'
      }
    )

    GOVUK.analytics.trackEvent.calls.reset()
    GOVUK.analytics.setDimension.calls.reset()
  })
})
