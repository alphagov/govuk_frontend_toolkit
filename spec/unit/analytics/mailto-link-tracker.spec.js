describe("GOVUK.analyticsPlugins.mailtoLinkTracker", function() {
  var $links;

  beforeEach(function() {
    $links = $('\
      <div class="mailto-links">\
        <a href="mailto:name1@email.com"></a>\
        <a href="mailto:name2@email.com">The link for a mailto</a>\
        <a href="mailto:name3@email.com"><img src="/img" /></a>\
      </div>');

    $('html').on('click', function(evt) { evt.preventDefault(); });
    $('body').append($links);
    GOVUK.analytics = {trackEvent:function(){}};

    GOVUK.analyticsPlugins.mailtoLinkTracker();
  });

  afterEach(function() {
    $('html').off();
    $('body').off();
    $links.remove();
    delete GOVUK.analytics;
  });

  it('listens to click events on mailto links', function() {
    spyOn(GOVUK.analytics, 'trackEvent');

    $('.mailto-links a').each(function() {
      $(this).trigger('click');
      expect(GOVUK.analytics.trackEvent).toHaveBeenCalled();
      GOVUK.analytics.trackEvent.calls.reset();
    });
  });

  it('tracks mailto addresses and link text', function() {
    spyOn(GOVUK.analytics, 'trackEvent');
    $('.mailto-links a').trigger('click');

    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith(
      'Mailto Link Clicked', 'mailto:name1@email.com', {transport: 'beacon'});

    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith(
      'Mailto Link Clicked', 'mailto:name2@email.com', {transport: 'beacon', label: 'The link for a mailto'});
  });

  it('listens to click events on elements within mailto links', function() {
    spyOn(GOVUK.analytics, 'trackEvent');

    $('.mailto-links a img').trigger('click');
    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith(
      'Mailto Link Clicked', 'mailto:name3@email.com', {transport: 'beacon'});
  });
});
