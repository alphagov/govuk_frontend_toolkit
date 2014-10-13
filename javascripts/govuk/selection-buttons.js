(function () {
  "use strict"
  var root = this,
      $ = root.jQuery;

  if (typeof GOVUK === 'undefined') { root.GOVUK = {}; }

  var SelectionButtons = function (elms, opts) {
    this.selectedClass = 'selected';
    this.focusedClass = 'focused';
    if (opts !== undefined) {
      $.each(opts, function (optionName, optionObj) {
        this[optionName] = optionObj;
      }.bind(this));
    }
    this.setInitialState($(elms));
    this.addEvents(elms);
  };
  SelectionButtons.prototype.addEvents = function (elmsOrSelector) {
    var selector,
        $elms;

    if (typeof elmsOrSelector === 'string') {
      selector = elmsOrSelector;
      this.addDocumentLevelEvents(selector);
    } else {
      $elms = elmsOrSelector;
      this.addElementLevelEvents($elms);
    }
  };
  SelectionButtons.prototype.setInitialState = function ($elms) {
    $elms.each(function (idx, elm) {
      var $elm = $(elm);

      if ($elm.is(':checked')) {
        this.markSelected($elm);
      }
    }.bind(this));
  };
  SelectionButtons.prototype.markFocused = function ($elm, state) {
    if (state === 'focused') {
      $elm.parent('label').addClass(this.focusedClass);
    } else {
      $elm.parent('label').removeClass(this.focusedClass);
    }
  };
  SelectionButtons.prototype.markSelected = function ($elm) {
    var radioName;

    if ($elm.attr('type') === 'radio') {
      radioName = $elm.attr('name'),
      $($elm[0].form).find('input[name="' + radioName + '"]')
        .parent('label')
        .removeClass(this.selectedClass);
      $elm.parent('label').addClass(this.selectedClass);
    } else { // checkbox
      if ($elm.is(':checked')) {
        $elm.parent('label').addClass(this.selectedClass);
      } else {
        $elm.parent('label').removeClass(this.selectedClass);
      }
    }
  };
  SelectionButtons.prototype.addElementLevelEvents = function ($elms) {
    $elms
      .on('click', function (e) {
        this.markSelected($(e.target));
      }.bind(this))
      .on('focus blur', function (e) {
        var state = (e.type === 'focus') ? 'focused' : 'blurred';

        this.markFocused($(e.target), state);
      }.bind(this));
  };
  SelectionButtons.eventSelectors = [];
  SelectionButtons.prototype.addDocumentLevelEvents = function (selector) {
    if ($.inArray(selector, SelectionButtons.eventSelectors) === -1) {
      $(document)
        .on('click', selector, function (e) {
          this.markSelected($(e.target));
        }.bind(this))
        .on('focus blur', selector, function (e) {
          var state = (e.type === 'focusin') ? 'focused' : 'blurred';

          this.markFocused($(e.target), state);
        }.bind(this));
      SelectionButtons.eventSelectors.push(selector);
    }
  };

  var selectionButtons = function (elms, opts) {
    new SelectionButtons(elms, opts);
  };
  selectionButtons.removeEventsFor = function (selector) {
    $(document)
      .off('click', selector)
      .off('focus blur', selector);
    SelectionButtons.eventSelectors = $.grep(SelectionButtons.eventSelectors, function (entry) {
      return entry !== selector;
    });
  };

  root.GOVUK.selectionButtons = selectionButtons;
}).call(this);
