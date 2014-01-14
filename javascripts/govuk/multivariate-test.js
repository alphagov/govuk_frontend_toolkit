(function() {
  "use strict";
  window.GOVUK = window.GOVUK || {};
  var $ = window.$;

  // A multivariate test framework
  //
  // Based loosely on https://github.com/jamesyu/cohorts
  //
  // Full documentation is in README.md.
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

  window.GOVUK.MultivariateTest = MultivariateTest;
}());
