describe("GOVUK.analyticsPlugins.downloadLinkTracker", function() {
  var $links;

  beforeEach(function() {
    $links = $('\
      <div class="download-links">\
        <a href="/one.pdf">PDF</a>\
        <a href="/two.xslt">Spreadsheet</a>\
        <a href="/something/uploads/system/three.doc">Document</a>\
      </div>\
      <div class="normal-links">\
        <a href="/normal-link">Normal link</a>\
        <a href="/normal-link/sub.directory/?page=thing">Weird normal link</a>\
        <a href="http://www.external-link.com/">External link</a>\
        <a href="https://www.external-link.com/download.zip">External download link</a>\
      </div>');

    $('body').append($links);
    GOVUK.analytics = {trackPageview:function(){}};
    GOVUK.analyticsPlugins.downloadLinkTracker();
  });

  afterEach(function() {
    $('body').off();
    $links.remove();
    delete GOVUK.analytics;
  });

  it('listens to click events on only download links', function() {
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

  it('tracks a download link as a pageview with a custom title', function() {
    spyOn(GOVUK.analytics, 'trackPageview');
    $('.download-links a').trigger('click');

    expect(GOVUK.analytics.trackPageview).toHaveBeenCalledWith('/one.pdf', 'PDF', {transport: 'beacon'});
    expect(GOVUK.analytics.trackPageview).toHaveBeenCalledWith('/two.xslt', 'Spreadsheet', {transport: 'beacon'});
    expect(GOVUK.analytics.trackPageview).toHaveBeenCalledWith('/something/uploads/system/three.doc', 'Document', {transport: 'beacon'});
  });
});
