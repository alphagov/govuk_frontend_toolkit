describe("selection-buttons", function () {
  describe("RadioButtons", function () {
    var $radioButtons,
        $radioLabels;

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
      $radioButtons = $radioLabels.find('input');
      $(document.body).append($radioLabels);
    });

    afterEach(function () {
      $radioLabels.remove();
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

      it("Should add the focusedClass class to the sent radio", function () {
        GOVUK.RadioButtons.prototype.markFocused.call(radioButtonsMock, $radioButtons.eq(0));

        expect($radioLabels.eq(0).hasClass(radioButtonsMock.focusedClass)).toBe(true);
      });

      it("Should remove the focusedClass class from the radio that previously had focus", function () {
        radioButtonsMock.focused = 'medium';
        $radioLabels.eq(1).addClass(radioButtonsMock.focusedClass);
        GOVUK.RadioButtons.prototype.markFocused.call(radioButtonsMock, $radioButtons.eq(0));

        expect($radioLabels.eq(1).hasClass(radioButtonsMock.focusedClass)).toBe(false);
      });
    });
  });

  describe("CheckboxButtons", function () {
    var $checkboxButtons,
        $checkboxLabels;

    beforeEach(function () {
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
      $checkboxButtons = $checkboxLabels.find('input');
      $(document.body).append($checkboxLabels);
    });

    afterEach(function () {
      $checkboxLabels.remove();
    });

    it("Should create a new instance with the correct interface", function () {
      var buttons = new GOVUK.CheckboxButtons($checkboxButtons);

      expect(buttons.setup).toBeDefined();
      expect(buttons.bindEvents).toBeDefined();
      expect(buttons.markSelected).toBeDefined();
    });

    describe("setup method", function () {
      it("Should add the selectedClass class to the label of a checkbox that is checked", function () {

      });
    });

    describe("bindEvents method", function () {
      it("Should add a click event to each checkbox that fires the markSelected method", function () {

      });

      it("Should add a focus event to each checkbox that fires the markFocused method", function () {

      });
    });
  });
});
