The GOV.UK Design System launched on 22 June 2018 🔥
===============

GOV.UK Frontend Toolkit has now been replaced by the GOV.UK Design System. The Toolkit will remain available in case you are currently using it, but is no longer maintained. The Government Digital Service will only carry out major bug fixes and security patches.

The GOV.UK Design System will be updated to ensure the things it contains meet level AA of WCAG 2.1, but GOV.UK Frontend Toolkit will not. [Read more about accessibility of the GOV.UK Design System](https://design-system.service.gov.uk/accessibility/).

# GOV.UK frontend toolkit

A collection of Sass and JavaScript files for using as part of your
application's frontend.

This project is not tied to a specific language and is designed to be used
as a dependency in as many different languages as needed.

There's a `Gemfile` and a `package.json` in this directory, but they are only
for running tests and are not an indication that this project prefers
Ruby or Node.js.

## Installing

### Ruby on Rails

We recommend you use the [govuk_frontend_toolkit_gem][toolkit_gem_github] and
follow the [installation instructions][toolkit_gem_github_readme].

[toolkit_gem_github]: https://github.com/alphagov/govuk_frontend_toolkit_gem
[toolkit_gem_github_readme]: https://github.com/alphagov/govuk_frontend_toolkit_gem#readme

### Node.js

[govuk_frontend_toolkit_npm][toolkit_npm_github] is an NPM package that can be
[installed or included in your package.json][toolkit_npm].

[toolkit_npm_github]: https://github.com/alphagov/govuk_frontend_toolkit_npm
[toolkit_npm]: https://npmjs.org/package/govuk_frontend_toolkit

If you are using a build tool that depends on Libsass then you
may need to upgrade to a more recent version to use the grid helpers. Minimal
compatible versions include `node-sass` 1.0.0, `grunt-sass` 0.16.0,
`gulp-sass` 1.2.0 and `libsass` 3.0.0.

### Django

Requirement: [NodeJS](https://nodejs.org/en/) installed. This gives you [Node Package Manager](https://docs.npmjs.com/getting-started/installing-node)(NPM) which is required to install npm packages.

The easiest way to integrate it would be to create a `package.json` file in your application with `npm init` 

You then install the toolkit with `npm install --save govuk_frontend_toolkit`.
If you need javascript files, they will live in (`node_modules/govuk_frontend_toolkit/javascripts`).
If you need stylesheets they will live in (`node_modules/govuk_frontend_toolkit/stylesheets`).

With Django you can use https://github.com/jrief/django-sass-processor to compile Sass files.

Note: if you need complete styles you might want to install govuk-elements-sass package that also installs toolkit

### Other projects

#### Using the tagged versions

Each version of the toolkit is tagged with the version number in this format:

`v*version number*`, for example `v4.1.1` for version 4.1.1.

If your dependency management tool allows the use of Git repositories as dependencies, you can point to a version by using its tag.

For example, if you are using [bower](http://bower.io), you can add the toolkit to your `bower.json` like so:

`"govuk_frontend_toolkit": "git://github.com/alphagov/govuk_frontend_toolkit#v4.1.1"` (assuming you want version 4.1.1)

#### Using git submodules

You can include the toolkit as a [git submodule][git submodule].

[git submodule]: https://git-scm.com/book/en/v2/Git-Tools-Submodules

To add the submodule to your project run the following command substituting the path to a subdirectory in your project's assets directory:

    $ git submodule add https://github.com/alphagov/govuk_frontend_toolkit.git ./path/to/assets/govuk_frontend_toolkit

We recommend you use `https` rather than `ssh` for submodules as they don't require key exchanges when deploying to remote servers.

If you clone a project with the toolkit submodule installed you will need to initialise the submodule with the following command:

    $ git submodule init

To update the toolkit to the latest version you can use:

    $ git submodule update

## Running tests

Tests for this project use Jasmine for the JavaScript and Ruby's `scss` and `scss-lint`
to check the stylesheets.

The requirements are Node.js 0.8 or higher and PhantomJS, and Ruby:

```bash
bundle install
npm install
npm test
```

### Standard JavaScript
`govuk_frontend_toolkit` uses [standardjs](http://standardjs.com/), an opinionated JavaScript linter.
All JavaScript files follow its conventions. [Read more](https://github.com/alphagov/govuk_prototype_kit/blob/master/docs/linting.md)

### Using the local test runner

The test suite can be run by opening the `./spec/support/LocalTestRunner.html` file in a browser for a more detailed trace of errors.

The files for unit tests and any supporting JavaScript should be added to `./spec/manifest.js` file.

## Usage

At the top of a Sass file in your project you should use an `@import` rule
to include the file for the mixins you require, eg if you want the
conditionals and typography mixins you should add:

    @import '_conditionals';
    @import '_typography';

You may need to include the relative path to the toolkit if it is installed as a submodule:

    @import '../toolkit/_conditionals';

If you are compiling Sass from the [command-line tool](http://sass-lang.com/docs/yardoc/file.SASS_REFERENCE.html#using_sass), here are some options we recommend.

In development:

    sass --style expanded --line-numbers --load-path [path to]/govuk_frontend_toolkit/stylesheets input.scss output.css

In production:

    sass --style compressed --load-path [path to]/govuk_frontend_toolkit/stylesheets input.scss output.css

## Documentation

* [Mixin-sets](/docs/mixins.md)
  * [Grid layout](/docs/mixins.md#grid-layout)
  * [Conditionals](/docs/mixins.md#conditionals)
  * [Colours](/docs/mixins.md#colours)
  * [Typography](/docs/mixins.md#typography)
  * [CSS3](/docs/mixins.md#css3)
  * [Buttons](/docs/mixins.md#buttons)
  * [Phase banner](/docs/mixins.md#-phase-banner)
  * [Phase tags](/docs/mixins.md#-phase-tags)
* [JavaScript](/docs/javascript.md)
  * [Modules](/docs/javascript.md#modules)
  * [Media player](/docs/javascript.md#media-player)
  * [Primary links](/docs/javascript.md#primary-links)
  * [Stick at top when scrolling](/docs/javascript.md#stick-at-top-when-scrolling)
  * [Selection buttons](/docs/javascript.md#selection-buttons)
  * [Shim links with button role](/docs/javascript.md#shim-links-with-button-role)
  * [Show/Hide content](/docs/javascript.md#showhide-content)
* [Analytics](/docs/analytics.md)
  * [Create an analytics tracker](/docs/analytics.md#create-an-analytics-tracker)
  * [Virtual pageviews](/docs/analytics.md#virtual-pageviews)
  * [Custom events](/docs/analytics.md#custom-events)
  * [Custom dimensions and custom variables](/docs/analytics.md#custom-dimensions-and-custom-variables)
  * [Print tracking](/docs/analytics.md#print-tracking-print-intentjs)
  * [Error tracking](/docs/analytics.md#error-tracking-error-trackingjs)
  * [External link tracking](/docs/analytics.md#external-link-tracking-external-link-trackerjs)
  * [Download link tracking](/docs/analytics.md#download-link-tracking-download-link-trackerjs)
  * [Mailto link tracking](/docs/analytics.md#mailto-link-tracking-mailto-link-trackerjs)

## Licence

Released under the MIT Licence, a copy of which can be found in the file `LICENCE`.
