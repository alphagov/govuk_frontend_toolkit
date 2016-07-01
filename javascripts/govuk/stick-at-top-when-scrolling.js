(function (global) {
  "use strict";

  var $ = global.jQuery;
  var GOVUK = global.GOVUK || {};

  // Stick elements to top of screen when you scroll past, documentation is in the README.md
  var sticky = {
    _hasScrolled: false,
    _scrollTimeout: false,

    init: function(){
      var $els = $('.js-stick-at-top-when-scrolling');

      if($els.length > 0){
        sticky.$els = $els;

        if(sticky._scrollTimeout === false) {
          $(global).scroll(sticky.onScroll);
          sticky._scrollTimeout = global.setInterval(sticky.checkScroll, 50);
        }
        $(global).resize(sticky.onResize);
      }
      if(GOVUK.stopScrollingAtFooter){
        $els.each(function(i,el){
          var $img = $(el).find('img');
          if($img.length > 0){
            var image = new Image();
            image.onload = function(){
              GOVUK.stopScrollingAtFooter.addEl($(el), $(el).outerHeight());
            };
            image.src = $img.attr('src');
          } else {
            GOVUK.stopScrollingAtFooter.addEl($(el), $(el).outerHeight());
          }
        });
      }
    },
    onScroll: function(){
      sticky._hasScrolled = true;
    },
    checkScroll: function(){
      if(sticky._hasScrolled === true){
        sticky._hasScrolled = false;

        var windowVerticalPosition = $(global).scrollTop();
        sticky.$els.each(function(i, el){
          var $el = $(el),
              scrolledFrom = $el.data('scrolled-from');

          if (scrolledFrom && windowVerticalPosition < scrolledFrom){
            sticky.release($el);
          } else if($(global).width() > 768 && windowVerticalPosition >= $el.offset().top) {
            sticky.stick($el);
          }
        });
      }
    },
    stick: function($el){
      if (!$el.hasClass('content-fixed')) {
        $el.data('scrolled-from', $el.offset().top);
        var height = Math.max($el.height(), 1);
        $el.before('<div class="shim" style="width: '+ $el.width() + 'px; height: ' + height + 'px">&nbsp;</div>');
        $el.css('width', $el.width() + "px").addClass('content-fixed');
      }
    },
    release: function($el){
      if($el.hasClass('content-fixed')){
        $el.data('scrolled-from', false);
        $el.removeClass('content-fixed').css('width', '');
        $el.siblings('.shim').remove();
      }
    }
  };
  GOVUK.stickAtTopWhenScrolling = sticky;
  global.GOVUK = GOVUK;
})(window);
