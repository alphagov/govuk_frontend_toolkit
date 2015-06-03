# 4.0.1

- Fix: stop multiline text from dropping below phase tag.

# 4.0.0

- Remove Google Analytics classic https://github.com/alphagov/govuk_frontend_toolkit/pull/194
  - References to google-analytics-classic-tracker.js should be removed
- Rename GOVUK.Tracker to GOVUK.Analytics
  - References to GOVUK.Tracker should be updated

# 3.5.1

- Changes Analytics API library to accept one, both or neither of the
analytics tracking codes. This means we can start removing classic
tracking codes from apps.

#3.5.0

- Adds cross domain tracking to Analytics API library: https://github.com/alphagov/govuk_frontend_toolkit/pull/185
- Adds sass variables for discovery and live phases

#3.4.2

- Fix: Before this fix, when a user fell into variant 0 of a multivariate test,
the data wouldn't be reported to Google correctly because of a broken
null check in the code block that opts the user into the Google Content
Experiment.

# 3.4.1

- Fix: Make the error colour a darker red for greater contrast and to meet WCAG 2.0 AAAA
(this was meant to go into 3.3.1 but was lost from history)
- Add `$focus-colour` variable (#180)

# 3.4.0

- multivariate-test.js: add support for using Google Content Experiments as the reporting
backend for multivariate tests

# 3.3.1

- Fix: Make the error colour a darker red for greater contrast and to meet WCAG 2.0 AAAA

# 3.3.0

- Add: Analytics - pageview tracking for a print attempt

# 3.2.1

- Fix: Analytics - don't run error and print plugins on load

# 3.2.0

- Add: Analytics API https://github.com/alphagov/govuk_frontend_toolkit/pull/162 https://github.com/alphagov/govuk_frontend_toolkit/blob/master/docs/analytics.md

# 3.1.0

- Fix: outdent to add right margin rather than only left
- Fix: add missing semi-colons in JavaScript files
- Fix: use box-sizing mixin in column mixin to support more browsers
- Add: ability to specify float direction on column mixin
- Add: Sass-lint tests

# 3.0.1

- Fix a bug with the npm publishing. npm requires a version change to publish a package.

# 3.0.0

- Change publishing method to not use git submodules in govuk_frontend_toolkit_npm.
  This is a major version bump because it will move the toolkit from
  `./node_modules/govuk_frontend_toolkit/govuk_frontend_toolkit/`
  to `./node_modules/govuk_frontend_toolkit/`, which will break relative imports in Sass.
- Fix typo in Sass comment

# 2.0.1

- Fix new grid helpers to ensure content using %site-width-container is centred in IE.

# 2.0.0

- Add support for selection-button events to be document-level https://github.com/alphagov/govuk_frontend_toolkit/pull/139
- The `GOVUK.selectionButtons` interface is now deprecated. Details are in the [README](https://github.com/alphagov/govuk_frontend_toolkit#deprecated-functionality).

# 1.7.0

- Create new grid helpers for creating grid layouts
- The old grid mixins; `@outer-block` and `@inner-block` are now deprecated

# 1.6.2

- Reset font family for print stylesheets to fix print errors in browsers and printers

# 1.6.1

- Fix visited link colour to be a colour which passes contrast

# 1.6.0

 - abstraction of the core typography mixins into single core mixin
 - reference to composer module added to README
 - selection buttons added to manifest for localSpecRunner
 - test for sass compilation
 - fix for selection buttons

# 1.5.0

- polyfill for Function.prototype.bind added
- selection-buttons script added
- local runner added for Jasmine tests

# 1.4.0

- New phase banner styles
- Removed trailing commas
- Redrawn important icon

# 1.3.0

- Adds weighting to multivariant testing

# 1.2.0

- add three quarters variable to measurements
- improvements to CSS3 mixins
- set inner block mixin to use either padding or margin
- increase button padding to match alphagov/static defaults

# 1.1.0

Add icons from alphagov/static

# 1.0.1

Fix contrast on phase banner

# 1.0.0

Considered stable
