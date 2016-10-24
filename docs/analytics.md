# Analytics

The toolkit provides an abstraction around analytics to make tracking pageviews, events and dimensions across multiple analytics providers easier. Specifically it was created to ease the migration from Google’s Classic Analytics to Universal Analytics. It includes:

* a Google Analytics universal tracker wrapper
* code to asynchronously load universal analytics
* a generic Analytics wrapper that allows multiple trackers to be configured
* sensible defaults such as anonymising IPs
* data coercion into the format required by Google Analytics (eg a custom dimension’s value must be a string)

## Create an analytics tracker

The minimum you need to use the analytics function is:

1. Include the following files from /javascripts/govuk/analytics in your project:
  * google-analytics-universal-tracker.js
  * analytics.js
2. Copy the following `init` script into your own project and replace the dummy IDs with your own (they begin with `UA-`).
  * This initialisation can occur immediately as this API has no dependencies.
  * Load and create the analytics tracker at the earliest opportunity so that:
    * the time until the first pageview is tracked is kept small and pageviews aren’t missed
    * javascript that depends on `GOVUK.analytics` runs after the tracker has been created

```js
(function() {
  "use strict";

  // Load Google Analytics libraries
  GOVUK.Analytics.load();

  // Use document.domain in dev, preview and staging so that tracking works
  // Otherwise explicitly set the domain as www.gov.uk (and not gov.uk).
  var cookieDomain = (document.domain === 'www.gov.uk') ? '.www.gov.uk' : document.domain;

  // Configure profiles and make interface public
  // for custom dimensions, virtual pageviews and events
  GOVUK.analytics = new GOVUK.Analytics({
    universalId: 'UA-XXXXXXXX-X',
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

// As above, plus additional options passed into the `pageview` call
GOVUK.analytics.trackPageview('/path', 'Title', {
  sessionControl: 'start'
});
```

## Custom events

> Event tracking allows you to measure how users interact with the content of your website. For example, you might want to measure how many times a button was pressed, or how many times a particular item was used.

* [Universal Analytics](https://developers.google.com/analytics/devguides/collection/analyticsjs/events)

Argument | Description
---------|------------
`category` (required) | Typically the object that was interacted with, eg "JavaScript error"
`action` (required) | The type of interaction, eg a Javascript error message
`options` (optional) | Optional parameters to further describe event

Option | Description
-------|------------
`page`  | Useful for sending the URL when `window.location` has been updated using JavaScript since the Analytics tracking object was created
`label` | Useful for categorising events, eg Javascript error source
`value` | Values must be non-negative. Useful to pass counts, eg error happened 5 times
`nonInteraction` | Defaults to false. When set the event will not affect bounce rate

```js
// Track a custom event with required category and action fields
GOVUK.analytics.trackEvent('category', 'action');

// Track a custom event with optional page, label, value and nonInteraction options
GOVUK.analytics.trackEvent('category', 'action', {
  page: '/path/to/page',
  label: 'label',
  value: 1,
  nonInteraction: true // event will not affect bounce rate
});
```

## Custom dimensions

> Custom dimensions and metrics are a powerful way to send custom data to Google Analytics. Use custom dimensions and metrics to segment and measure differences between: logged in and logged out users, authors of pages, or any other business data you have on a page.

* [Universal Analytics](https://developers.google.com/analytics/devguides/collection/analyticsjs/custom-dims-mets)

Universal custom dimensions are configured within analytics.

### Set custom dimensions before tracking pageviews

Many page level custom dimensions must be set before the initial pageview is tracked. Calls to `setDimension` should typically be made before the initial `trackPageview` is sent to analytics.

Argument | Description
---------|------------
`index` (required) | The Universal dimension’s index as configured in the profile.
`value` (required) | Value of the custom dimension

```js
// Set a custom dimension at index 1 with value and name
GOVUK.analytics.setDimension(1, 'value');
```

### Create custom dimension helpers

Because dimensions rely on the correct index and that index doesn’t indicate its purpose, it’s helpful to create methods that abstract away the details. For example:

```js
function setPixelDensityDimension(pixelDensity) {
  GOVUK.analytics.setDimension(1, pixelDensity);
}
```

## Tracking across domains

Once an Analytics instance has been created, tracking across domains can be set up
for pages like:

```js
GOVUK.analytics.addLinkedTrackerDomain(trackerIdHere, nameForTracker, domainToLinkTo);
```

Once this is done hits to that page will be tracked in both your local and the
named tracker, and sessions will persist to the other domain.

## Plugins

Plugins are namespaced to `GOVUK.analyticsPlugins`. They should be pulled in by your project and initialised after `GOVUK.analytics` (see [Create an analytics tracker, above](#create-an-analytics-tracker)).

### Print tracking (`print-intent.js`)

Track when users are attempting to print content. The plugin sends a `Print intent` event and a `/print` prefixed pageview:

Example event:

Category | Action
---------|-------
Print Intent | `/current/page`

Example pageview:

`/print/current/page`

### Error tracking (`error-tracking.js`)

Track JavaScript errors, capturing the error message, file and line number. These events don’t affect bounce rate. Errors can be filtered to include only files of interest by passing in an options argument with a regexp matcher (to avoid tracking errors generated by browser plugins):

```js
GOVUK.analyticsPlugins.error({filenameMustMatch: /gov\.uk/});
```

Category | Action | Label | Value
---------|--------|-------|-------
JavaScript Error | The error message | file.js: line number | 1

### External link tracking (`external-link-tracker.js`)

The tracker will send an event for clicks on links beginning, `http` and linking outside of the current host. By default the plugin uses Google Analytics’ `transport: beacon` method so that events are tracked even if the page unloads.

Category | Action | Label
---------|--------|-------
External Link Clicked | http://www.some-external-website.com | Link text


### Download link tracking (`download-link-tracker.js`)

The tracker will send an event for clicks on any link that matches the selector passed in. A selector must be provided. By default the plugin uses Google Analytics’ `transport: beacon` method so that events are tracked even if the page unloads.

```js
GOVUK.analyticsPlugins.downloadTracker({selector: 'a[rel="download"]'});
```

Category | Action | Label
---------|--------|-------
Download Link Clicked | `/some/upload/attachment/file.pdf` | Link text

### Mailto link tracking (`mailto-link-tracker.js`)

The tracker will send events for clicks on links beginning with `mailto`. By default the
plugin uses Google Analytics’ `transport: beacon` method so that events are tracked even if the page unloads.

Category | Action | Label
---------|--------|-------
Mailto Link Clicked | mailto:name@email.com | Link text
