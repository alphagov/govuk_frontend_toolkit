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

  describe('when details element follows the specified structure', function () {
    describe('and when details.polyfill is initialised', function () {
      describe('and when we have native details support', function () {
        beforeEach(function () {
          // Add show/hide content support
          this.detailsPolyfill = GOVUK.details.addDetailsPolyfill()
          GOVUK.details.started = false
        })
        it('should add the aria attributes to summary', function () {
          expect(this.$summary1.attr('role')).toBe('button')
          expect(this.$summary1.attr('aria-controls')).toBe('details-content-0')
          expect(this.$summary1.attr('aria-expanded')).toBe('false')
        })

        it('should add the aria attributes to hidden content', function () {
          expect(this.$hiddenContent1).toBeTruthy()
          expect(this.$hiddenContent1.attr('id')).toBe('details-content-0')
          expect(this.$hiddenContent1.attr('aria-hidden')).toBe('true')
        })

        it('should hide the hidden content visually', function () {
          expect(this.$hiddenContent1.is(':visible')).toBe(false)
        })

        it('should make the hidden content visible if its summary is clicked', function (done) {
          // Initialise again
          this.detailsPolyfill = GOVUK.details.addDetailsPolyfill()

          // Trigger click on summary
          this.$summary1.click()
          expect(this.$content.attr('open')).toBe('open')
          expect(this.$summary1.attr('aria-expanded')).toBe('true')
          expect(this.$hiddenContent1.attr('aria-hidden')).toBe('false')
          expect(this.$hiddenContent1.is(':visible')).toBe(true)

          done()
        })
      })
    })
  })
})
