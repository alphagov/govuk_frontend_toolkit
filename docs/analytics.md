# Analytics

The toolkit provides an abstraction around analytics to make tracking pageviews, events and dimensions across multiple analytics providers easier. Specifically it was created to ease the migration from Google’s Classic Analytics to Universal Analytics. It includes:

* a Google Analytics classic tracker
* a Google Analytics universal tracker
* code to asynchronously load these libraries
* a generic Analytics tracker that combines these into a single API
* sensible defaults such as anonymising IPs
* data coercion into the format required by Google Analytics (eg a custom event value must be a number, a custom dimension’s value must be a string)

## Create an analytics tracker

The minimum you need to use the analytics function is:

1. Include the following files from /javascripts/govuk/analytics in your project:
  * google-analytics-classic-tracker.js
  * google-analytics-universal-tracker.js
  * tracker.js
2. Copy the following `init` script into your own project and replace the dummy IDs with your own (they begin with `UA-`).
  * This initialisation can occur immediately as this API has no dependencies.
  * Load and create the analytics tracker at the earliest opportunity so that:
    * the time until the first pageview is tracked is kept small and pageviews aren’t missed
    * javascript that depends on `GOVUK.analytics` runs after the tracker has been created

```js
(function() {
  "use strict";

  // Load Google Analytics libraries
  GOVUK.Tracker.load();

  // Use document.domain in dev, preview and staging so that tracking works
  // Otherwise explicitly set the domain as www.gov.uk (and not gov.uk).
  var cookieDomain = (document.domain === 'www.gov.uk') ? '.www.gov.uk' : document.domain;

  // Configure profiles and make interface public
  // for custom dimensions, virtual pageviews and events
  GOVUK.analytics = new GOVUK.Tracker({
    universalId: 'UA-XXXXXXXX-X',
    classicId: 'UA-XXXXXXXX-X',
    cookieDomain: cookieDomain
  });

  // Set custom dimensions before tracking pageviews
  // GOVUK.analytics.setDimension(…)

  // Activate any event plugins eg. print intent, error tracking
  // GOVUK.analyticsPlugins.error();
  // GOVUK.analyticsPlugins.printIntent();

  // Track initial pageview
  GOVUK.analytics.trackPageview();
})();
```

Once instantiated, the `GOVUK.analytics` object can be used to track virtual pageviews, custom events and custom dimensions.

## Virtual pageviews

> Page tracking allows you to measure the number of views you had of a particular page on your web site.

* [Classic Analytics](https://developers.google.com/analytics/devguides/collection/gajs/asyncMigrationExamples#VirtualPageviews)
* [Universal Analytics](https://developers.google.com/analytics/devguides/collection/analyticsjs/pages)

Argument | Description
---------|------------
`path` (optional) | Custom path, eg `/path`
`title` (optional) | Custom page title, Universal only


```js
// Track current page
GOVUK.analytics.trackPageview();

// Track a custom path
GOVUK.analytics.trackPageview('/path');

// Track a custom path and custom page title
GOVUK.analytics.trackPageview('/path', 'Title');
```

## Custom events

> Event tracking allows you to measure how users interact with the content of your website. For example, you might want to measure how many times a button was pressed, or how many times a particular item was used.

* [Classic Analytics](https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide)
* [Universal Analytics](https://developers.google.com/analytics/devguides/collection/analyticsjs/events)

Argument | Description
---------|------------
`category` (required) | Typically the object that was interacted with, eg "JavaScript error"
`action` (required) | The type of interaction, eg a Javascript error message
`options` (optional) | Optional parameters to further describe event

Option | Description
-------|------------
`label` | Useful for categorising events, eg Javascript error source
`value` | Values must be non-negative. Useful to pass counts, eg error happened 5 times
`nonInteraction` | Defaults to false. When set the event will not affect bounce rate

```js
// Track a custom event with required category and action fields
GOVUK.analytics.trackEvent('category', 'action');

// Track a custom event with optional label, value and nonInteraction options
GOVUK.analytics.trackEvent('category', 'action', {
  label: 'label',
  value: 1,
  nonInteraction: true // event will not affect bounce rate
});
```

## Custom dimensions and custom variables

> Custom dimensions and metrics are a powerful way to send custom data to Google Analytics. Use custom dimensions and metrics to segment and measure differences between: logged in and logged out users, authors of pages, or any other business data you have on a page.

* [Classic Analytics](https://developers.google.com/analytics/devguides/collection/gajs/gaTrackingCustomVariables)
* [Universal Analytics](https://developers.google.com/analytics/devguides/collection/analyticsjs/custom-dims-mets)

Universal custom dimensions are configured within analytics. Classic custom variables rely on the javascript to additionally pass in the name and scope of the variable.

### Set custom dimensions before tracking pageviews

Many page level custom dimensions must be set before the initial pageview is tracked. Calls to `setDimension` should typically be made before the initial `trackPageview` is sent to analytics.

### Custom dimensions and variables must have matching indexes

When calling `setDimension`, the first argument (`index`) becomes the index of the Universal custom dimension as well as the slot of the Classic custom variable.

Argument | Description
---------|------------
`index` (required) | The Universal dimension’s index and and Classic variable’s slot. These must be configured to the same slot and index within analytics profiles.
`value` (required) | Value of the custom dimension/variable
`name` (required) | The name of the custom variable (classic only)
`scope` (optional) | The scope of the custom variable (classic only), defaults to a [page level scope](https://developers.google.com/analytics/devguides/collection/gajs/gaTrackingCustomVariables#pagelevel) (3) if omitted

```js
// Set a custom dimension at index 1 with value and name
GOVUK.analytics.setDimension(1, 'value', 'name');

// Set a custom dimension with an alternative scope
GOVUK.analytics.setDimension(1, 'value', 'name', 2);
```

### Create custom dimension helpers

Because dimensions and variables rely on names and indexes being set correctly, it’s helpful to create methods that abstract away the details. For example:

```js
function setPixelDensityDimension(pixelDensity) {
  GOVUK.analytics.setDimension(1, pixelDensity, 'PixelDensity', 2);
}
```

## Print tracking

Pull `print-intent.js` into your project, and initialise it after analytics (see [Create an analytics tracker, above](#create-an-analytics-tracker)), to track when users are attempting to print content.

## Error tracking

Pull `error-tracking.js` into your project, and initialise it after analytics (see [Create an analytics tracker, above](#create-an-analytics-tracker)), to track JavaScript errors.

## Tracking across domains

Once a Tracker instance has been created, tracking across domains can be set up
for pages like:

```js
GOVUK.analytics.addLinkedTrackerDomain(trackerIdHere, nameForTracker, domainToLinkTo);
```

Once this is done hits to that page will be tracked in both your local and the
named tracker, and sessions will persist to the other domain.
