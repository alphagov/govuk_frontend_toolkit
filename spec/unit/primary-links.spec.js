/* global describe it expect beforeEach spyOn */

var $ = window.jQuery

describe('primary-links', function () {
  'use strict'
  var GOVUK = window.GOVUK

  var shortList, mediumList

  beforeEach(function () {
    shortList = $('<ul><li class="primary">one</li><li>two</li></ul>')
    mediumList = $('<ul><li class="primary">one</li><li>two</li><li>three</li></ul>')
  })

  it('visually hides extra links', function () {
    new GOVUK.PrimaryList(mediumList, '.primary')

    expect(mediumList.find('.visuallyhidden').length).toBe(2)
  })

  it('creates appropriate toggle text', function () {
    var short = new GOVUK.PrimaryList(shortList, '.primary')
    var medium = new GOVUK.PrimaryList(mediumList, '.primary')

    expect(short.toggleText()).toEqual('+1 other')
    expect(medium.toggleText()).toEqual('+2 others')
  })

  it('add a toggle link', function () {
    var container = $('<div>').append(mediumList)
    new GOVUK.PrimaryList(mediumList, '.primary')

    expect(container.find('a').length).toBe(1)
  })

  it('show extra links when toggled', function () {
    var list = new GOVUK.PrimaryList(mediumList, '.primary')
    var event = { preventDefault: function () {} }
    spyOn(event, 'preventDefault')
    spyOn(list, 'showExtraLinks')

    list.toggleLinks(event)
    expect(event.preventDefault).toHaveBeenCalled()
    expect(list.showExtraLinks).toHaveBeenCalled()
  })

  it('only adds toggle if more than one extra link', function () {
    new GOVUK.PrimaryList(shortList, '.primary')
    new GOVUK.PrimaryList(mediumList, '.primary')

    expect(shortList.find('.visuallyhidden').length).toBe(0)
    expect(mediumList.find('.visuallyhidden').length).toBe(2)
  })
})
