describe("GOVUK.analyticsPlugins.downloadLinkTracker", function() {
  var $links;

  beforeEach(function() {
    $links = $('\
      <div class="download-links">\
        <a href="/one.pdf">PDF</a>\
        <a href="/two.xslt">Spreadsheet</a>\
        <a href="/something/uploads/system/three.doc">Document</a>\
        <a href="/an/image/link.png"><img src="/img" /></a>\
      </div>\
      <div class="normal-links">\
        <a href="/normal-link">Normal link</a>\
        <a href="/another-link">Another link</a>\
      </div>');

    $('html').on('click', function(evt) { evt.preventDefault(); });
    $('body').append($links);
    GOVUK.analytics = {trackEvent:function(){}};
    GOVUK.analyticsPlugins.downloadLinkTracker({selector: 'a[href$=".pdf"], a[href$=".xslt"], a[href$=".doc"], a[href$=".png"]'});
  });

  afterEach(function() {
    $('html').off();
    $('body').off();
    $links.remove();
    delete GOVUK.analytics;
  });

  it('listens to clicks on links that match the selector', function() {
    spyOn(GOVUK.analytics, 'trackEvent');

    $('.download-links a').each(function() {
      $(this).trigger('click');
      expect(GOVUK.analytics.trackEvent).toHaveBeenCalled();
      GOVUK.analytics.trackEvent.calls.reset();
    });

    $('.normal-links a').each(function() {
      $(this).trigger('click');
      expect(GOVUK.analytics.trackEvent).not.toHaveBeenCalled();
      GOVUK.analytics.trackEvent.calls.reset();
    });
  });

  it('listens to click events on elements within download links', function() {
    spyOn(GOVUK.analytics, 'trackEvent');

    $('.download-links a img').trigger('click');
    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('Download Link Clicked', '/an/image/link.png', {transport: 'beacon'});
  });

  it('tracks a download link as an event with link text as the label', function() {
    spyOn(GOVUK.analytics, 'trackEvent');
    $('.download-links a').trigger('click');

    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith(
      'Download Link Clicked', '/one.pdf', {label: 'PDF', transport: 'beacon'});
    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith(
      'Download Link Clicked', '/two.xslt', {label: 'Spreadsheet', transport: 'beacon'});
    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith(
      'Download Link Clicked', '/something/uploads/system/three.doc', {label: 'Document', transport: 'beacon'});
  });
});
