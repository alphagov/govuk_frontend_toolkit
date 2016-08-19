describe("anchor-buttons", function () {
  var $body;
  var $anchorButton;
  var keyupEvent;

  beforeEach(function () {
    $anchorButton = $('<a role="button">Button</a>');
    $anchorButton.on('click',function(){
      $anchorButton.addClass('clicked');
    });
    $(document.body).append($anchorButton);
    keyupEvent = $.Event('keyup');
    keyupEvent.target = $anchorButton.get(0);
    GOVUK.anchorButtons.init();
  });

  afterEach(function () {
    $anchorButton.remove();
    $(document).off('keyup');
  });

  it('should trigger event on space', function(){
    // Ideally we’d test the page loading functionality but that seems hard to
    // do within a Jasmine context. Settle for checking a bound event trigger.
    keyupEvent.which = 32; // Space character
    $(document).trigger(keyupEvent);
    expect($anchorButton.hasClass('clicked')).toBe(true);
  });

  it('should not trigger event on tab', function(){
    keyupEvent.which = 9; // Tab character
    $(document).trigger(keyupEvent);
    expect($anchorButton.hasClass('clicked')).toBe(false);
  });

});
