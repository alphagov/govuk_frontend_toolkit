describe('show-hide-content', function () {
  'use strict'

  beforeEach(function () {

    // Sample markup
    this.$content = $(

      // Radio buttons (yes/no)
      '<form>' +
      '<label class="block-label" data-target="show-hide-radios">' +
      '<input type="radio" name="single" value="no">' +
      'Yes' +
      '</label>' +
      '<label class="block-label">' +
      '<input type="radio" name="single" value="yes">' +
      'No' +
      '</label>' +
      '<div id="show-hide-radios" class="panel js-hidden" />' +
      '</form>' +

      // Checkboxes (multiple values)
      '<form>' +
      '<label class="block-label" data-target="show-hide-checkboxes">' +
      '<input type="checkbox" name="multiple[option1]">' +
      'Option 1' +
      '</label>' +
      '<label class="block-label">' +
      '<input type="checkbox" name="multiple[option2]">' +
      'Option 2' +
      '</label>' +
      '<label class="block-label">' +
      '<input type="checkbox" name="multiple[option3]">' +
      'Option 3' +
      '</label>' +
      '<div id="show-hide-checkboxes" class="panel js-hidden" />' +
      '</form>'
    )

    // Find radios/checkboxes
    var $radios = this.$content.find('input[type=radio]')
    var $checkboxes = this.$content.find('input[type=checkbox]')

    // Two radios
    this.$radio1 = $radios.eq(0)
    this.$radio2 = $radios.eq(1)

    // Three checkboxes
    this.$checkbox1 = $checkboxes.eq(0)
    this.$checkbox2 = $checkboxes.eq(1)
    this.$checkbox3 = $checkboxes.eq(2)

    // Add to page
    $(document.body).append(this.$content)

    // Show/Hide content
    this.$radioShowHide = $('#show-hide-radios')
    this.$checkboxShowHide = $('#show-hide-checkboxes')

    // Add show/hide content support
    this.showHideContent = new GOVUK.ShowHideContent()
    this.showHideContent.init()
  })

  afterEach(function () {
    if (this.showHideContent) {
      this.showHideContent.destroy()
    }

    this.$content.remove()
  })

  describe('when this.showHideContent = new GOVUK.ShowHideContent() is called', function () {
    it('should add the aria attributes to inputs with show/hide content', function () {
      expect(this.$radio1.attr('aria-expanded')).toBe('false')
      expect(this.$radio1.attr('aria-controls')).toBe('show-hide-radios')
    })

    it('should add the aria attributes to show/hide content', function () {
      expect(this.$radioShowHide.attr('aria-hidden')).toBe('true')
      expect(this.$radioShowHide.hasClass('js-hidden')).toEqual(true)
    })

    it('should hide the show/hide content visually', function () {
      expect(this.$radioShowHide.hasClass('js-hidden')).toEqual(true)
    })

    it('should do nothing if no radios are checked', function () {
      expect(this.$radio1.attr('aria-expanded')).toBe('false')
      expect(this.$radio2.attr('aria-expanded')).toBe(undefined)
    })

    it('should do nothing if no checkboxes are checked', function () {
      expect(this.$radio1.attr('aria-expanded')).toBe('false')
      expect(this.$radio2.attr('aria-expanded')).toBe(undefined)
    })

    describe('with non-default markup', function () {
      beforeEach(function () {
        this.showHideContent.destroy()
      })

      it('should do nothing if a radio without show/hide content is checked', function () {
        this.$radio2.prop('checked', true)

        // Defaults changed, initialise again
        this.showHideContent = new GOVUK.ShowHideContent().init()
        expect(this.$radio1.attr('aria-expanded')).toBe('false')
        expect(this.$radioShowHide.attr('aria-hidden')).toBe('true')
        expect(this.$radioShowHide.hasClass('js-hidden')).toEqual(true)
      })

      it('should do nothing if a checkbox without show/hide content is checked', function () {
        this.$checkbox2.prop('checked', true)

        // Defaults changed, initialise again
        this.showHideContent = new GOVUK.ShowHideContent().init()
        expect(this.$checkbox1.attr('aria-expanded')).toBe('false')
        expect(this.$checkboxShowHide.attr('aria-hidden')).toBe('true')
        expect(this.$checkboxShowHide.hasClass('js-hidden')).toEqual(true)
      })

      it('should do nothing if checkboxes without show/hide content is checked', function () {
        this.$checkbox2.prop('checked', true)
        this.$checkbox3.prop('checked', true)

        // Defaults changed, initialise again
        this.showHideContent = new GOVUK.ShowHideContent().init()
        expect(this.$checkbox1.attr('aria-expanded')).toBe('false')
        expect(this.$checkboxShowHide.attr('aria-hidden')).toBe('true')
        expect(this.$checkboxShowHide.hasClass('js-hidden')).toEqual(true)
      })

      it('should make the show/hide content visible if its radio is checked', function () {
        this.$radio1.prop('checked', true)

        // Defaults changed, initialise again
        this.showHideContent = new GOVUK.ShowHideContent().init()
        expect(this.$radio1.attr('aria-expanded')).toBe('true')
        expect(this.$radioShowHide.attr('aria-hidden')).toBe('false')
        expect(this.$radioShowHide.hasClass('js-hidden')).toEqual(false)
      })

      it('should make the show/hide content visible if its checkbox is checked', function () {
        this.$checkbox1.prop('checked', true)

        // Defaults changed, initialise again
        this.showHideContent = new GOVUK.ShowHideContent().init()
        expect(this.$checkbox1.attr('aria-expanded')).toBe('true')
        expect(this.$checkboxShowHide.attr('aria-hidden')).toBe('false')
        expect(this.$checkboxShowHide.hasClass('js-hidden')).toEqual(false)
      })
    })

    describe('and a show/hide radio receives a click', function () {
      it('should make the show/hide content visible', function () {
        this.$radio1.click()
        expect(this.$radioShowHide.hasClass('js-hidden')).toEqual(false)
      })

      it('should add the aria attributes to show/hide content', function () {
        this.$radio1.click()
        expect(this.$radio1.attr('aria-expanded')).toBe('true')
        expect(this.$radioShowHide.attr('aria-hidden')).toBe('false')
        expect(this.$radioShowHide.hasClass('js-hidden')).toEqual(false)
      })
    })

    describe('and a show/hide checkbox receives a click', function () {
      it('should make the show/hide content visible', function () {
        this.$checkbox1.click()
        expect(this.$checkboxShowHide.hasClass('js-hidden')).toEqual(false)
      })

      it('should add the aria attributes to show/hide content', function () {
        this.$checkbox1.click()
        expect(this.$checkbox1.attr('aria-expanded')).toBe('true')
        expect(this.$checkboxShowHide.attr('aria-hidden')).toBe('false')
        expect(this.$checkboxShowHide.hasClass('js-hidden')).toEqual(false)
      })
    })

    describe('and a show/hide radio receives a click, but another group radio is clicked afterwards', function () {
      it('should make the show/hide content hidden', function () {
        this.$radio1.click()
        this.$radio2.click()
        expect(this.$radioShowHide.hasClass('js-hidden')).toEqual(true)
      })

      it('should add the aria attributes to show/hide content', function () {
        this.$radio1.click()
        this.$radio2.click()
        expect(this.$radio1.attr('aria-expanded')).toBe('false')
        expect(this.$radioShowHide.attr('aria-hidden')).toBe('true')
      })
    })

    describe('and a show/hide checkbox receives a click, but another checkbox is clicked afterwards', function () {
      it('should keep the show/hide content visible', function () {
        this.$checkbox1.click()
        this.$checkbox2.click()
        expect(this.$checkboxShowHide.hasClass('js-hidden')).toEqual(false)
      })

      it('should keep the aria attributes to show/hide content', function () {
        this.$checkbox1.click()
        this.$checkbox2.click()
        expect(this.$checkbox1.attr('aria-expanded')).toBe('true')
        expect(this.$checkboxShowHide.attr('aria-hidden')).toBe('false')
      })
    })
  })

  describe('before this.showHideContent.destroy() is called', function () {
    it('document.body should have show/hide event handlers', function () {
      var events = $._data(document.body, 'events')
      expect(events && events.click).toContain(jasmine.objectContaining({
        namespace: 'ShowHideContent',
        selector: 'input[type="radio"][name="single"]'
      }))
      expect(events && events.click).toContain(jasmine.objectContaining({
        namespace: 'ShowHideContent',
        selector: '.block-label[data-target] input[type="checkbox"]'
      }))
    })
  })

  describe('when this.showHideContent.destroy() is called', function () {
    beforeEach(function () {
      this.showHideContent.destroy()
    })

    it('should have no show/hide event handlers', function () {
      var events = $._data(document.body, 'events')
      expect(events && events.click).not.toContain(jasmine.objectContaining({
        namespace: 'ShowHideContent',
        selector: 'input[type="radio"][name="single"]'
      }))
      expect(events && events.click).not.toContain(jasmine.objectContaining({
        namespace: 'ShowHideContent',
        selector: '.block-label[data-target] input[type="checkbox"]'
      }))
    })
  })
})
