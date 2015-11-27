describe('An auto event tracker', function() {
  "use strict";

  var tracker,
      element;

  beforeEach(function() {
    GOVUK.analytics = {trackEvent: function() {}};
    tracker = new GOVUK.Modules.AutoTrackEvent();
  });

  afterEach(function() {
    delete GOVUK.analytics;
  });

  it('tracks non-interactive events on start', function() {
    spyOn(GOVUK.analytics, 'trackEvent');

    element = $('\
      <div \
        data-track-category="category"\
        data-track-action="action">\
        Some content\
      </div>\
    ');

    tracker.start(element);
    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith(
      'category', 'action', {nonInteraction: 1});
  });

  it('can track non-interactive events with optional label and value', function() {
    spyOn(GOVUK.analytics, 'trackEvent');

    element = $('\
      <div \
        data-track-category="category"\
        data-track-action="action"\
        data-track-label="label"\
        data-track-value="10">\
        Some content\
      </div>\
    ');

    tracker.start(element);
    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith(
      'category', 'action', {label: 'label', value: 10, nonInteraction: 1});
  });
});
