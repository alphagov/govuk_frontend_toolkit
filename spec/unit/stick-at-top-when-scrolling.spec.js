/* global describe it expect beforeEach afterEach */

var $ = window.jQuery

describe('stick-at-top-when-scrolling', function () {
  'use strict'
  var GOVUK = window.GOVUK

  var $stickyElement
  var $stickyWrapper

  beforeEach(function () {
    $stickyElement = $('<div class="stick-at-top-when-scrolling"></div>')
    $stickyWrapper = $('<div>').append($stickyElement)

    $('body').append($stickyWrapper)
  })

  afterEach(function () {
    $stickyWrapper.remove()
  })

  describe('when stick is called', function () {
    it('should add fixed class on stick', function () {
      expect(!$stickyElement.hasClass('content-fixed')).toBe(true)
      GOVUK.stickAtTopWhenScrolling.stick($stickyElement)
      expect($stickyElement.hasClass('content-fixed')).toBe(true)
    })

    it('should insert shim when sticking the element', function () {
      expect($('.shim').length).toBe(0)
      GOVUK.stickAtTopWhenScrolling.stick($stickyElement)
      expect($('.shim').length).toBe(1)
    })

    it('should insert shim with minimum height', function () {
      GOVUK.stickAtTopWhenScrolling.stick($stickyElement)
      expect($('.shim').height()).toBe(1)
    })
  })

  describe('when release is called', function () {
    it('should remove fixed class', function () {
      $stickyElement.addClass('content-fixed')
      GOVUK.stickAtTopWhenScrolling.release($stickyElement)
      expect($stickyElement.hasClass('content-fixed')).toBe(false)
    })

    it('should remove the shim', function () {
      $stickyElement = $('<div class="stick-at-top-when-scrolling content-fixed"></div>')
      GOVUK.stickAtTopWhenScrolling.release($stickyElement)
      expect($('.shim').length).toBe(0)
    })
  })

  describe('for larger screens (>768px)', function () {
    beforeEach(function () {
      GOVUK.stickAtTopWhenScrolling.getWindowPositions = function () {
        return {
          scrollTop: 300
        }
      }
      GOVUK.stickAtTopWhenScrolling.getElementOffset = function () {
        return {
          top: 300
        }
      }
      GOVUK.stickAtTopWhenScrolling.getWindowDimensions = function () {
        return {
          height: 768,
          width: 769
        }
      }
      GOVUK.stickAtTopWhenScrolling.$els = $stickyElement
      GOVUK.stickAtTopWhenScrolling._hasScrolled = true
      GOVUK.stickAtTopWhenScrolling.checkScroll()
    })

    it('should stick, if the scroll position is past the element position', function () {
      expect($stickyElement.hasClass('content-fixed')).toBe(true)
    })

    it('should unstick, if the scroll position is less than the point at which scrolling started', function () {
      GOVUK.stickAtTopWhenScrolling.getWindowPositions = function () {
        return {
          scrollTop: 0
        }
      }
      GOVUK.stickAtTopWhenScrolling.$els = $stickyElement
      GOVUK.stickAtTopWhenScrolling._hasScrolled = true
      GOVUK.stickAtTopWhenScrolling.checkScroll()
      expect($stickyElement.hasClass('content-fixed')).toBe(false)
    })
  })

  describe('for smaller screens (<=768px)', function () {
    beforeEach(function () {
      GOVUK.stickAtTopWhenScrolling.getWindowDimensions = function () {
        return {
          height: 768,
          width: 767
        }
      }
      GOVUK.stickAtTopWhenScrolling.getElementOffset = function () {
        return {
          top: 300
        }
      }
      GOVUK.stickAtTopWhenScrolling.$els = $stickyElement
      GOVUK.stickAtTopWhenScrolling._hasScrolled = true
      GOVUK.stickAtTopWhenScrolling.checkScroll()
    })

    it('should unstick the element', function () {
      expect($stickyElement.hasClass('content-fixed')).toBe(false)
    })
  })
})
