describe("radio-buttons", function () {
  var $radioButtons,
      $labels;

  beforeEach(function () {
    $labels = $(
        '<label class="selectable">' +
          'Small' +
          '<input type="radio" name="size" id="small" value="small" />' +
        '</label>' +
        '<label class="selectable">' +
          'Medium' +
          '<input type="radio" name="size" id="medium" value="medium" />' +
        '</label>' +
        '<label class="selectable">' +
          'Large' +
          '<input type="radio" name="size" id="large" value="large" />' +
        '</label>'
    );
    $radioButtons = $labels.find('input');
    $(document.body).append($labels);
  });

  afterEach(function () {
    $labels.remove();
  });

  it("Should create a new instance with the correct interface", function () {
    var buttons = new GOVUK.RadioButtons($radioButtons);

    expect(buttons.setup).toBeDefined();
    expect(buttons.bindEvents).toBeDefined();
    expect(buttons.markSelected).toBeDefined();
  });

  it("Should set the selectedClass property if sent in as an option", function () {
    var buttons = new GOVUK.RadioButtons($radioButtons, { 'selectedClass' : 'selectable-selected' });

    expect(buttons.selectedClass).toEqual('selectable-selected');
  });

  it("Should set the focusedClass property if sent in as an option", function () {
    var buttons = new GOVUK.RadioButtons($radioButtons, { 'focusedClass' : 'selectable-focused' });

    expect(buttons.focusedClass).toEqual('selectable-focused');
  });

  describe("setup method", function () {
    it("Should mark the label of any checked radios as selected", function () {
      var radioButtonsMock = {
            'markSelected' : function () {},
            '$elms' : $radioButtons
          };

      $radioButtons.eq(0).attr('checked', true);
      spyOn(radioButtonsMock, 'markSelected');
      GOVUK.RadioButtons.prototype.setup.call(radioButtonsMock);
      expect(radioButtonsMock.markSelected).toHaveBeenCalled();
    });
  });

  describe("bindEvents method", function () {
    it("Should bind click and change events to each radio", function () {
      var radioButtonsMock = {
            '$elms' : $radioButtons
          },
          eventsBound = false;

      spyOn($.fn, 'on').andCallFake(function (evt, func) {
        if (evt === 'click change') {
          eventsBound = true;
        }
        return $.fn;
      });
      expect($.fn.on.calls.length).toEqual(0);
      GOVUK.RadioButtons.prototype.bindEvents.call(radioButtonsMock);
      expect($.fn.on).toHaveBeenCalled();
      expect(eventsBound).toEqual(true);
    });

    it("Should call the markSelected method on any checked radio that's the target of an event", function () {
      var radioButtonsMock = {
            '$elms' : $radioButtons,
            'markSelected' : function () {}
            },
          eventsBound = false;

      spyOn($.fn, 'on').andCallFake(function (evt, func) {
        if (evt === 'click change') {
          callback = func;
        }
        return $.fn;
      });
      spyOn(radioButtonsMock, 'markSelected');
      radioButtonsMock.$elms.eq(0).attr('checked', true);
      GOVUK.RadioButtons.prototype.bindEvents.call(radioButtonsMock);
      callback({ 'target' : radioButtonsMock.$elms[0] });
      expect(radioButtonsMock.markSelected).toHaveBeenCalled();
    });
  });

  describe("markSelected method", function () {
    it("Should add the selectedClass class to the label of the sent in radio", function () {
      var radioButtonsMock = {
            'selections' : {
              'size' : false
            },
            'selectedClass' : 'selected'
          },
          $clickedRadio = $radioButtons.eq(0);

      GOVUK.RadioButtons.prototype.markSelected.call(radioButtonsMock, $clickedRadio);
      expect($clickedRadio.parent('label').hasClass('selected')).toEqual(true);
    });

    it("Should remove the selectedClass class from the label of the previously selected radio", function () {
      var radioButtonsMock = {
            'selections' : {
              'size' : 'medium'
            },
            'selectedClass' : 'selected'
          },
          $clickedRadio = $radioButtons.eq(0);

      $labels.eq(1).addClass('selected');
      GOVUK.RadioButtons.prototype.markSelected.call(radioButtonsMock, $clickedRadio);
      expect($('#medium').parent('label').hasClass('selected')).toEqual(false);

    });
  });

  describe("markFocused method", function () {
    var radioButtonsMock = {
          'focused' : false,
          'focusedClass' : 'focused'
        };

    it("Should add the focusedClass class to the sent radio", function () {
      GOVUK.RadioButtons.prototype.markFocused.call(radioButtonsMock, $radioButtons.eq(0));

      expect($labels.eq(0).hasClass(radioButtonsMock.focusedClass)).toBe(true);
    });

    it("Should remove the focusedClass class from the radio that previously had focus", function () {
      radioButtonsMock.focused = 'medium';
      $labels.eq(1).addClass(radioButtonsMock.focusedClass);
      GOVUK.RadioButtons.prototype.markFocused.call(radioButtonsMock, $radioButtons.eq(0));

      expect($labels.eq(1).hasClass(radioButtonsMock.focusedClass)).toBe(false);
    });
  });
});
