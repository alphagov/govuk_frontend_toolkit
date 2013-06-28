var GOVUK = GOVUK || {};

GOVUK.performance = GOVUK.performance || {};

GOVUK.performance.stageprompt = (function () {
  var setup, setUpForGoogleAnalytics;

  setup = function (analyticsCallback) {
    var journeyStage = $('[data-journey]').attr('data-journey'),
        journeyHelpers = $('[data-journey-helper]');
    if (journeyStage) {
      analyticsCallback(journeyStage);
    }
    
    if (journeyHelpers.length) {
      journeyHelpers.on('click', function (event) {
        analyticsCallback($(this).data('journey-helper'));
      });
    }
  };
  
  setupForGoogleAnalytics = function () {
    setup(GOVUK.performance.sendGoogleAnalyticsEvent);
  };

  return {
    setup: setup,
    setupForGoogleAnalytics: setupForGoogleAnalytics
  };
}());

GOVUK.performance.sendGoogleAnalyticsEvent = function (action) {
  _gaq.push(['_trackEvent', 'stagePrompt', action, undefined, undefined, true]);
};
