// Stop scrolling at footer.
//
// This can be added to elements with `position: fixed` to stop them from
// overflowing on the footer.
//
// Usage:
//
//    GOVUK.stopScrollingAtFooter.addEl($(node), $(node).height());
//
// Height is passed in separatly incase the scrolling element has no height
// itself.


(function () {
  "use strict"
  var root = this,
      $ = root.jQuery;
  if(typeof root.GOVUK === 'undefined') { root.GOVUK = {}; }

  var stopScrollingAtFooter = {
    _hasScrolled: false,
    _scrollTimeout: false,
    _els: [],

    addEl: function($fixedEl, height){
      var footer = $('#footer');
      if (footer.length === 0) {
        return;
      }

      var fixedOffset = parseInt($fixedEl.css('top'), 10);
      fixedOffset = isNaN(fixedOffset) ? 0 : fixedOffset;

      stopScrollingAtFooter.footerTop = footer.offset().top - 10;

      var $siblingEl = $('<div></div>');
      $siblingEl.insertBefore($fixedEl);
      var fixedTop = $siblingEl.offset().top - $siblingEl.position().top;
      $siblingEl.remove();

      var el = {
        $fixedEl: $fixedEl,
        height: height + fixedOffset,
        stopTopPosition: stopScrollingAtFooter.footerTop - height - fixedTop,
        state: 'fixed'
      };
      stopScrollingAtFooter._els.push(el);

      stopScrollingAtFooter.initTimeout();
    },
    initTimeout: function(){
      if(stopScrollingAtFooter._scrollTimeout === false) {
        $(window).scroll(stopScrollingAtFooter.onScroll);
        stopScrollingAtFooter._scrollTimeout = window.setInterval(stopScrollingAtFooter.checkScroll, 25);
      }
    },
    onScroll: function(){
      stopScrollingAtFooter._hasScrolled = true;
    },
    checkScroll: function(){
      if(stopScrollingAtFooter._hasScrolled === true){
        stopScrollingAtFooter._hasScrolled = false;

        var windowScrollTop = $(window).scrollTop();

        $.each(stopScrollingAtFooter._els, function(i, el){
          var bottomOfEl = windowScrollTop + el.height;

          if (bottomOfEl > stopScrollingAtFooter.footerTop){
            stopScrollingAtFooter.stick(el);
          } else {
            stopScrollingAtFooter.unstick(el);
          }
        });
      }
    },
    stick: function(el){
      if(el.state === 'fixed' && el.$fixedEl.css('position') === 'fixed'){
        el.$fixedEl.css({ 'position': 'absolute', 'top': el.stopTopPosition });
        el.state = 'absolute';
      }
    },
    unstick: function(el){
      if(el.state === 'absolute'){
        el.$fixedEl.css({ 'position': '', 'top': '' });
        el.state = 'fixed';
      }
    }
  };

  root.GOVUK.stopScrollingAtFooter = stopScrollingAtFooter;
}).call(this);
