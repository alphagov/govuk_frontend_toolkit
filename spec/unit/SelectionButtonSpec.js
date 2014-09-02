describe("selection-buttons", function () {
  var $radioButtons,
      $radioLabels,
      $checkboxButtons,
      $checkboxLabels;

  beforeEach(function () {
    $radioLabels = $(
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
    $checkboxLabels = $(
        '<label class="selectable">' +
          'Eggs' +
          '<input id="eggs" name="food" value="eggs" type="checkbox" />' +
        '</label>' +
        '<label class="selectable">' +
          'Bread' +
          '<input id="bread" name="food" value="bread" type="checkbox" />' +
        '</label>' +
        '<label class="selectable">' +
          'Fruit' +
          '<input id="fruit" name="food" value="fruit" type="checkbox" />' +
        '</label>'
    );
    $radioButtons = $radioLabels.find('input');
    $checkboxButtons = $checkboxLabels.find('input');
    $(document.body).append($radioLabels);
    $(document.body).append($checkboxLabels);
  });

  afterEach(function () {
    $radioLabels.remove();
    $checkboxLabels.remove();
  });

  describe("RadioButtons", function () {
    it("Should create a new instance with the correct interface", function () {
      var buttons = new GOVUK.RadioButtons($radioButtons);

      expect(buttons.getSelections).toBeDefined();
      expect(buttons.bindEvents).toBeDefined();
      expect(buttons.markSelected).toBeDefined();
      expect(buttons.markFocused).toBeDefined();
    });

    it("Should set the selectedClass property if sent in as an option", function () {
      var buttons = new GOVUK.RadioButtons($radioButtons, { 'selectedClass' : 'selectable-selected' });

      expect(buttons.selectedClass).toEqual('selectable-selected');
    });

    it("Should set the focusedClass property if sent in as an option", function () {
      var buttons = new GOVUK.RadioButtons($radioButtons, { 'focusedClass' : 'selectable-focused' });

      expect(buttons.focusedClass).toEqual('selectable-focused');
    });

    describe("getSelections method", function () {
      it("Should mark the label of any checked radios as selected", function () {
        var radioButtonsMock = {
              'markSelected' : GOVUK.RadioButtons.prototype.markSelected,
              '$elms' : $radioButtons,
              'selectedClass' : 'selected'
            };

        $radioButtons.eq(0).attr('checked', true);
        spyOn(radioButtonsMock, 'markSelected').andCallThrough();
        GOVUK.RadioButtons.prototype.getSelections.call(radioButtonsMock);
        expect(radioButtonsMock.markSelected).toHaveBeenCalled();
        expect($radioButtons.eq(0).parent('label').hasClass('selected')).toBe(true);
      });
    });

    describe("setEventNames method", function () {
      it("Should set the selectionEvents and focusEvents properties on the instance", function () {
        var radioButtonsMock = {};

        GOVUK.RadioButtons.prototype.setEventNames.call(radioButtonsMock);
        expect(typeof radioButtonsMock.focusEvents !== 'undefined').toBe(true);
        expect(typeof radioButtonsMock.selectionEvents !== 'undefined').toBe(true);
      });
    });

    describe("bindEvents method", function () {
      it("Should bind click and change events to each radio", function () {
        var radioButtonsMock = {
              '$elms' : $radioButtons,
              'selectionEvents' : 'click change',
              'focusEvents' : 'focus blur',
              'markSelected' : function () {},
              'markFocused' : function () {}
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
              'selectionEvents' : 'click change',
              'focusEvents' : 'focus blur',
              'markSelected' : function () {},
              'markFocused' : function () {}
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
                'size' : $radioButtons.eq(1)
              },
              'selectedClass' : 'selected'
            },
            $clickedRadio = $radioButtons.eq(0);

        $radioLabels.eq(1).addClass('selected');
        GOVUK.RadioButtons.prototype.markSelected.call(radioButtonsMock, $clickedRadio);
        expect($('#medium').parent('label').hasClass('selected')).toEqual(false);

      });
    });

    describe("markFocused method", function () {
      var radioButtonsMock = {
            'focused' : false,
            'focusedClass' : 'focused'
          };

      it("Should add the focusedClass class to the sent radio if it is focused", function () {
        GOVUK.RadioButtons.prototype.markFocused.apply(radioButtonsMock, [$radioButtons.eq(0), 'focused']);

        expect($radioLabels.eq(0).hasClass(radioButtonsMock.focusedClass)).toBe(true);
      });

      it("Should remove the focusedClass class from the sent radio if it is blurred", function () {
        $radioLabels.eq(0).addClass(radioButtonsMock.focusedClass);
        GOVUK.RadioButtons.prototype.markFocused.apply(radioButtonsMock, [$radioButtons.eq(0), 'blurred']);

        expect($radioLabels.eq(0).hasClass(radioButtonsMock.focusedClass)).toBe(false);
      });
    });
  });

  describe("CheckboxButtons", function () {
    it("Should create a new instance with the correct interface", function () {
      var buttons = new GOVUK.CheckboxButtons($checkboxButtons);

      expect(buttons.getSelections).toBeDefined();
      expect(buttons.bindEvents).toBeDefined();
      expect(buttons.markSelected).toBeDefined();
      expect(buttons.markFocused).toBeDefined();
    });

    describe("getSelections method", function () {
      it("Should add the selectedClass class to the label of a checkbox that is checked", function () {
        var checkboxButtonsMock = {
              '$elms' : $checkboxButtons,
              'markSelected' : function () {}
            };

        checkboxButtonsMock.$elms.eq(0).attr('checked', true);
        spyOn(checkboxButtonsMock, 'markSelected');
        GOVUK.CheckboxButtons.prototype.getSelections.call(checkboxButtonsMock);
        expect(checkboxButtonsMock.markSelected).toHaveBeenCalled();
      });
    });

    describe("setEventNames method", function () {
      it("Should set the selectionEvents and focusEvents properties on the instance", function () {
        var checkboxButtonsMock = {};

        GOVUK.CheckboxButtons.prototype.setEventNames.call(checkboxButtonsMock);
        expect(typeof checkboxButtonsMock.focusEvents !== 'undefined').toBe(true);
        expect(typeof checkboxButtonsMock.selectionEvents !== 'undefined').toBe(true);
      });
    });

    describe("bindEvents method", function () {
      var checkboxButtonsMock;

      beforeEach(function () {
        checkboxButtonsMock = {
          '$elms' : $checkboxButtons
        };
      });

      it("Should add a click event to each checkbox that fires the markSelected method", function () {
        var eventCalled = false;

        checkboxButtonsMock.markSelected = function () {};
        checkboxButtonsMock.markFocused = function () {};
        checkboxButtonsMock.selectionEvents = 'click';
        checkboxButtonsMock.focusEvents = 'focus blur';
        spyOn(checkboxButtonsMock, 'markSelected');
        spyOn($.fn, 'on').andCallFake(function (evt, func) {
          if (evt === 'click') {
            eventCalled = true;
            callback = func;
          }
          return $.fn;
        });
        $checkboxButtons.eq(0).attr('checked', true);
        GOVUK.CheckboxButtons.prototype.bindEvents.call(checkboxButtonsMock);
        expect(eventCalled).toBe(true);
        callback({ 'target' : $checkboxButtons.eq(0) });
        expect(checkboxButtonsMock.markSelected).toHaveBeenCalled();
      });

      it("Should add focus and blur events to each checkbox that fires the markFocused method", function () {
        var eventCalled = false;

        checkboxButtonsMock.markFocused = function () {};
        checkboxButtonsMock.markSelected = function () {};
        checkboxButtonsMock.selectionEvents = 'click';
        checkboxButtonsMock.focusEvents = 'focus blur';
        spyOn(checkboxButtonsMock, 'markFocused');
        spyOn($.fn, 'on').andCallFake(function (evt, func) {
          if (evt === 'focus blur') {
            eventCalled = true;
            callback = func;
          }
          return $.fn;
        });
        GOVUK.CheckboxButtons.prototype.bindEvents.call(checkboxButtonsMock);
        expect(eventCalled).toBe(true);
        callback({
          'target' : $checkboxButtons.eq(0),
          'type' : 'focus'
        });
        expect(checkboxButtonsMock.markFocused).toHaveBeenCalled();
      });
    });

    describe("markSelected method", function () {
      var checkboxButtonsMock = {
            'selectedClass' : 'selected'
          };

      it("Should add the selectedClass class to a checked checkbox", function () {
        $checkboxButtons.eq(0).attr('checked', true);
        GOVUK.CheckboxButtons.prototype.markSelected.call(checkboxButtonsMock, $checkboxButtons.eq(0));
        expect($checkboxLabels.eq(0).hasClass(checkboxButtonsMock.selectedClass)).toBe(true);
      });

      it("Should remove the selectedClass class from an unchecked checkbox", function () {
        $checkboxButtons.eq(0).addClass(checkboxButtonsMock.selectedClass);
        GOVUK.CheckboxButtons.prototype.markSelected.call(checkboxButtonsMock, $checkboxButtons.eq(0));
        expect($checkboxLabels.eq(0).hasClass(checkboxButtonsMock.selectedClass)).toBe(false);
      });
    });

    describe("markFocused method", function () {
      var checkboxButtonsMock = {
            'focused' : false,
            'focusedClass' : 'focused'
          };

      it("Should add the focusedClass class to the sent radio if it is focused", function () {
        GOVUK.CheckboxButtons.prototype.markFocused.apply(checkboxButtonsMock, [$checkboxButtons.eq(0), 'focused']);

        expect($checkboxLabels.eq(0).hasClass(checkboxButtonsMock.focusedClass)).toBe(true);
      });

      it("Should remove the focusedClass class from the sent radio if it is blurred", function () {
        $checkboxLabels.eq(0).addClass(checkboxButtonsMock.focusedClass);
        GOVUK.CheckboxButtons.prototype.markFocused.apply(checkboxButtonsMock, [$checkboxButtons.eq(0), 'blurred']);

        expect($checkboxLabels.eq(0).hasClass(checkboxButtonsMock.focusedClass)).toBe(false);
      });
    });
  });

  describe("selectionButtons", function () {
    it("Should create an instance of RadioButtons for a set of radios", function () {
      spyOn(GOVUK, 'RadioButtons');
      GOVUK.selectionButtons($radioButtons);
      expect(GOVUK.RadioButtons).toHaveBeenCalled();
    }); 

    it("Should create an instance of CheckboxButtons for a set of checkboxes", function () {
      spyOn(GOVUK, 'CheckboxButtons');
      GOVUK.selectionButtons($checkboxButtons);
      expect(GOVUK.CheckboxButtons).toHaveBeenCalled();
    }); 

    it("Should create instances of RadioButtons and CheckboxButtons for a set containing radios and checkboxes", function () {
      spyOn(GOVUK, 'RadioButtons');
      spyOn(GOVUK, 'CheckboxButtons');
      GOVUK.selectionButtons($checkboxButtons.add($radioButtons));
      expect(GOVUK.RadioButtons).toHaveBeenCalled();
      expect(GOVUK.CheckboxButtons).toHaveBeenCalled();
    }); 
  });
});
