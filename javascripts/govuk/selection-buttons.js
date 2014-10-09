(function () {
  "use strict"
  var root = this,
      $ = root.jQuery;

  if (typeof GOVUK === 'undefined') { root.GOVUK = {}; }

  var shared = {
    selectedClass : 'selected',
    focusedClass : 'focused',
    markSelected : {
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
    },
    bindElementLevelEvents : function ($elms) {
      $elms
        .on('click', function (e) {
          shared.markSelected[e.target.type].call(this, $(e.target));
        }.bind(this))
        .on('focus blur', function (e) {
          var state = (e.type === 'focus') ? 'focused' : 'blurred';

          this.markFocused($(e.target), state);
        }.bind(this));
    },
    eventSelectors : [],
    bindDocumentLevelEvents : function (selector) {
      if ($.inArray(selector, shared.eventSelectors) === -1) {
        $(document)
          .on('click', selector, function (e) {
            shared.markSelected[e.target.type].call(this, $(e.target));
          }.bind(this))
          .on('focus blur', selector, function (e) {
            var state = (e.type === 'focusin') ? 'focused' : 'blurred';

            this.markFocused($(e.target), state);
          }.bind(this));
        shared.eventSelectors.push(selector);
      }
    },
    construct : function ($elms, opts) {
      this.selectedClass = shared.selectedClass;
      this.focusedClass = shared.focusedClass;
      if (opts !== undefined) {
        $.each(opts, function (optionName, optionObj) {
          this[optionName] = optionObj;
        }.bind(this));
      }
      this.setInitialState($elms);
      this.bindEvents($elms);
    }
  };
  var SelectionButtons = function (elms, opts) {
    var selector,
        $elms;

    if (typeof elms === 'string') {
      selector = elms;
      $elms = $(selector);
      this.bindEvents = function ($elms) {
        shared.bindDocumentLevelEvents.call(this, selector);
      };
    } else { // elms is a jQuery object
      $elms = elms;
      this.bindEvents = function ($elms) {
        shared.bindElementLevelEvents.call(this, $elms);
      }
    }
    shared.construct.apply(this, [$elms, opts]);
    return this;
  };
  SelectionButtons.prototype.setInitialState = function ($elms) {
    $elms.each(function (idx, elm) {
      var $elm = $(elm);

      if ($elm.is(':checked')) {
        shared.markSelected[elm.type].call(this, $elm);
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

  var selectionButtons = function (elms, opts) {
    new SelectionButtons(elms, opts);
  };
  selectionButtons.removeEventsFor = function (selector) {
    $(document)
      .off('click', selector)
      .off('focus blur', selector);
    shared.eventSelectors = $.grep(shared.eventSelectors, function (entry) {
      return entry !== selector;
    });
  };

  root.GOVUK.selectionButtons = selectionButtons;
}).call(this);
