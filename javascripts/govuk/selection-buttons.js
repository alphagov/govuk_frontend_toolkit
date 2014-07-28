(function () {
  "use strict"
  var root = this,
      $ = root.jQuery;

  if (typeof GOVUK === 'undefined') { root.GOVUK = {}; }

  var BaseButtons = function ($elms, opts) {
    var _this = this;

    this.$elms = $elms;
    this.selectedClass = 'selected';
    this.focusedClass = 'focused';
    if (opts !== undefined) {
      $.each(opts, function (optionName, optionObj) {
        _this[optionName] = opts[optionName];
      });
    }
    this.setup();
    this.bindEvents();
  };
  BaseButtons.prototype.markFocused = function ($elm, state) {
    var elmId = $elm.attr('id');

    if (state === 'focused') {
      $elm.parent('label').addClass(this.focusedClass);
    } else {
      $elm.parent('label').removeClass(this.focusedClass);
    }
  };

  var RadioButtons = function ($elms, opts) {
    BaseButtons.apply(this, arguments);
  };
  RadioButtons.prototype.setup = function () {
    var _this = this;

    this.selections = {};
    $.each(this.$elms, function (index, elm) {
      var $elm = $(elm),
          radioName = $elm.attr('name');

      if (typeof _this.selections[radioName] === 'undefined') {
        _this.selections[radioName] = false;
      }
      if ($elm.is(':checked')) {
        _this.markSelected($elm);
        _this.selections[radioName] = $elm;
      }
    });
  };
  RadioButtons.prototype.bindEvents = function () {
    var _this = this;

    this.$elms
      // some browsers fire the 'click' when the selected radio changes by keyboard
      .on('click change', function (e) {
        var $elm = $(e.target);

        if ($elm.is(':checked')) {
          _this.markSelected($elm);
        }
      })
      .on('focus blur', function (e) {
        var state = (e.type === 'focus') ? 'focused' : 'blurred';

        _this.markFocused($(e.target), state);
      });
  };
  RadioButtons.prototype.markSelected = function ($elm) {
    var radioName = $elm.attr('name'),
        $previousSelection = this.selections[radioName];

    if ($previousSelection) {
      $previousSelection.parent('label').removeClass(this.selectedClass);
    }
    $elm.parent('label').addClass(this.selectedClass);
    this.selections[radioName] = $elm;
  };
  RadioButtons.prototype.markFocused = function ($elm) {
    BaseButtons.prototype.markFocused.apply(this, arguments);
  };

  var CheckboxButtons = function ($elms, opts) {
    BaseButtons.apply(this, arguments);
  };
  CheckboxButtons.prototype.setup = function () {
    var _this = this;

    this.$elms.each(function (idx, elm) {
      var $elm = $(elm);

      if ($elm.is(':checked')) {
        _this.markSelected($elm);
      }
    });
  };
  CheckboxButtons.prototype.bindEvents = function () {
    var _this = this;

    this.$elms
      .on('click', function (e) {
        _this.markSelected($(e.target));
      })
      .on('focus blur', function (e) {
        var state = (e.type === 'focus') ? 'focused' : 'blurred';

        _this.markFocused($(e.target), state);
      });
  };
  CheckboxButtons.prototype.markSelected = function ($elm) {
    if ($elm.is(':checked')) {
      $elm.parent('label').addClass(this.selectedClass);
    } else {
      $elm.parent('label').removeClass(this.selectedClass);
    }
  };
  CheckboxButtons.prototype.markFocused = function ($elm) {
    BaseButtons.prototype.markFocused.apply(this, arguments);
  };

  root.GOVUK.RadioButtons = RadioButtons;
  root.GOVUK.CheckboxButtons = CheckboxButtons;

  var selectionButtons = function ($elms, opts) {
    var $radios = $elms.filter('[type=radio]'),
        $checkboxes = $elms.filter('[type=checkbox]');

    if ($radios) {
      new GOVUK.RadioButtons($radios, opts);
    }
    if ($checkboxes) {
      new GOVUK.CheckboxButtons($checkboxes, opts);
    }
  };

  root.GOVUK.selectionButtons = selectionButtons;
}).call(this);
