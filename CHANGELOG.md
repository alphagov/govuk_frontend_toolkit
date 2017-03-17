# 5.1.2

- Update show-hide-content.js to work with new `.multiple-choice` custom radio buttons and checkboxes, released in GOV.UK elements 3.0.0 ([PR #390](https://github.com/alphagov/govuk_frontend_toolkit/pull/390))
- Fix buttons not having an outer edge when colours are changed via browser settings - add an outline so they look like buttons. ([PR #377](https://github.com/alphagov/govuk_frontend_toolkit/pull/377))

# 5.1.1

- Update the alpha, beta and discovery colours to $govuk-blue to match the updated phase banner ([PR #370](https://github.com/alphagov/govuk_frontend_toolkit/pull/370))
- Fix radio button show/hide behaviour when used outside a form ([PR #375](https://github.com/alphagov/govuk_frontend_toolkit/pull/375))
- Fix a "Stick at top when scrolling" component bug related to scroll anchoring in Chrome 56+ ([PR #376](https://github.com/alphagov/govuk_frontend_toolkit/pull/376))
- Minor travis fixes ([PR #373](https://github.com/alphagov/govuk_frontend_toolkit/pull/373))

# 5.1.0

- Allow custom options when tracking events ([PR #365](https://github.com/alphagov/govuk_frontend_toolkit/pull/365))

# 5.0.3

- Change HMRC and DEFRA text colours for improved contrast ([PR #368](https://github.com/alphagov/govuk_frontend_toolkit/pull/368))

# 5.0.2

- Change colour used in phase tags to govuk-blue ([PR #353](https://github.com/alphagov/govuk_frontend_toolkit/pull/353))

# 5.0.1

- Fix role="button" click shim ([PR #347](https://github.com/alphagov/govuk_frontend_toolkit/pull/347))
- Make font variables lowercase ([PR #348](https://github.com/alphagov/govuk_frontend_toolkit/pull/348))
- Update selection button documentation ([PR #350](https://github.com/alphagov/govuk_frontend_toolkit/pull/350))

# 5.0.0

This release includes two breaking changes:
- Removal of external link styles and icons, if you are using the external-link-* mixins you will need to remove them from your codebase ([PR #293](https://github.com/alphagov/govuk_frontend_toolkit/pull/293))
- Correct spelling of the 'accordion' icon, you will need to check for the incorrect spelling 'accordian' and update if you are using this icon ([PR #345](https://github.com/alphagov/govuk_frontend_toolkit/pull/345))
And two minor changes:
- Amend GOVUK.StickAtTopWhenScrolling to resize the sticky element and shim when the .js-sticky-resize class is set ([PR #343](https://github.com/alphagov/govuk_frontend_toolkit/pull/343))
- Allow custom options in GOVUK.analytics.trackPageview ([#332](https://github.com/alphagov/govuk_frontend_toolkit/pull/332))

# 4.18.4

- Lint codebase using standard ([PR #334](https://github.com/alphagov/govuk_frontend_toolkit/pull/334))
- Add semicolons at the start of IIFE's ([PR #339](https://github.com/alphagov/govuk_frontend_toolkit/pull/339))

# 4.18.3

- For smaller screens (<768px) ensure that the GOVUK.StickAtTopWhenScrolling JS "unsticks" the element which was previously "stuck" (by removing both the class which sets fixed positioning and the shim). ([PR #329](https://github.com/alphagov/govuk_frontend_toolkit/pull/329))

# 4.18.2

- Remove unnecessary print font fallback that causes regression downstream ([PR #328](https://github.com/alphagov/govuk_frontend_toolkit/pull/328))
- Update tooling to use npm script rather than grunt-shell ([PR #327](https://github.com/alphagov/govuk_frontend_toolkit/pull/327))

# 4.18.1

- Fix error in IE - remove trailing comma from shimLinksWithButtonRole JavaScript ([PR #323](https://github.com/alphagov/govuk_frontend_toolkit/pull/323)).

# 4.18.0

- Add GOVUK.ShowHideContent JavaScript to support showing and hiding content, toggled by radio buttons and checkboxes ([PR #315](https://github.com/alphagov/govuk_frontend_toolkit/pull/315)).

# 4.17.0

- SelectionButtons will add a class to the label with the type of the child input ([PR #317](https://github.com/alphagov/govuk_frontend_toolkit/pull/317))

# 4.16.1

- Fix anchor-buttons.js to trigger a native click event, also rename to shimLinksWithButtonRole.js to explain what it does
- Add tests for shimLinksWithButtonRole ([PR #310](https://github.com/alphagov/govuk_frontend_toolkit/pull/310))

# 4.16.0

- Add Department for International Trade organisation ([PR #308](https://github.com/alphagov/govuk_frontend_toolkit/pull/308))

# 4.15.0

- Add support for Google Analytics fieldsObject ([PR #298](https://github.com/alphagov/govuk_frontend_toolkit/pull/298))
- anchor-buttons.js: normalise keyboard behaviour between buttons and links with a button role ([PR #297](https://github.com/alphagov/govuk_frontend_toolkit/pull/297))

# 4.14.1

- Fix tabular number sizing in Firefox ([PR #301](https://github.com/alphagov/govuk_frontend_toolkit/pull/301))

# 4.14.0

- Allow use of multiple GA customDimensionIndex. See [this section](https://github.com/alphagov/govuk_frontend_toolkit/blob/master/docs/javascript.md#using-google-custom-dimensions-with-your-own-statistical-model) of the documentation for more information.
- Configurable duration (in days) for AB Test cookie. See [this section](https://github.com/alphagov/govuk_frontend_toolkit/blob/master/docs/javascript.md#multivariate-test-framework) of the documentation for more information.
- Allow base scripts to run within a module loader. See [this PR](https://github.com/alphagov/govuk_frontend_toolkit/pull/290) for more information.

# 4.13.0

- Make headings block-level by default (PR #200). If you are styling elements you want to be inline with heading includes, you’ll need to explicitly make them inline in your CSS.

# 4.12.0

- Increase button padding to match padding from GOV.UK elements (PR #275).
If you have UI which depends on the padding set by the button mixin in the frontend toolkit and this is not overridden by button padding set by GOV.UK elements, this change will affect it.

# 4.11.0

- Remove the GDS-Logo font-face definition (PR #272)
- Move the @viewport statements to govuk_template (PR #272). If you upgrade to this version of govuk_frontend_toolkit and you’re also using govuk_template you’ll need to upgrade that to at least 0.17.2 to maintain compatibility with desktop IE10 in snap mode.

# 4.10.0

- Allow New Transport font stack to be overridden by apps using `$toolkit-font-stack`
and `$toolkit-font-stack-tabular` (PR #230)

# 4.9.1

- Fix phase banner alignment (PR #266)

# 4.9.0

- Add websafe organisation colours
- Split colours into two files with backwards-compatible colours.scss replacement

# 4.8.2

- Add GOV.UK lint to lint scss files (PR #260)
- Remove reference to old colour palette (PR #256)
- Fix link to GOV.UK elements - tabular data

# 4.8.1

- Update DEFRA brand colour to new green (PR #249)

# 4.8.0

- Pass cohort name to analytics when using multivariate test (PR #251)

# 4.7.0

- Add 'mailto' tracking to GOV.UK Analytics (PR #244)

# 4.6.1

- Use the Sass variable $light-blue for link active and hover colours (PR #242)

# 4.6.0

- Add breadcrumb styles, separator images and documentation (PR #236)
- Add fallback image for the back link (PR #235)

# 4.5.0

- Find and auto-start JavaScript modules from markup: `data-module="module-name"`(PR #227)

# 4.4.0

- Add helpers partial for functions
- Add px to em function and documentation

# 4.3.0

- Allow javascript error tracking to be filtered to avoid noise from plugins

# 4.2.1

- Track download links using events not pageviews

# 4.2.0

- Add two analytics plugins for download and external link tracking
- Update typography mixins to be mobile first (PR #157)

# 4.1.1

- Update Accessible Media Player to remove dependency on $.browser (PR #206)

# 4.1.0

- Add support for sending the `page` option to `GOVUK.analytics.trackEvent` (PR #203)

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
