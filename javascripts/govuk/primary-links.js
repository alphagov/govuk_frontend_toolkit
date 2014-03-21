(function() {
  "use strict";
  window.GOVUK = window.GOVUK || {};

  // Only show the first {n} items in a list, documentation is in the README.md
  var PrimaryList = function(el, selector){
    this.$el = $(el);
    this.$extraLinks = this.$el.find('li:not('+selector+')');
    // only hide more than one extra link
    if(this.$extraLinks.length > 1){
      this.addToggleLink();
      this.hideExtraLinks();
    }
  }
  PrimaryList.prototype = {
    toggleText: function(){
      if(this.$extraLinks.length > 1){
        return '+'+ this.$extraLinks.length +' others';
      } else {
        return '+'+ this.$extraLinks.length +' other';
      }
    },
    addToggleLink: function(){
      this.$toggleLink = $('<a href="#">'+ this.toggleText() + '</a>')
      this.$toggleLink.click($.proxy(this.toggleLinks, this));
      this.$toggleLink.insertAfter(this.$el);
    },
    toggleLinks: function(e){
      e.preventDefault();
      this.$toggleLink.remove();
      this.showExtraLinks();
    },
    hideExtraLinks: function(){
      this.$extraLinks.addClass('visuallyhidden');
      $(window).trigger('govuk.pageSizeChanged')
    },
    showExtraLinks: function(){
      this.$extraLinks.removeClass('visuallyhidden');
      $(window).trigger('govuk.pageSizeChanged')
    }
  };
  GOVUK.PrimaryList = PrimaryList;

  GOVUK.primaryLinks = {
    init: function(selector){
      $(selector).parent().each(function(i, el){
        new GOVUK.PrimaryList(el, selector);
      });
    }
  }
}());
