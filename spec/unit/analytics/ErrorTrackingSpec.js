describe("GOVUK.analyticsPlugins.error", function() {
  beforeEach(function() {
    GOVUK.analytics = {trackEvent:function(){}};
    GOVUK.analyticsPlugins.error();
  });

  afterEach(function() {
    delete GOVUK.analytics;
  });

  it('sends errors to Google Analytics', function() {
    spyOn(GOVUK.analytics, 'trackEvent');
    triggerError('filename.js', 2, 'Error message')l

    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith(
      'JavaScript Error',
      'Error message',
      { label: 'filename.js: 2', value: 1, nonInteraction: true });
  });

  function triggerError(filename, lineno, message) {
    var event = new Event('error');
    event.filename = filename;
    event.lineno = lineno;
    event.message = message;
    window.dispatchEvent(event);
  }
});
