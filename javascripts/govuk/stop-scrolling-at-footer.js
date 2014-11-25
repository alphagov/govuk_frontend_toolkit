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
  "use strict";
  var root = this,
      $ = root.jQuery;
  if(typeof root.GOVUK === 'undefined') { root.GOVUK = {}; }

  var stopScrollingAtFooter = {
    _pollingId: null,
    _isPolling: false,
    _hasScrollEvt: false,
    _els: [],

    addEl: function($fixedEl, height){
      var fixedOffset;

      if(!$fixedEl.length) { return; }

      fixedOffset = parseInt($fixedEl.css('top'), 10);
      fixedOffset = isNaN(fixedOffset) ? 0 : fixedOffset;

      stopScrollingAtFooter.updateFooterTop();
      $(root).on('govuk.pageSizeChanged', stopScrollingAtFooter.updateFooterTop);

      var $siblingEl = $('<div></div>');
      $siblingEl.insertBefore($fixedEl);
      var fixedTop = $siblingEl.offset().top - $siblingEl.position().top;
      $siblingEl.remove();

      var el = {
        $fixedEl: $fixedEl,
        height: height + fixedOffset,
        fixedTop: height + fixedTop,
        state: 'fixed'
      };
      stopScrollingAtFooter._els.push(el);

      stopScrollingAtFooter.initTimeout();
    },
    updateFooterTop: function(){
      var footer = $('.js-footer:eq(0)');
      if (footer.length === 0) {
        return 0;
      }
      stopScrollingAtFooter.footerTop = footer.offset().top - 10;
    },
    initTimeout: function(){
      if(stopScrollingAtFooter._hasScrollEvt === false) {
        $(window).scroll(stopScrollingAtFooter.onScroll);
        stopScrollingAtFooter._hasScrollEvt = true;
      }
    },
    onScroll: function(){
      if (stopScrollingAtFooter._isPolling === false) { 
        stopScrollingAtFooter.startPolling();
      }
    },
    startPolling: (function(){
      if (window.requestAnimationFrame) {
        return (function(){
          var callback = function(){
            stopScrollingAtFooter.checkScroll();
            if (stopScrollingAtFooter._isPolling === true) {
              stopScrollingAtFooter.startPolling();
            }
          };
          stopScrollingAtFooter._pollingId = window.requestAnimationFrame(callback);
          stopScrollingAtFooter._isPolling = true;
        });
      } else {
        return (function(){
          stopScrollingAtFooter._pollingId = window.setInterval(stopScrollingAtFooter.checkScroll, 16);
          stopScrollingAtFooter._isPolling = true;
        });
      }
    }()),
    stopPolling: (function(){
      if (window.requestAnimationFrame) {
        return (function(){
          window.cancelAnimationFrame(stopScrollingAtFooter._pollingId);
          stopScrollingAtFooter._isPolling = false;
        });
      } else {
        return (function(){
          window.clearInterval(stopScrollingAtFooter._pollingId);
          stopScrollingAtFooter._isPolling = false;
        });
      }
    }()),
    checkScroll: function(){
      var cachedScrollTop = $(window).scrollTop();
      if ((cachedScrollTop < (stopScrollingAtFooter.cachedScrollTop + 2)) && (cachedScrollTop > (stopScrollingAtFooter.cachedScrollTop - 2))) {
        stopScrollingAtFooter.stopPolling();
        return;
      } else {
        stopScrollingAtFooter.cachedScrollTop = cachedScrollTop;
      }

      $.each(stopScrollingAtFooter._els, function(i, el){
        var bottomOfEl = cachedScrollTop + el.height;

        if (bottomOfEl > stopScrollingAtFooter.footerTop){
          stopScrollingAtFooter.stick(el);
        } else {
          stopScrollingAtFooter.unstick(el);
        }
      });
    },
    stick: function(el){
      if(el.state === 'fixed' && el.$fixedEl.css('position') === 'fixed'){
        el.$fixedEl.css({ 'position': 'absolute', 'top': stopScrollingAtFooter.footerTop - el.fixedTop });
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

  $(root).load(function(){ $(root).trigger('govuk.pageSizeChanged'); });
}).call(this);
