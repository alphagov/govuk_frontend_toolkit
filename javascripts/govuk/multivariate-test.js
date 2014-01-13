(function() {
  "use strict";
  window.GOVUK = window.GOVUK || {};

  // A simple multivariate test framework
  //
  // Based loosely on https://github.com/jamesyu/cohorts
  //
  // It allows the running of split tests to display different content, layouts
  // etc to users. It randomly assigns a user a cohort on first
  // execution by setting a cookie, and on every execution sets a session level
  // custom variable on Google Analytics to mark which cohort a user is in.
  // This can be used to segment users in different cohorts in GA.
  //
  // A simple content replacement test can be done by defining a set of
  // cohorts with content. E.g.:
  //
  //   var test = new MultivariateTest({
  //     el: '.car-tax-button',
  //     name: 'car_tax_button_text',
  //     customVarIndex: 555,
  //     cohorts: {
  //       pay_your_car_tax: {html: "Pay Your Car Tax"},
  //       give_us_money: {html: "Give Us Money Or We Will Crush Your Car"},
  //     }
  //   });
  //
  // A more complex test can be done by defining callbacks for what to do
  // when a user is in each cohort:
  //
  //   var test = new MultivariateTest({
  //     name: 'car_tax_button_text',
  //     customVarIndex: 555,
  //     cohorts: {
  //       pay_your_car_tax: {callback: function() { ... }},
  //       give_us_money: {callback: function() { ... }},
  //     }
  //   });
  //
  // If you have a complex test, it may be worth extending MultivariateTest with 
  // your own. Callbacks can be strings which will call a method of that name
  // on the current object.
  //
  // Takes these options:
  //  - `el`: Element to run this test on (optional)
  //  - `name`: The name of the text (alphanumeric and underscores)
  //  - `customVarIndex`: The index of the custom variable in Google Analytics.
  //     GA only gives us 50 integer slots to work with, and it is important that 
  //     a unique integer is assigned to each test. Current contact for assigning 
  //     a custom var slot is:
  //     Ashraf Chohan <ashraf.chohan@digital.cabinet-office.gov.uk>
  //  - `cohorts`: An object that maps cohort name to an object that defines the 
  //    cohort. Name must be same format as test name. Object contains keys (both
  //    optional):
  //      - `html`: HTML to fill element with when this cohort is picked.
  //      - `callback`: Function to call when this cohort is chosen. If it is a
  //        string, that method on the test object is called.
  //
  //
  function MultivariateTest(options) {
    this.$el = $(options.el);
    this._loadOption(options, 'name');
    this._loadOption(options, 'customVarIndex');
    this._loadOption(options, 'cohorts');
    this._loadOption(options, 'runImmediately', true);

    if (this.runImmediately) {
      this.run();
    }
  }

  MultivariateTest.prototype._loadOption = function(options, key, defaultValue) {
    if (options[key] !== undefined) {
      this[key] = options[key];
    }
    if (this[key] === undefined) {
      if (defaultValue === undefined) {
        throw new Error(key+" option is required for a multivariate test");
      }
      else {
        this[key] = defaultValue;
      }
    }
  };

  MultivariateTest.prototype.run = function() {
    var cohort = this.getCohort();
    if (cohort) {
      this.setCustomVar(cohort);
      this.executeCohort(cohort);
    }
  };

  MultivariateTest.prototype.executeCohort = function(cohort) {
    var cohortObj = this.cohorts[cohort];
    if (cohortObj.callback) {
      if (typeof cohortObj.callback === "string") {
        this[cohortObj.callback]();
      }
      else {
        cohortObj.callback();
      }
    }
    if (cohortObj.html) {
      this.$el.html(cohortObj.html);
      this.$el.show();
    }
  };

  // Get the current cohort or assign one if it has not been already
  MultivariateTest.prototype.getCohort = function() {
    var cohort = GOVUK.cookie(this.cookieName());
    if (!cohort || !this.cohorts[cohort]) {
      cohort = this.chooseRandomCohort();
      GOVUK.cookie(this.cookieName(), cohort, {days: 30});
    }
    return cohort;
  };

  MultivariateTest.prototype.setCustomVar = function(cohort) {
    window._gaq = window._gaq || [];
    window._gaq.push([
      '_setCustomVar',
      this.customVarIndex,
      this.cookieName(),
      cohort,
      2 // session level
    ]);
    // Fire off a dummy event to set the custom var on the page.
    // Ideally we'd be able to call setCustomVar before trackPageview,
    // but would need reordering the existing GA code.
    window._gaq.push(['_trackEvent', this.cookieName(), 'run', '-', 0, true]);
  };

  MultivariateTest.prototype.cohortNames = function() {
    return $.map(this.cohorts, function(v, i) { return i; });
  };

  MultivariateTest.prototype.chooseRandomCohort = function() {
    var names = this.cohortNames();
    return names[Math.floor(Math.random() * names.length)];
  };

  MultivariateTest.prototype.cookieName = function() {
    return "multivariatetest_cohort_" + this.name;
  };

  GOVUK.MultivariateTest = MultivariateTest;
}());
