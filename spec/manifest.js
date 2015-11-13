// Paths are relative to the /spec/support folder
var manifest = {
  support : [
    '../../node_modules/jquery/dist/jquery.js',
    '../../javascripts/govuk/modules.js',
    '../../javascripts/govuk/modules/auto-track-event.js',
    '../../javascripts/govuk/multivariate-test.js',
    '../../javascripts/govuk/primary-links.js',
    '../../javascripts/govuk/stick-at-top-when-scrolling.js',
    '../../javascripts/govuk/stop-scrolling-at-footer.js',
    '../../javascripts/govuk/selection-buttons.js',
    '../../javascripts/govuk/analytics/google-analytics-universal-tracker.js',
    '../../javascripts/govuk/analytics/analytics.js',
    '../../javascripts/govuk/analytics/error-tracking.js',
    '../../javascripts/govuk/analytics/external-link-tracker.js',
    '../../javascripts/govuk/analytics/download-link-tracker.js'
  ],
  test : [
    '../unit/ModulesSpec.js',
    '../unit/Modules/AutoTrackEventSpec.js',
    '../unit/MultivariateTestSpec.js',
    '../unit/PrimaryLinksSpec.js',
    '../unit/StickAtTopWhenScrollingSpec.js',
    '../unit/SelectionButtonSpec.js',
    '../unit/analytics/GoogleAnalyticsUniversalTrackerSpec.js',
    '../unit/analytics/AnalyticsSpec.js',
    '../unit/analytics/ErrorTrackingSpec.js',
    '../unit/analytics/ExternalLinkTrackerSpec.js',
    '../unit/analytics/DownloadLinkTrackerSpec.js'
  ]
};
