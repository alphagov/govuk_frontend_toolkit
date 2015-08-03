describe("GOVUK.analyticsPlugins.externalLinkTracker", function() {
  var $links;

  beforeEach(function() {
    $links = $('\
      <div class="external-links">\
        <a href="http://www.nationalarchives.gov.uk"> National Archives </a>\
        <a href="https://www.nationalarchives.gov.uk"></a>\
        <a href="https://www.nationalarchives.gov.uk/one.pdf">National Archives PDF</a>\
        <a href="https://www.nationalarchives.gov.uk/an/image/link.png"><img src="/img" /></a>\
      </div>\
      <div class="internal-links">\
        <a href="/some-path">Local link</a>\
        <a href="http://fake-hostname.com/some-path">Another local link</a>\
      </div>');

    $('html').on('click', function(evt) { evt.preventDefault(); });
    $('body').append($links);
    GOVUK.analytics = {trackEvent:function(){}};

    spyOn(GOVUK.analyticsPlugins.externalLinkTracker, 'getHostname').and.returnValue('fake-hostname.com');
    GOVUK.analyticsPlugins.externalLinkTracker();
  });

  afterEach(function() {
    $('html').off();
    $('body').off();
    $links.remove();
    delete GOVUK.analytics;
  });

  it('listens to click events on only external links', function() {
    spyOn(GOVUK.analytics, 'trackEvent');

    $('.external-links a').each(function() {
      $(this).trigger('click');
      expect(GOVUK.analytics.trackEvent).toHaveBeenCalled();
      GOVUK.analytics.trackEvent.calls.reset();
    });

    $('.internal-links a').each(function() {
      $(this).trigger('click');
      expect(GOVUK.analytics.trackEvent).not.toHaveBeenCalled();
      GOVUK.analytics.trackEvent.calls.reset();
    });
  });

  it('listens to click events on elements within external links', function() {
    spyOn(GOVUK.analytics, 'trackEvent');

    $('.external-links a img').trigger('click');
    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith(
      'External Link Clicked', 'https://www.nationalarchives.gov.uk/an/image/link.png', {transport: 'beacon'});
  });

  it('tracks an external link\'s href and link text', function() {
    spyOn(GOVUK.analytics, 'trackEvent');
    $('.external-links a').trigger('click');

    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith(
      'External Link Clicked', 'http://www.nationalarchives.gov.uk', {transport: 'beacon', label: 'National Archives'});

    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith(
      'External Link Clicked', 'https://www.nationalarchives.gov.uk', {transport: 'beacon'});

    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith(
      'External Link Clicked', 'https://www.nationalarchives.gov.uk/one.pdf', {transport: 'beacon', label: 'National Archives PDF'});
  });
});
