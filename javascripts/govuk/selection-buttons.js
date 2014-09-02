(function () {
  "use strict"
  var root = this,
      $ = root.jQuery;

  if (typeof GOVUK === 'undefined') { root.GOVUK = {}; }

  var BaseButtons = function ($elms, opts) {
    this.$elms = $elms;
    this.selectedClass = 'selected';
    this.focusedClass = 'focused';
    if (opts !== undefined) {
      $.each(opts, function (optionName, optionObj) {
        this[optionName] = optionObj;
      }.bind(this));
    }
    this.setEventNames();
    this.getSelections();
    this.bindEvents();
  };
  BaseButtons.prototype.setEventNames = function () {
    this.selectionEvents = 'click';
    this.focusEvents = 'focus blur';
  };
  BaseButtons.prototype.markFocused = function ($elm, state) {
    var elmId = $elm.attr('id');

    if (state === 'focused') {
      $elm.parent('label').addClass(this.focusedClass);
    } else {
      $elm.parent('label').removeClass(this.focusedClass);
    }
  };
  BaseButtons.prototype.bindEvents = function () {
    var selectionEventHandler = this.markSelected.bind(this),
        focusEventHandler = this.markFocused.bind(this);

    this.$elms
      .on(this.selectionEvents, function (e) {
        selectionEventHandler($(e.target));
      })
      .on(this.focusEvents, function (e) {
        var state = (e.type === 'focus') ? 'focused' : 'blurred';

        focusEventHandler($(e.target), state);
      });
  };

  var RadioButtons = function ($elms, opts) {
    BaseButtons.apply(this, arguments);
  };
  RadioButtons.prototype.setEventNames = function () {
    // some browsers fire the 'click' when the selected radio changes by keyboard
    this.selectionEvents = 'click change';
    this.focusEvents = 'focus blur';
  };
  RadioButtons.prototype.getSelections = function () {
    var selectionEventHandler = this.markSelected.bind(this);

    this.selections = {};
    $.each(this.$elms, function (index, elm) {
      var $elm = $(elm),
          radioName = $elm.attr('name');

      if (typeof this.selections[radioName] === 'undefined') {
        this.selections[radioName] = false;
      }
      if ($elm.is(':checked')) {
        selectionEventHandler($elm);
      }
    }.bind(this));
  };
  RadioButtons.prototype.bindEvents = function () {
    BaseButtons.prototype.bindEvents.call(this);
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
  CheckboxButtons.prototype.setEventNames = function () {
    BaseButtons.prototype.setEventNames.call(this);
  };
  CheckboxButtons.prototype.getSelections = function () {
    var selectionEventHandler = this.markSelected.bind(this);

    this.$elms.each(function (idx, elm) {
      var $elm = $(elm);

      if ($elm.is(':checked')) {
        selectionEventHandler($elm);
      }
    });
  };
  CheckboxButtons.prototype.bindEvents = function () {
    BaseButtons.prototype.bindEvents.call(this);
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
