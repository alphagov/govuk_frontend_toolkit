describe('GOVUK Modules', function() {
  "use strict";
  var GOVUK = window.GOVUK;

  it('finds modules', function() {
    var module = $('<div data-module="a-module"></div>');
    $('body').append(module);

    expect(GOVUK.modules.find().length).toBe(1);
    expect(GOVUK.modules.find().eq(0).is('[data-module="a-module"]')).toBe(true);
    module.remove();
  });

  it('finds modules in a container', function() {
    var module = $('<div data-module="a-module"></div>'),
        container = $('<div></div>').append(module);

    expect(GOVUK.modules.find(container).length).toBe(1);
    expect(GOVUK.modules.find(container).eq(0).data('module')).toBe('a-module');
  });

  it('finds modules that are a container', function() {
    var module = $('<div data-module="a-module"></div>'),
        container = $('<div data-module="container-module"></div>').append(module);

    expect(GOVUK.modules.find(container).length).toBe(2);
    expect(GOVUK.modules.find(container).eq(0).data('module')).toBe('container-module');
    expect(GOVUK.modules.find(container).eq(1).data('module')).toBe('a-module');
  });

  describe('when a module exists', function() {
    var callback;

    beforeEach(function() {
      callback = jasmine.createSpy();
      GOVUK.Modules.TestAlertModule = function() {
        var that = this;
        that.start = function(element) {
          callback(element);
        }
      };
    });

    afterEach(function() {
      delete GOVUK.Modules.TestAlertModule;
    });

    it('starts modules within a container', function() {
      var module = $('<div data-module="test-alert-module"></div>'),
          container = $('<div></div>').append(module);

      GOVUK.modules.start(container);
      expect(callback).toHaveBeenCalled();
    });

    it('does not start modules that are already started', function() {
      var module = $('<div data-module="test-alert-module"></div>'),
          container = $('<div></div>').append(module);

      GOVUK.modules.start(module);
      GOVUK.modules.start(module);
      expect(callback.calls.count()).toBe(1);
    });

    it('passes the HTML element to the module\'s start method', function() {
      var module = $('<div data-module="test-alert-module"></div>'),
          container = $('<h1></h1>').append(module);

      GOVUK.modules.start(container);

      var args = callback.calls.argsFor(0);
      expect(args[0].is('div[data-module="test-alert-module"]')).toBe(true);
    });

    it('starts all modules that are on the page', function() {
      var modules = $(
            '<div data-module="test-alert-module"></div>\
             <strong data-module="test-alert-module"></strong>\
             <span data-module="test-alert-module"></span>'
          );

      $('body').append(modules);
      GOVUK.modules.start();
      expect(callback.calls.count()).toBe(3);

      modules.remove();
    });
  });
});
