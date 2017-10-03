/* global describe it expect beforeEach afterEach */

var $ = window.jQuery

describe('details-polyfill', function () {
  'use strict'
  var GOVUK = window.GOVUK

  beforeEach(function (done) {
    // Sample markup
    this.$content = $(
      '<details>' +
      '<summary><span class="summary">Summary</span></summary>' +
      '<div><p>Hidden content</p></div>' +
      '</details>'
    )

    // Find elements
    var $summaries = this.$content.find('summary')
    var $hiddenContent = this.$content.find('div')

    this.$summary1 = $summaries.eq(0)
    this.$hiddenContent1 = $hiddenContent.eq(0)

    // Add to page
    $(document.body).append(this.$content)

    setTimeout(function () {
      done()
    }, 1)
  })

  afterEach(function () {
    this.detailsPolyfill = null
    this.$content.remove()
  })

  describe('When the polyfill is initialised', function () {
    beforeEach(function () {
      // Initialise detailsPolyfill
      this.detailsPolyfill = GOVUK.details.addDetailsPolyfill()
      GOVUK.details.started = false
    })
    it('should add to summary the button role', function () {
      expect(this.$summary1.attr('role')).toBe('button')
    })

    it('should set the element controlled by the summary using aria-controls', function () {
      expect(this.$summary1.attr('aria-controls')).toBe('details-content-0')
    })

    it('should set the expanded state of the summary to false using aria-expanded', function () {
      expect(this.$summary1.attr('aria-expanded')).toBe('false')
    })

    it('should add a unique id to the hidden content in order to be controlled by the summary', function () {
      expect(this.$hiddenContent1.attr('id')).toBe('details-content-0')
    })

    it('should present the content as hidden using aria-hidden', function () {
      expect(this.$hiddenContent1.attr('aria-hidden')).toBe('true')
    })

    it('should visually hide the content', function () {
      expect(this.$hiddenContent1.is(':visible')).toBe(false)
    })

    describe('and when summary is clicked', function () {
      beforeEach(function () {
        // Trigger click on summary
        this.$summary1.click()
      })

      it('should indicate the expanded state of the summary using aria-expanded', function () {
        expect(this.$summary1.attr('aria-expanded')).toBe('true')
      })

      it('should make the content visible', function () {
        expect(this.$hiddenContent1.is(':visible')).toBe(true)
      })

      it('should indicate the visible state of the content using aria-hidden', function () {
        expect(this.$hiddenContent1.attr('aria-hidden')).toBe('false')
      })

      it('should indicate the open state of the content', function () {
        expect(this.$content.attr('open')).toBe('open')
      })
    })
  })
})
