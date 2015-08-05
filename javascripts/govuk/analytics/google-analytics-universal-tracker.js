(function() {
  "use strict";
  window.GOVUK = window.GOVUK || {};

  var GoogleAnalyticsUniversalTracker = function(id, cookieDomain) {
    configureProfile(id, cookieDomain);
    anonymizeIp();

    function configureProfile(id, cookieDomain) {
      sendToGa('create', id, {'cookieDomain': cookieDomain});
    }

    function anonymizeIp() {
      // https://developers.google.com/analytics/devguides/collection/analyticsjs/advanced#anonymizeip
      sendToGa('set', 'anonymizeIp', true);
    }
  };

  GoogleAnalyticsUniversalTracker.load = function() {
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
                             m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
  };

  // https://developers.google.com/analytics/devguides/collection/analyticsjs/pages
  GoogleAnalyticsUniversalTracker.prototype.trackPageview = function(path, title, options) {
    var options = options || {};

    if (typeof path === "string") {
      var pageviewObject = {
            page: path
          };

      if (typeof title === "string") {
        pageviewObject.title = title;
      }

      // Set the transport method for the pageview
      // Typically used for enabling `navigator.sendBeacon` when the page might be unloading
      // https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference#transport
      if (options.transport) {
        pageviewObject.transport = options.transport;
      }

      sendToGa('send', 'pageview', pageviewObject);
    } else {
      sendToGa('send', 'pageview');
    }
  };

  // https://developers.google.com/analytics/devguides/collection/analyticsjs/events
  GoogleAnalyticsUniversalTracker.prototype.trackEvent = function(category, action, options) {
    var value,
        options = options || {},
        evt = {
          hitType: 'event',
          eventCategory: category,
          eventAction: action
        };

    // Label is optional
    if (typeof options.label === "string") {
      evt.eventLabel = options.label;
    }

    // Page is optional
    if (typeof options.page === "string") {
      evt.page = options.page;
    }

    // Value is optional, but when used must be an
    // integer, otherwise the event will be invalid
    // and not logged
    if (options.value || options.value === 0) {
      value = parseInt(options.value, 10);
      if (typeof value === "number" && !isNaN(value)) {
        evt.eventValue = value;
      }
    }

    // Prevents an event from affecting bounce rate
    // https://developers.google.com/analytics/devguides/collection/analyticsjs/events#implementation
    if (options.nonInteraction) {
      evt.nonInteraction = 1;
    }

    // Set the transport method for the event
    // Typically used for enabling `navigator.sendBeacon` when the page might be unloading
    // https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference#transport
    if (options.transport) {
      evt.transport = options.transport;
    }

    sendToGa('send', evt);
  };

  /*
    https://developers.google.com/analytics/devguides/collection/analyticsjs/social-interactions
    network – The network on which the action occurs (e.g. Facebook, Twitter)
    action – The type of action that happens (e.g. Like, Send, Tweet)
    target – Specifies the target of a social interaction.
             This value is typically a URL but can be any text.
  */
  GoogleAnalyticsUniversalTracker.prototype.trackSocial = function(network, action, target) {
    sendToGa('send', {
      'hitType': 'social',
      'socialNetwork': network,
      'socialAction': action,
      'socialTarget': target
    });
  };

  /*
   https://developers.google.com/analytics/devguides/collection/analyticsjs/cross-domain
   trackerId - the UA account code to track the domain against
   name      - name for the tracker
   domain    - the domain to track
  */
  GoogleAnalyticsUniversalTracker.prototype.addLinkedTrackerDomain = function(trackerId, name, domain) {
    sendToGa('create',
             trackerId,
             'auto',
             {'name': name});
    // Load the plugin.
    sendToGa('require', 'linker');
    sendToGa(name + '.require', 'linker');

    // Define which domains to autoLink.
    sendToGa('linker:autoLink', [domain]);
    sendToGa(name + '.linker:autoLink', [domain]);

    sendToGa(name + '.set', 'anonymizeIp', true);
    sendToGa(name + '.send', 'pageview');
  };

  // https://developers.google.com/analytics/devguides/collection/analyticsjs/custom-dims-mets
  GoogleAnalyticsUniversalTracker.prototype.setDimension = function(index, value) {
    sendToGa('set', 'dimension' + index, String(value));
  };

  function sendToGa() {
    if (typeof window.ga === "function") {
      ga.apply(window, arguments);
    }
  }

  GOVUK.GoogleAnalyticsUniversalTracker = GoogleAnalyticsUniversalTracker;
})();
