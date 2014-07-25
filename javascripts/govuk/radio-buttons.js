(function () {
  "use strict"
  var root = this,
      $ = root.jQuery;

  if (typeof GOVUK === 'undefined') { root.GOVUK = {}; }

  var RadioButtons = function ($elms, opts) {
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
        _this.selections[radioName] = $elm.attr('id');
      }
    });
    this.focused = false;
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
      .on('focus', function (e) {
        _this.markFocused($(e.target));
      });
  };
  RadioButtons.prototype.markSelected = function ($elm) {
    var radioName = $elm.attr('name'),
        previousSelection = this.selections[radioName];

    if (previousSelection) {
      $('#' + previousSelection).parent('label').removeClass(this.selectedClass);
    }
    $elm.parent('label').addClass(this.selectedClass);
    this.selections[radioName] = $elm.attr('id');
  };
  RadioButtons.prototype.markFocused = function ($elm) {
    $elm.parent('label').addClass(this.focusedClass);
    if (this.focused) {
      $('#' + this.focused).parent('label').removeClass(this.focusedClass);
    }
    this.focused = $elm.attr('id');
  };
  root.GOVUK.RadioButtons = RadioButtons;
}).call(this);
