(function () {
  "use strict"
  var root = this,
      $ = root.jQuery;

  if (typeof GOVUK === 'undefined') { root.GOVUK = {}; }

  var RadioButtons = function ($elms, opts) {
    this.$elms = $elms;
    if (opts !== undefined && (typeof opts.selectedClass !== 'undefined')) {
      this.selectedClass = opts.selectedClass;
    } else {
      this.selectedClass = 'selected';
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
  };
  RadioButtons.prototype.bindEvents = function () {
    var _this = this;

    // some browsers fire the 'click' when the selected radio changes by keyboard
    this.$elms.on('click change', function (e) {
      var $elm = $(e.target);

      if ($elm.is(':checked')) {
        _this.markSelected($elm);
      }
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
  root.GOVUK.RadioButtons = RadioButtons;
}).call(this);
