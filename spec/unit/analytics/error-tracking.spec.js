describe("GOVUK.analyticsPlugins.error", function() {
  GOVUK.analyticsPlugins.error({filenameMustMatch: /gov\.uk/});

  beforeEach(function() {
    GOVUK.analytics = {trackEvent:function(){}};
    spyOn(GOVUK.analytics, 'trackEvent');
  });

  afterEach(function() {
    delete GOVUK.analytics;
  });

  it('sends errors to Google Analytics', function() {
    triggerError('https://www.gov.uk/filename.js', 2, 'Error message');

    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith(
      'JavaScript Error',
      'Error message',
      { label: 'https://www.gov.uk/filename.js: 2', value: 1, nonInteraction: true });
  });

  it('tracks only errors with a matching or blank filename', function() {
    triggerError('http://www.gov.uk/somefile.js', 2, 'Error message');
    triggerError('', 2, 'In page error');
    triggerError('http://www.broken-external-plugin-site.com/horrible.js', 2, 'Error message');

    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith(
      'JavaScript Error',
      'Error message',
      {
        label: 'http://www.gov.uk/somefile.js: 2',
        value: 1,
        nonInteraction: true });

    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith(
      'JavaScript Error',
      'In page error',
      {
        label: ': 2',
        value: 1,
        nonInteraction: true });

    expect(GOVUK.analytics.trackEvent).not.toHaveBeenCalledWith(
      'JavaScript Error',
      'Error message',
      {
        label: 'http://www.broken-external-plugin-site.com/horrible.js: 2',
        value: 1,
        nonInteraction: true });
  });

  function triggerError(filename, lineno, message) {
    var event = document.createEvent('Event');
    event.initEvent('error', true, true);
    event.filename = filename;
    event.lineno = lineno;
    event.message = message;
    window.dispatchEvent(event);
  }
});
