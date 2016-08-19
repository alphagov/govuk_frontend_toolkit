describe("shim-links-with-button-role", function () {
  var $body;
  var $buttonLink;
  var keyupEvent;

  beforeEach(function () {
    $buttonLink = $('<a role="button">Button</a>');
    $buttonLink.on('click',function(){
      $buttonLink.addClass('clicked');
    });
    $(document.body).append($buttonLink);
    keyupEvent = $.Event('keyup');
    keyupEvent.target = $buttonLink.get(0);
    GOVUK.shimLinksWithButtonRole.init();
  });

  afterEach(function () {
    $buttonLink.remove();
    $(document).off('keyup');
  });

  it('should trigger event on space', function(){
    // Ideally we’d test the page loading functionality but that seems hard to
    // do within a Jasmine context. Settle for checking a bound event trigger.
    keyupEvent.which = 32; // Space character
    $(document).trigger(keyupEvent);
    expect($buttonLink.hasClass('clicked')).toBe(true);
  });

  it('should not trigger event on tab', function(){
    keyupEvent.which = 9; // Tab character
    $(document).trigger(keyupEvent);
    expect($buttonLink.hasClass('clicked')).toBe(false);
  });

});
