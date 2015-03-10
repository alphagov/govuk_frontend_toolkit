describe("selection-buttons", function () {
  var $radioButtons,
      $radioLabels,
      $checkboxButtons,
      $checkboxLabels,
      buttonsInstance;

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
    $radioForm = $('<form action="" method="post" />');
    $checkboxForm = $('<form action="" method="post" />');
    $content = $('<div id="content" />');
    $radioForm.append($radioLabels);
    $checkboxForm.append($checkboxLabels);
    $content.append($radioForm);
    $content.append($checkboxForm);
    $(document.body).append($content);
  });

  afterEach(function () {
    $content.remove();
  });

  describe("When buttonsInstance = new GOVUK.SelectionButtons is called with a jQuery object", function () {
    describe("When that object contains only radio inputs", function () {
      describe("At the point it is called", function () {
        it("Should do nothing if no radios are checked", function () {
          buttonsInstance = new GOVUK.SelectionButtons($radioButtons);
          expect($radioLabels.eq(0).hasClass('selected')).toBe(false);
          expect($radioLabels.eq(1).hasClass('selected')).toBe(false);
          expect($radioLabels.eq(2).hasClass('selected')).toBe(false);
        });

        it("Should mark checked radios with the selected class", function () {
          $radioButtons.eq(0).attr('checked', true);
          buttonsInstance = new GOVUK.SelectionButtons($radioButtons);
          expect($radioLabels.eq(0).hasClass('selected')).toBe(true);
        });

        it("Should mark checked radios with the custom selected class if given", function () {
          $radioButtons.eq(0).attr('checked', true);
          buttonsInstance = new GOVUK.SelectionButtons($radioButtons, { 'selectedClass' : 'selectable-selected' });
          expect($radioLabels.eq(0).hasClass('selectable-selected')).toBe(true);
        });
      });

      describe("If one of those radios receives focus", function () {
        it("Should add the focused class to that radio", function () {
          buttonsInstance = new GOVUK.SelectionButtons($radioButtons);
          $radioButtons.eq(0).focus();
          expect($radioLabels.eq(0).hasClass('focused')).toBe(true);
        });

        it("Should add a custom focused class to that radio if specified as an option", function () {
          buttonsInstance = new GOVUK.SelectionButtons($radioButtons, { 'focusedClass' : 'selectable-focused' });
          $radioButtons.eq(0).focus();
          expect($radioLabels.eq(0).hasClass('selectable-focused')).toBe(true);
        });
      });

      describe("If one of those radios loses focus", function () {
        it("Should remove the focused class from that radio", function () {
          buttonsInstance = new GOVUK.SelectionButtons($radioButtons);
          $radioButtons.eq(0).focus();
          expect($radioLabels.eq(0).hasClass('focused')).toBe(true);
          $radioButtons.eq(0).blur();
          expect($radioLabels.eq(0).hasClass('focused')).toBe(false);
        });

        it("Should add a custom focused class to that radio if specified as an option", function () {
          buttonsInstance = new GOVUK.SelectionButtons($radioButtons, { 'focusedClass' : 'selectable-focused' });
          $radioButtons.eq(0).focus();
          expect($radioLabels.eq(0).hasClass('selectable-focused')).toBe(true);
          $radioButtons.eq(0).blur();
          expect($radioLabels.eq(0).hasClass('selectable-focused')).toBe(false);
        });
      });

      describe("If one of those radios is clicked", function () {
        it("Should mark that radio with the selected class", function () {
          buttonsInstance = new GOVUK.SelectionButtons($radioButtons);
          $radioButtons.eq(0)
            .attr('checked', true)
            .trigger('click');
          expect($radioLabels.eq(0).hasClass('selected')).toBe(true);
        });

        it("Should remove the selected class from all other radios", function () {
          buttonsInstance = new GOVUK.SelectionButtons($radioButtons);
          $radioLabels.eq(1).addClass('selected');
          $radioButtons.eq(0)
            .attr('checked', true)
            .trigger('click');
          expect($radioLabels.eq(2).hasClass('selected')).toBe(false);
        });
      });
    });

    describe("When that object contains only checkbox inputs", function () {
      describe("At the point it is called", function () {
        it("Should do nothing if no checkboxes are checked", function () {
          buttonsInstance = new GOVUK.SelectionButtons($checkboxButtons);
          expect($checkboxLabels.eq(0).hasClass('selected')).toBe(false);
          expect($checkboxLabels.eq(1).hasClass('selected')).toBe(false);
          expect($checkboxLabels.eq(2).hasClass('selected')).toBe(false);
        });

        it("Should mark checked checkboxes with the selected class", function () {
          $checkboxButtons.eq(0).attr('checked', true);
          buttonsInstance = new GOVUK.SelectionButtons($checkboxButtons);
          expect($checkboxLabels.eq(0).hasClass('selected')).toBe(true);
        });

        it("Should mark all checked checkboxes with the selected class if there are more than one", function () {
          $checkboxButtons.eq(0).attr('checked', true);
          $checkboxButtons.eq(1).attr('checked', true);
          buttonsInstance = new GOVUK.SelectionButtons($checkboxButtons);
          expect($checkboxLabels.eq(0).hasClass('selected')).toBe(true);
          expect($checkboxLabels.eq(1).hasClass('selected')).toBe(true);
        });

        it("Should mark checked checkboxes with the custom selected class if given", function () {
          $checkboxButtons.eq(0).attr('checked', true);
          buttonsInstance = new GOVUK.SelectionButtons($checkboxButtons, { 'selectedClass' : 'selectable-selected' });
          expect($checkboxLabels.eq(0).hasClass('selectable-selected')).toBe(true);
        });
      });

      describe("If one of those checkboxes receives focus", function () {
        it("Should add the focused class to that checkbox", function () {
          buttonsInstance = new GOVUK.SelectionButtons($checkboxButtons);
          $checkboxButtons.eq(0).focus();
          expect($checkboxLabels.eq(0).hasClass('focused')).toBe(true);
        });

        it("Should add a custom focused class to that checkbox if specified as an option", function () {
          buttonsInstance = new GOVUK.SelectionButtons($checkboxButtons, { 'focusedClass' : 'selectable-focused' });
          $checkboxButtons.eq(0).focus();
          expect($checkboxLabels.eq(0).hasClass('selectable-focused')).toBe(true);
        });
      });

      describe("If one of those checkboxes loses focus", function () {
        it("Should add the focused class to that checkbox", function () {
          buttonsInstance = new GOVUK.SelectionButtons($checkboxButtons);
          $checkboxButtons.eq(0).focus();
          expect($checkboxLabels.eq(0).hasClass('focused')).toBe(true);
          $checkboxButtons.eq(0).blur();
          expect($checkboxLabels.eq(0).hasClass('focused')).toBe(false);
        });

        it("Should add a custom focused class to that checkbox if specified as an option", function () {
          buttonsInstance = new GOVUK.SelectionButtons($checkboxButtons, { 'focusedClass' : 'selectable-focused' });
          $checkboxButtons.eq(0).focus();
          expect($checkboxLabels.eq(0).hasClass('selectable-focused')).toBe(true);
          $checkboxButtons.eq(0).blur();
          expect($checkboxLabels.eq(0).hasClass('selectable-focused')).toBe(false);
        });
      });

      describe("If one of those checkboxes is clicked", function () {
        it("Should add the selected class to that checkbox", function () {
          buttonsInstance = new GOVUK.SelectionButtons($checkboxButtons);
          $checkboxButtons.eq(0)
            .attr('checked', true)
            .trigger('click');
          expect($checkboxLabels.eq(0).hasClass('selected')).toBe(true);
        });

        it("Should add the selected class to that checkbox", function () {
          buttonsInstance = new GOVUK.SelectionButtons($checkboxButtons, { 'selectedClass' : 'selectable-selected' });
          $checkboxButtons.eq(0)
            .attr('checked', true)
            .trigger('click');
          expect($checkboxLabels.eq(0).hasClass('selectable-selected')).toBe(true);
        });
      });
    });

    describe("When that object contains a mixture of checkbox and radio inputs", function () {
      var $mixedButtons;

      beforeEach(function () {
        $mixedButtons = $checkboxButtons.add($radioButtons);
      });

      describe("At the point it is called", function () {
        it("Should do nothing if no checkboxes or radios are checked", function () {
          buttonsInstance = new GOVUK.SelectionButtons($mixedButtons);
          expect($checkboxLabels.eq(0).hasClass('selected')).toBe(false);
          expect($checkboxLabels.eq(1).hasClass('selected')).toBe(false);
          expect($checkboxLabels.eq(2).hasClass('selected')).toBe(false);
          expect($radioLabels.eq(0).hasClass('selected')).toBe(false);
          expect($radioLabels.eq(1).hasClass('selected')).toBe(false);
          expect($radioLabels.eq(2).hasClass('selected')).toBe(false);
        });

        it("Should mark checked checkboxes or radios with the selected class", function () {
          $mixedButtons.eq(0).attr('checked', true);
          $mixedButtons.eq(3).attr('checked', true);

          buttonsInstance = new GOVUK.SelectionButtons($mixedButtons);
          expect($checkboxLabels.eq(0).hasClass('selected')).toBe(true);
          expect($radioLabels.eq(0).hasClass('selected')).toBe(true);
        });

        it("Should mark checked checkboxes or radios with the custom selected class if given", function () {
          $mixedButtons.eq(0).attr('checked', true);
          $mixedButtons.eq(3).attr('checked', true);

          buttonsInstance = new GOVUK.SelectionButtons($mixedButtons, { 'selectedClass' : 'selectable-selected' });
          expect($checkboxLabels.eq(0).hasClass('selectable-selected')).toBe(true);
          expect($radioLabels.eq(0).hasClass('selectable-selected')).toBe(true);
        });
      });

      describe("If a checkbox in the set receives focus", function () {
        it("Should add the focused class to that checkbox", function () {
          buttonsInstance = new GOVUK.SelectionButtons($mixedButtons);
          $checkboxButtons.eq(0).focus();
          expect($checkboxLabels.eq(0).hasClass('focused')).toBe(true);
        });

        it("Should add a custom focused class to that checkbox if specified as an option", function () {
          buttonsInstance = new GOVUK.SelectionButtons($mixedButtons, { 'focusedClass' : 'selectable-focused' });
          $checkboxButtons.eq(0).focus();
          expect($checkboxLabels.eq(0).hasClass('selectable-focused')).toBe(true);
        });
      });

      describe("If a checkbox in the set loses focus", function () {
        it("Should add the focused class to that checkbox", function () {
          buttonsInstance = new GOVUK.SelectionButtons($mixedButtons);
          $checkboxButtons.eq(0).focus();
          expect($checkboxLabels.eq(0).hasClass('focused')).toBe(true);
          $checkboxButtons.eq(0).blur();
          expect($checkboxLabels.eq(0).hasClass('focused')).toBe(false);
        });

        it("Should add a custom focused class to that checkbox if specified as an option", function () {
          buttonsInstance = new GOVUK.SelectionButtons($mixedButtons, { 'focusedClass' : 'selectable-focused' });
          $checkboxButtons.eq(0).focus();
          expect($checkboxLabels.eq(0).hasClass('selectable-focused')).toBe(true);
          $checkboxButtons.eq(0).blur();
          expect($checkboxLabels.eq(0).hasClass('selectable-focused')).toBe(false);
        });
      });

      describe("If one of those checkboxes is clicked", function () {
        it("Should add the selected class to that checkbox", function () {
          buttonsInstance = new GOVUK.SelectionButtons($mixedButtons);
          $checkboxButtons.eq(0)
            .attr('checked', true)
            .trigger('click');
          expect($checkboxLabels.eq(0).hasClass('selected')).toBe(true);
        });

        it("Should add the selected class to that checkbox", function () {
          buttonsInstance = new GOVUK.SelectionButtons($mixedButtons, { 'selectedClass' : 'selectable-selected' });
          $checkboxButtons.eq(0)
            .attr('checked', true)
            .trigger('click');
          expect($checkboxLabels.eq(0).hasClass('selectable-selected')).toBe(true);
        });
      });

      describe("If a radio in the set receives focus", function () {
        it("Should add the focused class to that radio", function () {
          buttonsInstance = new GOVUK.SelectionButtons($mixedButtons);
          $radioButtons.eq(0).focus();
          expect($radioLabels.eq(0).hasClass('focused')).toBe(true);
        });

        it("Should add a custom focused class to that radio if specified as an option", function () {
          buttonsInstance = new GOVUK.SelectionButtons($mixedButtons, { 'focusedClass' : 'selectable-focused' });
          $radioButtons.eq(0).focus();
          expect($radioLabels.eq(0).hasClass('selectable-focused')).toBe(true);
        });
      });

      describe("If a radio in the set loses focus", function () {
        it("Should remove the focused class from that radio", function () {
          buttonsInstance = new GOVUK.SelectionButtons($mixedButtons);
          $radioButtons.eq(0).focus();
          expect($radioLabels.eq(0).hasClass('focused')).toBe(true);
          $radioButtons.eq(0).blur();
          expect($radioLabels.eq(0).hasClass('focused')).toBe(false);
        });

        it("Should add a custom focused class to that radio if specified as an option", function () {
          buttonsInstance = new GOVUK.SelectionButtons($mixedButtons, { 'focusedClass' : 'selectable-focused' });
          $radioButtons.eq(0).focus();
          expect($radioLabels.eq(0).hasClass('selectable-focused')).toBe(true);
          $radioButtons.eq(0).blur();
          expect($radioLabels.eq(0).hasClass('selectable-focused')).toBe(false);
        });
      });

      describe("If a radio in the set is clicked", function () {
        it("Should mark that radio with the selected class", function () {
          buttonsInstance = new GOVUK.SelectionButtons($mixedButtons);
          $radioButtons.eq(0)
            .attr('checked', true)
            .trigger('click');
          expect($radioLabels.eq(0).hasClass('selected')).toBe(true);
        });

        it("Should remove the selected class from all other radios", function () {
          buttonsInstance = new GOVUK.SelectionButtons($mixedButtons);
          $radioLabels.eq(1).addClass('selected');
          $radioButtons.eq(0)
            .attr('checked', true)
            .trigger('click');
          expect($radioLabels.eq(2).hasClass('selected')).toBe(false);
        });
      });
    });
  });

  describe("When new GOVUK.SelectionButtons is called with a selector", function () {
    describe("When that selector matches radio inputs", function () {
      afterEach(function () {
        buttonsInstance.destroy();
      });

      describe("At the point it is called", function () {
        it("Should do nothing if no radios are checked", function () {
          buttonsInstance = new GOVUK.SelectionButtons("label.selectable input[type='radio']");
          expect($radioLabels.eq(0).hasClass('selected')).toBe(false);
          expect($radioLabels.eq(1).hasClass('selected')).toBe(false);
          expect($radioLabels.eq(2).hasClass('selected')).toBe(false);
        });

        it("Should mark checked radios with the selected class", function () {
          $radioButtons.eq(0).attr('checked', true);
          buttonsInstance = new GOVUK.SelectionButtons("label.selectable input[type='radio']");
          expect($radioLabels.eq(0).hasClass('selected')).toBe(true);
        });

        it("Should mark checked radios with the custom selected class if given", function () {
          $radioButtons.eq(0).attr('checked', true);
          buttonsInstance = new GOVUK.SelectionButtons("label.selectable input[type='radio']", { 'selectedClass' : 'selectable-selected' });
          expect($radioLabels.eq(0).hasClass('selectable-selected')).toBe(true);
        });
      });

      describe("If one of those radios receives focus", function () {
        it("Should add the focused class to that radio", function () {
          buttonsInstance = new GOVUK.SelectionButtons("label.selectable input[type='radio']");
          $radioButtons.eq(0).focus();
          expect($radioLabels.eq(0).hasClass('focused')).toBe(true);
        });

        it("Should add a custom focused class to that radio if specified as an option", function () {
          buttonsInstance = new GOVUK.SelectionButtons("label.selectable input[type='radio']", { 'focusedClass' : 'selectable-focused' });
          $radioButtons.eq(0).focus();
          expect($radioLabels.eq(0).hasClass('selectable-focused')).toBe(true);
        });
      });

      describe("If one of those radios loses focus", function () {
        it("Should remove the focused class from that radio", function () {
          buttonsInstance = new GOVUK.SelectionButtons("label.selectable input[type='radio']");
          $radioButtons.eq(0).focus();
          expect($radioLabels.eq(0).hasClass('focused')).toBe(true);
          $radioButtons.eq(0).blur();
          expect($radioLabels.eq(0).hasClass('focused')).toBe(false);
        });

        it("Should add a custom focused class to that radio if specified as an option", function () {
          buttonsInstance = new GOVUK.SelectionButtons("label.selectable input[type='radio']", { 'focusedClass' : 'selectable-focused' });
          $radioButtons.eq(0).focus();
          expect($radioLabels.eq(0).hasClass('selectable-focused')).toBe(true);
          $radioButtons.eq(0).blur();
          expect($radioLabels.eq(0).hasClass('selectable-focused')).toBe(false);
        });
      });

      describe("If one of those radios is clicked", function () {
        it("Should mark that radio with the selected class", function () {
          buttonsInstance = new GOVUK.SelectionButtons("label.selectable input[type='radio']");
          $radioButtons.eq(0)
            .attr('checked', true)
            .trigger('click');
          expect($radioLabels.eq(0).hasClass('selected')).toBe(true);
        });

        it("Should remove the selected class from all other radios", function () {
          buttonsInstance = new GOVUK.SelectionButtons("label.selectable input[type='radio']");
          $radioLabels.eq(1).addClass('selected');
          $radioButtons.eq(0)
            .attr('checked', true)
            .trigger('click');
          expect($radioLabels.eq(2).hasClass('selected')).toBe(false);
        });
      });
    });

    describe("When that selector matches checkbox inputs", function () {
      afterEach(function () {
        buttonsInstance.destroy();
      });

      describe("At the point it is called", function () {
        it("Should do nothing if no checkboxes are checked", function () {
          buttonsInstance = new GOVUK.SelectionButtons("label.selectable input[type='checkbox']");
          expect($checkboxLabels.eq(0).hasClass('selected')).toBe(false);
          expect($checkboxLabels.eq(1).hasClass('selected')).toBe(false);
          expect($checkboxLabels.eq(2).hasClass('selected')).toBe(false);
        });

        it("Should mark checked checkboxes with the selected class", function () {
          $checkboxButtons.eq(0).attr('checked', true);
          buttonsInstance = new GOVUK.SelectionButtons("label.selectable input[type='checkbox']");
          expect($checkboxLabels.eq(0).hasClass('selected')).toBe(true);
        });

        it("Should mark all checked checkboxes with the selected class if there are more than one", function () {
          $checkboxButtons.eq(0).attr('checked', true);
          $checkboxButtons.eq(1).attr('checked', true);
          buttonsInstance = new GOVUK.SelectionButtons("label.selectable input[type='checkbox']");
          expect($checkboxLabels.eq(0).hasClass('selected')).toBe(true);
          expect($checkboxLabels.eq(1).hasClass('selected')).toBe(true);
        });

        it("Should mark checked checkboxes with the custom selected class if given", function () {
          $checkboxButtons.eq(0).attr('checked', true);
          buttonsInstance = new GOVUK.SelectionButtons("label.selectable input[type='checkbox']", { 'selectedClass' : 'selectable-selected' });
          expect($checkboxLabels.eq(0).hasClass('selectable-selected')).toBe(true);
        });
      });

      describe("If one of those checkboxes receives focus", function () {
        it("Should add the focused class to that checkbox", function () {
          buttonsInstance = new GOVUK.SelectionButtons("label.selectable input[type='checkbox']");
          $checkboxButtons.eq(0).focus();
          expect($checkboxLabels.eq(0).hasClass('focused')).toBe(true);
        });

        it("Should add a custom focused class to that checkbox if specified as an option", function () {
          buttonsInstance = new GOVUK.SelectionButtons("label.selectable input[type='checkbox']", { 'focusedClass' : 'selectable-focused' });
          $checkboxButtons.eq(0).focus();
          expect($checkboxLabels.eq(0).hasClass('selectable-focused')).toBe(true);
        });
      });

      describe("If one of those checkboxes loses focus", function () {
        it("Should add the focused class to that checkbox", function () {
          buttonsInstance = new GOVUK.SelectionButtons("label.selectable input[type='checkbox']");
          $checkboxButtons.eq(0).focus();
          expect($checkboxLabels.eq(0).hasClass('focused')).toBe(true);
          $checkboxButtons.eq(0).blur();
          expect($checkboxLabels.eq(0).hasClass('focused')).toBe(false);
        });

        it("Should add a custom focused class to that checkbox if specified as an option", function () {
          buttonsInstance = new GOVUK.SelectionButtons("label.selectable input[type='checkbox']", { 'focusedClass' : 'selectable-focused' });
          $checkboxButtons.eq(0).focus();
          expect($checkboxLabels.eq(0).hasClass('selectable-focused')).toBe(true);
          $checkboxButtons.eq(0).blur();
          expect($checkboxLabels.eq(0).hasClass('selectable-focused')).toBe(false);
        });
      });
    });

    describe("When that selector matches a mixture of checkbox and radio inputs", function () {
      var $mixedButtons;

      beforeEach(function () {
        $mixedButtons = $checkboxButtons.add($radioButtons);
      });

      afterEach(function () {
        buttonsInstance.destroy();
      });

      it("Should do nothing if no checkboxes or radios are checked", function () {
        buttonsInstance = new GOVUK.SelectionButtons("label.selectable input");
        expect($checkboxLabels.eq(0).hasClass('selected')).toBe(false);
        expect($checkboxLabels.eq(1).hasClass('selected')).toBe(false);
        expect($checkboxLabels.eq(2).hasClass('selected')).toBe(false);
        expect($radioLabels.eq(0).hasClass('selected')).toBe(false);
        expect($radioLabels.eq(1).hasClass('selected')).toBe(false);
        expect($radioLabels.eq(2).hasClass('selected')).toBe(false);
      });

      it("Should mark checked checkboxes or radios with the selected class", function () {
        $mixedButtons.eq(0).attr('checked', true);
        $mixedButtons.eq(3).attr('checked', true);

        buttonsInstance = new GOVUK.SelectionButtons("label.selectable input");
        expect($checkboxLabels.eq(0).hasClass('selected')).toBe(true);
        expect($radioLabels.eq(0).hasClass('selected')).toBe(true);
      });

      it("Should mark checked checkboxes or radios with the custom selected class if given", function () {
        $mixedButtons.eq(0).attr('checked', true);
        $mixedButtons.eq(3).attr('checked', true);

        buttonsInstance = new GOVUK.SelectionButtons("label.selectable input", { 'selectedClass' : 'selectable-selected' });
        expect($checkboxLabels.eq(0).hasClass('selectable-selected')).toBe(true);
        expect($radioLabels.eq(0).hasClass('selectable-selected')).toBe(true);
      });
    });
  });

  describe("When GOVUK.SelectionButtons is called with a selector and then the page content is replaced", function () {
    describe("When that selector matches radio inputs", function () {
      describe("If one of those radios is clicked", function () {
        afterEach(function () {
          buttonsInstance.destroy();
        });

        it("Should mark that radio with the selected class", function () {
          var contentCache;

          buttonsInstance = new GOVUK.SelectionButtons("label.selectable input[type='radio']");
          contentCache = $('#content').html();
          $('#content').html('');
          $('#content').html(contentCache);
          $("label.selectable input[type='radio']").eq(0)
            .attr('checked', true)
            .trigger('click');
          expect($("label.selectable input[type='radio']").eq(0).parent('label').hasClass('selected')).toBe(true);
        });

        it("Should remove the selected class from all other radios", function () {
          var contentCache;

          buttonsInstance = new GOVUK.SelectionButtons("label.selectable input[type='radio']");
          contentCache = $('#content').html();
          $('#content').html('');
          $('#content').html(contentCache);
          $radioButtons = $("label.selectable input[type='radio']");
          $radioLabels = $radioButtons.parent('label');
          $radioLabels.eq(1).addClass('selected');
          $radioButtons.eq(0)
            .attr('checked', true)
            .trigger('click');
          expect($radioLabels.eq(2).hasClass('selected')).toBe(false);
        });
      });

      describe("If one of those radios is focused", function () {
        afterEach(function () {
          buttonsInstance.destroy();
        });

        it("Should add the focused class to the radio", function () {
          var contentCache;

          buttonsInstance = new GOVUK.SelectionButtons("label.selectable input[type='radio']");
          contentCache = $('#content').html();
          $('#content').html('');
          $('#content').html(contentCache);
          $radioButtons = $("label.selectable input[type='radio']");
          $radioLabels = $radioButtons.parent('label');
          $radioButtons.eq(0).focus();
          expect($radioLabels.eq(0).hasClass('focused')).toBe(true);
        });

        it("Should add a custom focused class to the radio if sent in as an option", function () {
          var contentCache;

          buttonsInstance = new GOVUK.SelectionButtons("label.selectable input[type='radio']", { 'focusedClass' : 'selectable-focused' });
          contentCache = $('#content').html();
          $('#content').html('');
          $('#content').html(contentCache);
          $radioButtons = $("label.selectable input[type='radio']");
          $radioLabels = $radioButtons.parent('label');
          $radioButtons.eq(0).focus();
          expect($radioLabels.eq(0).hasClass('selectable-focused')).toBe(true);
        });

        it("Should remove the focused class from a radio when it loses focus", function () {
          var contentCache;

          buttonsInstance = new GOVUK.SelectionButtons("label.selectable input[type='radio']");
          contentCache = $('#content').html();
          $('#content').html('');
          $('#content').html(contentCache);
          $radioButtons = $("label.selectable input[type='radio']");
          $radioLabels = $radioButtons.parent('label');
          $radioButtons.eq(0).focus();
          expect($radioLabels.eq(0).hasClass('focused')).toBe(true);
          $radioButtons.eq(0).blur();
          expect($radioLabels.eq(0).hasClass('focused')).toBe(false);
        });
      });
    });

    describe("When that selector matches checkbox inputs", function () {
      describe("If one of those checkboxes is clicked", function () {
        afterEach(function () {
          buttonsInstance.destroy();
        });

        it("Should add the selected class to the checkbox", function () {
          var contentCache;

          buttonsInstance = new GOVUK.SelectionButtons("label.selectable input[type='checkbox']");
          contentCache = $('#content').html();
          $('#content').html('');
          $('#content').html(contentCache);
          $("label.selectable input[type='checkbox']").eq(0)
            .attr('checked', true)
            .trigger('click');
          expect($("label.selectable input[type='checkbox']").eq(0).parent('label').hasClass('selected')).toBe(true);
        });
      });

      describe("If one of those checkboxes is focused", function () {
        afterEach(function () {
          buttonsInstance.destroy();
        });

        it("Should add the focused class to the checkbox", function () {
          var contentCache;

          buttonsInstance = new GOVUK.SelectionButtons("label.selectable input[type='checkbox']");
          contentCache = $('#content').html();
          $('#content').html('');
          $('#content').html(contentCache);
          $checkboxButtons = $("label.selectable input[type='checkbox']");
          $checkboxLabels = $checkboxButtons.parent('label');
          $checkboxButtons.eq(0).focus();
          expect($checkboxLabels.eq(0).hasClass('focused')).toBe(true);
        });

        it("Should add a custom focused class to the checkbox if sent in as an option", function () {
          var contentCache;

          buttonsInstance = new GOVUK.SelectionButtons("label.selectable input[type='checkbox']", { 'focusedClass' : 'selectable-focused' });
          contentCache = $('#content').html();
          $('#content').html('');
          $('#content').html(contentCache);
          $checkboxButtons = $("label.selectable input[type='checkbox']");
          $checkboxLabels = $checkboxButtons.parent('label');
          $checkboxButtons.eq(0).focus();
          expect($checkboxLabels.eq(0).hasClass('selectable-focused')).toBe(true);
        });

        it("Should remove the focused class from the checkbox when it loses focus", function () {
          var contentCache;

          buttonsInstance = new GOVUK.SelectionButtons("label.selectable input[type='checkbox']");
          contentCache = $('#content').html();
          $('#content').html('');
          $('#content').html(contentCache);
          $checkboxButtons = $("label.selectable input[type='checkbox']");
          $checkboxLabels = $checkboxButtons.parent('label');
          $checkboxButtons.eq(0).focus();
          expect($checkboxLabels.eq(0).hasClass('focused')).toBe(true);
          $checkboxButtons.eq(0).blur();
          expect($checkboxLabels.eq(0).hasClass('focused')).toBe(false);
        });
      });
    });
  });

  describe("GOVUK.SelectionButtons.prototype.destroy", function () {
    it("Should remove the events bound to the jQuery-wrapped elements sent into GOVUK.SelectionButtons", function () {
      var clickCallbackBound = false,
          focusBlurCallbackBound = false,
          clickCallbackCancelled = false,
          focusBlurCallbackCancelled = false;

      spyOn($.fn, "on").and.callFake(function (evt, callback) {
        if (this === $radioButtons) {
          if (evt === "click") {
            clickCallbackBound = callback;
          }
          if (evt === "focus blur") {
            focusBlurCallbackBound = callback;
          }
        }
        return this;
      });

      spyOn($.fn, "off").and.callFake(function (evt, callback) {
        if (this === $radioButtons) {
          if (evt === "click") {
            clickCallbackCancelled = callback;
          }
          if (evt === "focus blur") {
            focusBlurCallbackCancelled = callback;
          }
        }
        return this;
      });
      buttonsInstance = new GOVUK.SelectionButtons($radioButtons);
      expect(clickCallbackBound).not.toBe(false);
      expect(focusBlurCallbackBound).not.toBe(false);
      buttonsInstance.destroy();
      expect(clickCallbackCancelled).toEqual(clickCallbackBound);
      expect(focusBlurCallbackCancelled).toEqual(focusBlurCallbackBound);
    });

    it("Should remove the events bound to the document for the selector was sent into GOVUK.SelectionButtons", function () {
      var clickCallbackBound = false,
          focusBlurCallbackBound = false,
          clickCallbackCancelled = false,
          focusBlurCallbackCancelled = false;

      spyOn($.fn, "on").and.callFake(function (evt, selector, callback) {
        if ((this[0] === document) && (selector === "label.selectable input[type='checkbox']")) {
          if (evt === "click") {
            clickCallbackBound = callback;
          }
          if (evt === "focus blur") {
            focusBlurCallbackBound = callback;
          }
        }
        return this;
      });

      spyOn($.fn, "off").and.callFake(function (evt, selector, callback) {
        if ((this[0] === document) && (selector === "label.selectable input[type='checkbox']")) {
          if (evt === "click") {
            clickCallbackCancelled = callback;
          }
          if (evt === "focus blur") {
            focusBlurCallbackCancelled = callback;
          }
        }
        return this;
      });
      buttonsInstance = new GOVUK.SelectionButtons("label.selectable input[type='checkbox']");
      expect(clickCallbackBound).not.toBe(false);
      expect(focusBlurCallbackBound).not.toBe(false);
      buttonsInstance.destroy();
      expect(clickCallbackCancelled).toEqual(clickCallbackBound);
      expect(focusBlurCallbackCancelled).toEqual(focusBlurCallbackBound);
    });
  });
});
