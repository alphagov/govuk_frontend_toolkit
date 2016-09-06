// javascript 'shim' to trigger the click event of element(s)
// when the space key is pressed.
//
// usage instructions:
// GOVUK.shimLinksWithButtonRole.init();
//
// If you want to customise the shim you can pass in a custom configuration
// object with your own selector for the target elements and addional keyup
// codes if there becomes a need to do so. For example:
// GOVUK.shimLinksWithButtonRole.init({ selector: '[role="button"]' });
(function(global) {
  "use strict";

  var $ = global.jQuery;
  var GOVUK = global.GOVUK || {};

  GOVUK.shimLinksWithButtonRole = {

    // default configuration that can be overridden by passing object as second parameter to module
    config: {
      // the target element(s) to attach the shim event to
      selector: 'a[role="button"]',
      // array of keys to match against upon the keyup event
      keycodes: [
        32 // spacekey
      ]
    },

    // event behaviour (not a typical anonymous function for resuse if needed)
    triggerClickOnTarget: function triggerClickOnTarget(event) {
      // if the code from this event is in the keycodes array then
      if ($.inArray(event.which, this.config.keycodes) !== -1) {
        event.preventDefault();
        // trigger the target's click event
        event.target.click();
      }
    },

    // By default this will find all links with role attribute set to
    // 'button' and will trigger their click event when the space key (32) is pressed.
    // @method init
    // @param  {Object}   customConfig                object to override default configuration
    //         {String}   customConfig.selector       a selector for the elements to be 'clicked'
    //         {Array}    customConfig.keycodes       an array of javascript keycode values to match against that when pressed will trigger the click
    init: function init(customConfig) {
      // extend the default config with any custom attributes passed in
      this.config = $.extend(this.config, customConfig);
      // if we have found elements then:
      if($(this.config.selector).length > 0) {
        // listen to 'document' for keyup event on the elements and fire the triggerClickOnTarget
        $(document).on('keyup', this.config.selector, this.triggerClickOnTarget.bind(this));
      }
    }

  };

  // hand back to global
  global.GOVUK = GOVUK;

})(window);
