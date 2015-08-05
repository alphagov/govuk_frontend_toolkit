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
    GOVUK.analytics = {trackPageview:function(){}};
    GOVUK.analyticsPlugins.downloadLinkTracker({selector: 'a[href$=".pdf"], a[href$=".xslt"], a[href$=".doc"], a[href$=".png"]'});
  });

  afterEach(function() {
    $('html').off();
    $('body').off();
    $links.remove();
    delete GOVUK.analytics;
  });

  it('listens to clicks on links that match the selector', function() {
    spyOn(GOVUK.analytics, 'trackPageview');

    $('.download-links a').each(function() {
      $(this).trigger('click');
      expect(GOVUK.analytics.trackPageview).toHaveBeenCalled();
      GOVUK.analytics.trackPageview.calls.reset();
    });

    $('.normal-links a').each(function() {
      $(this).trigger('click');
      expect(GOVUK.analytics.trackPageview).not.toHaveBeenCalled();
      GOVUK.analytics.trackPageview.calls.reset();
    });
  });

  it('listens to click events on elements within download links', function() {
    spyOn(GOVUK.analytics, 'trackPageview');

    $('.download-links a img').trigger('click');
    expect(GOVUK.analytics.trackPageview).toHaveBeenCalledWith('/an/image/link.png', '', {transport: 'beacon'});
  });

  it('tracks a download link as a pageview with a custom title', function() {
    spyOn(GOVUK.analytics, 'trackPageview');
    $('.download-links a').trigger('click');

    expect(GOVUK.analytics.trackPageview).toHaveBeenCalledWith('/one.pdf', 'PDF', {transport: 'beacon'});
    expect(GOVUK.analytics.trackPageview).toHaveBeenCalledWith('/two.xslt', 'Spreadsheet', {transport: 'beacon'});
    expect(GOVUK.analytics.trackPageview).toHaveBeenCalledWith('/something/uploads/system/three.doc', 'Document', {transport: 'beacon'});
  });
});
