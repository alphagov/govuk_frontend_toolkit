describe("stick-at-top-when-scrolling", function(){
  var $stickyElement,
      $stickyWrapper;

  beforeEach(function(){
    $stickyElement = $('<div class="stick-at-top-when-scrolling"></div>');
    $stickyWrapper = $('<div>').append($stickyElement);

    $('body').append($stickyWrapper);
  });

  afterEach(function(){
    $stickyWrapper.remove();
  });

  it('should add fixed class on stick', function(){
    expect(!$stickyElement.hasClass('content-fixed')).toBe(true);
    GOVUK.stickAtTopWhenScrolling.stick($stickyElement);
    expect($stickyElement.hasClass('content-fixed')).toBe(true);
  });

  it('should remove fixed class on release', function(){
    $stickyElement.addClass('content-fixed');
    GOVUK.stickAtTopWhenScrolling.release($stickyElement);
    expect(!$stickyElement.hasClass('content-fixed')).toBe(true);
  });

  it('should insert shim when sticking content', function(){
    expect($('.shim').length).toBe(0);
    GOVUK.stickAtTopWhenScrolling.stick($stickyElement);
    expect($('.shim').length).toBe(1);
  });

  it('should insert shim with minimum height', function(){
    GOVUK.stickAtTopWhenScrolling.stick($stickyElement);
    expect($('.shim').height()).toBe(1);
  });
});

