// = require_tree ./govuk

(function () {
  if (window.GOVUK.analytics && window.GOVUK.analytics.trackEvent) {
    GOVUK.analytics.trackEvent('Toolkit', 'govuk_toolkit.js', {
      label: window.location.pathname,
      nonInteraction: true
    })
  }
}
)()
