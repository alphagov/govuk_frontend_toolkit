// files are loaded from the /spec/support folder so paths are relative to that
var manifest = {
  support : [
    '../../node_modules/jquery-browser/lib/jquery.js',
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
