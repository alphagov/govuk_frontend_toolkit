/* global describe it expect beforeEach afterEach */

var $ = window.jQuery

describe('shim-links-with-button-role', function () {
  'use strict'
  var GOVUK = window.GOVUK

  var $buttonLink
  var keyDownEvent

  beforeEach(function () {
    $buttonLink = $('<a role="button">Button</a>')
    $buttonLink.on('click', function () {
      $buttonLink.addClass('clicked')
    })
    $(document.body).append($buttonLink)
    keyDownEvent = $.Event('keydown')
    keyDownEvent.target = $buttonLink.get(0)
    GOVUK.shimLinksWithButtonRole.init()
  })

  afterEach(function () {
    $buttonLink.remove()
    $(document).off('keyup')
  })

  it('should trigger event on space', function () {
    // Ideally we’d test the page loading functionality but that seems hard to
    // do within a Jasmine context. Settle for checking a bound event trigger.
    keyDownEvent.which = 32 // Space character
    $(document).trigger(keyDownEvent)
    expect($buttonLink.hasClass('clicked')).toBe(true)
  })

  it('should not trigger event on tab', function () {
    keyDownEvent.which = 9 // Tab character
    $(document).trigger(keyDownEvent)
    expect($buttonLink.hasClass('clicked')).toBe(false)
  })
})
