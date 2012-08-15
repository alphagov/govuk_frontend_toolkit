# GOV.UK Frontend Toolkit

A collection of Rails/Ruby tools and templates for generating frontend
code.

## Installing

Just include `govuk_frontend_toolkit` in your `Gemfile`. It
automatically attaches itself to your asset path so the static/SCSS
files will be available to the asset pipeline.

## SCSS Mix-Ins

There are several helper mix-ins included for creating modern applications:

* `_conditionals` contains `media-query` and cross-browser helpers to
  structure conditional CSS inline with basic code;
* `_css3` contains mix-ins to help with modern (and often vendor
  prefixed) CSS properties and abstract the vendor work away from the
  implementer.
