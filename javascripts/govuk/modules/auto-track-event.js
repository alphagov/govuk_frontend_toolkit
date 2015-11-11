(function(Modules) {
  "use strict";

  Modules.AutoTrackEvent = function() {
    this.start = function(element) {
      var options = {nonInteraction: 1}, // automatic events shouldn't affect bounce rate
          category = element.data('track-category'),
          action = element.data('track-action'),
          label = element.data('track-label'),
          value = element.data('track-value');

      if (typeof label === "string") {
        options.label = label;
      }

      if (value || value === 0) {
        options.value = value;
      }

      if (GOVUK.analytics && GOVUK.analytics.trackEvent) {
        GOVUK.analytics.trackEvent(category, action, options);
      }
    }
  };

})(window.GOVUK.Modules);
