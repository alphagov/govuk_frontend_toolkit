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
