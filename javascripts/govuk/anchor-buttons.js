(function(global, customConfig) {
  "use strict"; 
       
  var $ = global.jQuery;
  var GOVUK = global.GOVUK || {};  

  GOVUK.anchorButtons = {
    
    // default configuration that can be overridden by passing object as second parameter to module
    config: $.extend({
      // setting to true will disable the init function upon execution
      disableInit: false,
      // the target element(s) to attach the shim event to
      selector: 'a[role="button"]',
      // array of keys to match against upon the keyup event
      keycodes: [
        32 // spacekey
      ],
    }, customConfig),
    
    // event behaviour (not a typical anonymous function for resuse if needed)
    triggerClickOnTarget: function triggerClickOnTarget(event) {
      var code = event.charCode || event.keyCode; 
      // if the keyCode/charCode from this event is in the keycodes array then 
      if ($.inArray(code, this.config.keycodes) !== -1) {
        event.preventDefault();
        // trigger the target's click event
        $(event.target).trigger("click");
      }
    },
    
    // init function (so it can be executed again if needed)
    init: function init() { 
      var $elms = $(this.config.selector);
      // if found elements that match the selector in config (or customConfig) then
      if($elms.length > 0) {
        // iterate them giving access to current scope
        $elms.each(function(index, elm){
          // attach triggerClickOnTarget with current scope to the keyup event
          $(elm).on('keyup', this.triggerClickOnTarget.bind(this));
        }.bind(this));
      }
    }

  };

  // if disbaleInit is not true then run the init method
  if(!GOVUK.anchorButtons.config.disableInit) {
    GOVUK.anchorButtons.init(); 
  }
  
  // hand back to global
  global.GOVUK = GOVUK;
      
})(window);