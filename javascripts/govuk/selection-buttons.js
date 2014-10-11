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
    this.setEventTypes(elms);
    this.bindEvents(elms);
  };
  SelectionButtons.prototype.setEventTypes = function (elms) {
    var selector,
        $elms;

    if (typeof elms === 'string') {
      selector = elms;
      $elms = $(selector);
      this.bindEvents = function ($elms) {
        this.bindDocumentLevelEvents(selector);
      }.bind(this);
    } else { // elms is a jQuery object
      $elms = elms;
      this.bindEvents = function ($elms) {
        this.bindElementLevelEvents($elms);
      }.bind(this);
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
  SelectionButtons.prototype.markSelected = (function () {
    var markSelected = {
      'radio' : function ($elm) {
        var radioName = $elm.attr('name'),
            $radiosInGroup = $($elm[0].form).find('input[name="' + radioName + '"]');

        $radiosInGroup.parent('label').removeClass(this.selectedClass);
        $elm.parent('label').addClass(this.selectedClass);
      },
      'checkbox' : function ($elm) {
        if ($elm.is(':checked')) {
          $elm.parent('label').addClass(this.selectedClass);
        } else {
          $elm.parent('label').removeClass(this.selectedClass);
        }
      }
    };

    return function ($elm) {
      var inputType = $elm.attr('type');

      markSelected[inputType].call(this, $elm);
    };
  }());
  SelectionButtons.prototype.bindElementLevelEvents = function ($elms) {
    $elms
      .on('click', function (e) {
        this.markSelected($(e.target));
      }.bind(this))
      .on('focus blur', function (e) {
        var state = (e.type === 'focus') ? 'focused' : 'blurred';

        this.markFocused($(e.target), state);
      }.bind(this));
  };
  SelectionButtons.eventSelectors = [],
  SelectionButtons.prototype.bindDocumentLevelEvents = function (selector) {
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
