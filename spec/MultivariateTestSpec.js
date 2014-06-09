describe("MultivariateTest", function() {
  beforeEach(function() {
    GOVUK.cookie = jasmine.createSpy('GOVUK.cookie');
    window._gaq = [];
  });

  describe("#run", function() {
    it("should pick a random cohort on first run", function() {
      GOVUK.cookie.andReturn(null);
      var fooSpy = jasmine.createSpy('fooSpy');
      var barSpy = jasmine.createSpy('barSpy');
      var test = new GOVUK.MultivariateTest({
        name: 'stuff',
        customVarIndex: 1,
        cohorts: {
          foo: {callback: fooSpy},
          bar: {callback: barSpy}
        }
      });

      expect(GOVUK.cookie.callCount).toEqual(2);
      expect(GOVUK.cookie.argsForCall[1][0]).toEqual('multivariatetest_cohort_stuff');
      if (GOVUK.cookie.argsForCall[1][1] == 'foo') {
        expect(fooSpy).toHaveBeenCalled();
      }
      else {
        expect(barSpy).toHaveBeenCalled();
      }
    });

    it("should use an existing cohort choice on subsequent runs", function() {
      GOVUK.cookie.andReturn('foo');
      var fooSpy = jasmine.createSpy('fooSpy');
      var barSpy = jasmine.createSpy('barSpy');
      var test = new GOVUK.MultivariateTest({
        name: 'stuff',
        customVarIndex: 1,
        cohorts: {
          foo: {callback: fooSpy},
          bar: {callback: barSpy}
        }
      });
      expect(fooSpy).toHaveBeenCalled();
    });

    it("should set a custom var", function() {
      GOVUK.cookie.andReturn('foo');
      var test = new GOVUK.MultivariateTest({
        name: 'stuff',
        customVarIndex: 1,
        cohorts: {
          foo: {},
          bar: {}
        },
        customVarIndex: 2
      });
      expect(window._gaq).toEqual([
        [
          '_setCustomVar',
          2,
          'multivariatetest_cohort_stuff',
          'foo',
          2
        ],
        [
          '_trackEvent',
          'multivariatetest_cohort_stuff',
          'run',
          '-',
          0,
          true
        ]
      ]);
    });

    it("should set html for a cohort", function() {
      GOVUK.cookie.andReturn('foo');
      var $el = $('<div>');
      var test = new GOVUK.MultivariateTest({
        name: 'stuff',
        customVarIndex: 1,
        el: $el,
        cohorts: {
          foo: {html: "foo"},
          bar: {html: "bar"}
        }
      });
      expect($el.html()).toEqual('foo');
    });

    it("should call the callback for a cohort", function() {
      var fooSpy = jasmine.createSpy('fooSpy');
      var barSpy = jasmine.createSpy('barSpy');
      GOVUK.cookie.andReturn('bar');
      var $el = $('<div>');
      var test = new GOVUK.MultivariateTest({
        name: 'stuff',
        customVarIndex: 1,
        el: $el,
        cohorts: {
          foo: {callback: fooSpy},
          bar: {callback: barSpy}
        }
      });
      expect(barSpy).toHaveBeenCalled();
    });

    it("should call the callback for a cohort if it is a string", function() {
      GOVUK.cookie.andReturn('foo');
      var test = new GOVUK.MultivariateTest({
        name: 'stuff',
        customVarIndex: 1,
        cohorts: {
          foo: {callback: 'fooCallback'},
          bar: {}
        },
        runImmediately: false
      });
      test.fooCallback = jasmine.createSpy('fooCallback')
      test.run();
      expect(test.fooCallback).toHaveBeenCalled();
    });

    it("should assign a new random cohort if the assigned cohort does not exist", function() {
      var fooSpy = jasmine.createSpy('fooSpy');
      var barSpy = jasmine.createSpy('barSpy');
      GOVUK.cookie.andReturn('baz');
      var test = new GOVUK.MultivariateTest({
        name: 'stuff',
        customVarIndex: 1,
        cohorts: {
          foo: {callback: fooSpy},
          bar: {callback: barSpy}
        }
      });
      if (GOVUK.cookie.argsForCall[1][1] == 'foo') {
        expect(fooSpy).toHaveBeenCalled();
      }
      else {
        expect(barSpy).toHaveBeenCalled();
      }
    });
  });

  describe("#weightedCohortNames", function() {
    it("should return the weighted names of the cohorts when no weights are defined", function() {
      var test = new GOVUK.MultivariateTest({
        name: 'stuff',
        customVarIndex: 1,
        cohorts: {foo: {}, bar: {}, baz: {}}
      });
      expect(test.weightedCohortNames()).toEqual(['foo', 'bar', 'baz']);
    });

    it("should return the weighted names of the cohorts when weights are defined", function() {
      var test = new GOVUK.MultivariateTest({
        name: 'stuff',
        customVarIndex: 1,
        cohorts: {foo: { weight: 2 }, bar: { weight: 1 }, baz: { weight: 3 }}
      });
      expect(test.weightedCohortNames()).toEqual(['foo', 'foo', 'bar', 'baz', 'baz', 'baz']);
    });

    it("should return the weighted names of the cohorts using default weighting", function() {
      var test = new GOVUK.MultivariateTest({
        name: 'stuff',
        customVarIndex: 1,
        defaultWeight: 2,
        cohorts: {foo: {}, bar: {}, baz: {}}
      });
      expect(test.weightedCohortNames()).toEqual(['foo', 'foo', 'bar', 'bar', 'baz', 'baz']);
    });

    it("should return the weighted names of the cohorts using default weighting or defined weighting", function() {
      var test = new GOVUK.MultivariateTest({
        name: 'stuff',
        customVarIndex: 1,
        defaultWeight: 2,
        cohorts: {foo: {}, bar: { weight: 1 }, baz: {}}
      });
      expect(test.weightedCohortNames()).toEqual(['foo', 'foo', 'bar', 'baz', 'baz']);
    });
  });

  describe("#chooseRandomCohort", function() {
    it("should choose a random cohort", function() {
      var test = new GOVUK.MultivariateTest({
        name: 'stuff',
        customVarIndex: 1,
        cohorts: {foo: {}, bar: {}}
      });
      expect(['foo', 'bar']).toContain(test.chooseRandomCohort());
    })
  });
});
