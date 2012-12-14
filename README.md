# GOV.UK Frontend Toolkit

A collection of Rails/Ruby tools and templates for generating frontend
code.

## Installing

Just include `govuk_frontend_toolkit` in your `Gemfile`. It
automatically attaches itself to your asset path so the static/SCSS
files will be available to the asset pipeline.

You will need to check that the gem is included while in development. Often
asset related gems are in a bundler group called `assets`. Old Rails projects
do not inluded this in development by default so you need to ensure bundler is
included using the following lines at the top of the `/config/application.rb`:

    if defined?(Bundler)
      # If you precompile assets before deploying to production, use this line
      Bundler.require *Rails.groups(assets: %w(development test))
      # If you want your assets lazily compiled in production, use this line
      # Bundler.require(:default, :assets, Rails.env)
    end

You will also need to ensure that the correct assets are precompiled for
production. These are set using the variable `config.assets.precompile` in
`/config/application.rb`. An example of what this may look like is:

    config.assets.precompile += %w(
      application.css
      application-ie8.css
      application-ie7.css
      application-ie6.css
      application.js
    )

## Usage

At the top of a Sass file in your Rails project you should use an `@import` rule
to include the file for the mixins you require. For example if you want the
conditionals and typography mixins you should add:

    @import '_conditionals';
    @import '_typography';

## Mixin-sets

* [`_colours.scss`](#colours)
* [`_conditionals.scss`](#conditionals)
* [`_css3.scss`](#css3)
* [`_typography.scss`](#typography)

### <a id="conditionals"></a>Conditionals

Media query and IE helpers. These make producing responsive layouts and
attaching IE specific styles to elements really easy.

To use the IE conditionals you will need to add extra stylesheets for each IE which look like:

    // BASE STYLESHEET FOR IE 6 COMPILER

    $is-ie: true;
    $ie-version: 6;

    @import "application.scss";

Where `application.scss` is the name of your base stylesheet.

#### media

##### Description

`@mixin media($size: false, $max-width: false, $min-width: false)`

##### Parameters

***note: the parameters are mutually exclusive and the first one found will be
used.***

`$size`

`size` can be one of `desktop`, `tablet`, `mobile`. `desktop` and `tablet`
should be used to add styles to a mobile first stylesheet. `mobile` should be
used to add styles to a desktop first stylesheet.

It is recommended that you primarily use `desktop` for new stylesheets to
enhance mobile first when serving to mobile devices.

`@min-width`
`@max-width`

These should be set to an absolute pixel value. They will get added directly to
their respective @media queries.

##### Usage

    div.columns {
      border: 1px solid;

      @include media(desktop){
        width: 30%;
        float: left;
      }
      @include media($min-width: 500px){
        width: 25%;
      }
      @include media($max-width: 400px){
        width: 25%;
      }
    }

#### ie-lte

Conditially send CSS to IE browsers less than or equal to the named version.

##### Description

`@include ie-lte($version)`

##### Parameters

`$version`

`version` is an integer value. Possible values are `6`, `7`, `8`.

##### Usage

    div.columns {
      border: 1px solid;

      @include ie-lte(7){
        border: 0;
      }
    }


#### ie

Send CSS to a named IE version.

##### Description

`@include ie($version)`

##### Parameters

`$version`

`version` is an integer value. Possible values are `6`, `7`, `8`.

##### Usage

    div.columns {
      border: 1px solid;

      @include ie(6){
        border: 0;
      }
    }

### <a id="colours"></a>Colours

A collection of colour variables.

#### Departmental colours

* `$treasury` <span style="display:inline-block; width: 60px; height: 10px; float: right; background-color: #af292e" />
* `$cabinet-office` <span style="display:inline-block; width: 60px; height: 10px; float: right; background-color: #005abb" />
* `$department-for-education` <span style="display:inline-block; width: 60px; height: 10px; float: right; background-color: #003a69" />
* `$department-for-transport` <span style="display:inline-block; width: 60px; height: 10px; float: right; background-color: #006c56" />
* `$home-office` <span style="display:inline-block; width: 60px; height: 10px; float: right; background-color: #9325b2" />
* `$department-of-health` <span style="display:inline-block; width: 60px; height: 10px; float: right; background-color: #00ad93" />
* `$ministry-of-justice` <span style="display:inline-block; width: 60px; height: 10px; float: right; background-color: #231f20" />
* `$ministry-of-defence` <span style="display:inline-block; width: 60px; height: 10px; float: right; background-color: #4d2942" />
* `$foreign-and-commonwealth-office` <span style="display:inline-block; width: 60px; height: 10px; float: right; background-color: #003e74" />
* `$department-for-communities-and-local-government` <span style="display:inline-block; width: 60px; height: 10px; float: right; background-color: #00857e" />
* `$department-for-energy-and-climate-change` <span style="display:inline-block; width: 60px; height: 10px; float: right; background-color: #009ddb" />
* `$department-for-culture-media-and-sport` <span style="display:inline-block; width: 60px; height: 10px; float: right; background-color: #d40072" />
* `$department-for-environment-food-and-rural-affairs` <span style="display:inline-block; width: 60px; height: 10px; float: right; background-color: #898700" />
* `$department-for-work-and-pensions` <span style="display:inline-block; width: 60px; height: 10px; float: right; background-color: #00beb7" />
* `$department-for-business-innovation-and-skills` <span style="display:inline-block; width: 60px; height: 10px; float: right; background-color: #003479" />
* `$department-for-international-development` <span style="display:inline-block; width: 60px; height: 10px; float: right; background-color: #002878" />
* `$government-equalities-office` <span style="display:inline-block; width: 60px; height: 10px; float: right; background-color: #9325b2" />
* `$attorney-generals-office` <span style="display:inline-block; width: 60px; height: 10px; float: right; background-color: #9f1888" />
* `$scotland-office` <span style="display:inline-block; width: 60px; height: 10px; float: right; background-color: #002663" />
* `$wales-office` <span style="display:inline-block; width: 60px; height: 10px; float: right; background-color: #a33038" />

#### Standard palette, colours

* `$purple` <span style="display: inline-block; width: 60px; height: 10px; float: right; background-color: #2e358b" />
* `$purple-50` <span style="display: inline-block; width: 60px; height: 10px; float: right; background-color: #9799c4" />
* `$purple-25` <span style="display: inline-block; width: 60px; height: 10px; float: right; background-color: #d5d6e7" />
* `$mauve` <span style="display: inline-block; width: 60px; height: 10px; float: right; background-color: #6f72af" />
* `$mauve-50` <span style="display: inline-block; width: 60px; height: 10px; float: right; background-color: #b7b9d7" />
* `$mauve-25` <span style="display: inline-block; width: 60px; height: 10px; float: right; background-color: #e2e2ef" />
* `$fuschia` <span style="display: inline-block; width: 60px; height: 10px; float: right; background-color: #912b88" />
* `$fuschia-50` <span style="display: inline-block; width: 60px; height: 10px; float: right; background-color: #c994c3" />
* `$fuschia-25` <span style="display: inline-block; width: 60px; height: 10px; float: right; background-color: #e9d4e6" />
* `$pink` <span style="display: inline-block; width: 60px; height: 10px; float: right; background-color: #d53880" />
* `$pink-50` <span style="display: inline-block; width: 60px; height: 10px; float: right; background-color: #eb9bbe" />
* `$pink-25` <span style="display: inline-block; width: 60px; height: 10px; float: right; background-color: #f6d7e5" />
* `$baby-pink` <span style="display: inline-block; width: 60px; height: 10px; float: right; background-color: #f499be" />
* `$baby-pink-50` <span style="display: inline-block; width: 60px; height: 10px; float: right; background-color: #faccdf" />
* `$baby-pink-25` <span style="display: inline-block; width: 60px; height: 10px; float: right; background-color: #fdebf2" />
* `$red` <span style="display: inline-block; width: 60px; height: 10px; float: right; background-color: #b10e1e" />
* `$red-50` <span style="display: inline-block; width: 60px; height: 10px; float: right; background-color: #d9888c" />
* `$red-25` <span style="display: inline-block; width: 60px; height: 10px; float: right; background-color: #efcfd1" />
* `$mellow-red` <span style="display: inline-block; width: 60px; height: 10px; float: right; background-color: #df3034" />
* `$mellow-red-50` <span style="display: inline-block; width: 60px; height: 10px; float: right; background-color: #ef9998" />
* `$mellow-red-25` <span style="display: inline-block; width: 60px; height: 10px; float: right; background-color: #f9d6d6" />
* `$orange` <span style="display: inline-block; width: 60px; height: 10px; float: right; background-color: #f47738" />
* `$orange-50` <span style="display: inline-block; width: 60px; height: 10px; float: right; background-color: #fabb96" />
* `$orange-25` <span style="display: inline-block; width: 60px; height: 10px; float: right; background-color: #fde4d4" />
* `$brown` <span style="display: inline-block; width: 60px; height: 10px; float: right; background-color: #b58840" />
* `$brown-50` <span style="display: inline-block; width: 60px; height: 10px; float: right; background-color: #dac39c" />
* `$brown-25` <span style="display: inline-block; width: 60px; height: 10px; float: right; background-color: #f0e7d7" />
* `$yellow` <span style="display: inline-block; width: 60px; height: 10px; float: right; background-color: #ffbf47" />
* `$yellow-50` <span style="display: inline-block; width: 60px; height: 10px; float: right; background-color: #ffdf94" />
* `$yellow-25` <span style="display: inline-block; width: 60px; height: 10px; float: right; background-color: #fff2d3" />
* `$grass-green` <span style="display: inline-block; width: 60px; height: 10px; float: right; background-color: #85994b" />
* `$grass-green-50` <span style="display: inline-block; width: 60px; height: 10px; float: right; background-color: #c2cca3" />
* `$grass-green-25` <span style="display: inline-block; width: 60px; height: 10px; float: right; background-color: #e7ebda" />
* `$green` <span style="display: inline-block; width: 60px; height: 10px; float: right; background-color: #006435" />
* `$green-50` <span style="display: inline-block; width: 60px; height: 10px; float: right; background-color: #7fb299" />
* `$green-25` <span style="display: inline-block; width: 60px; height: 10px; float: right; background-color: #cce0d6" />
* `$turquoise` <span style="display: inline-block; width: 60px; height: 10px; float: right; background-color: #28a197" />
* `$turquoise-50` <span style="display: inline-block; width: 60px; height: 10px; float: right; background-color: #95d0cb" />
* `$turquoise-25` <span style="display: inline-block; width: 60px; height: 10px; float: right; background-color: #d5ecea" />
* `$light-blue` <span style="display: inline-block; width: 60px; height: 10px; float: right; background-color: #2b8cc4" />
* `$light-blue-50` <span style="display: inline-block; width: 60px; height: 10px; float: right; background-color: #96c6e2" />
* `$light-blue-25` <span style="display: inline-block; width: 60px; height: 10px; float: right; background-color: #d5e8f3" />

#### Standard palette, greys

* `$black` <span style="display: inline-block; width: 60px; height: 10px; float: right; background-color: #0b0c0c" />
* `$grey-1` <span style="display: inline-block; width: 60px; height: 10px; float: right; background-color: #6f777b" />
* `$grey-2` <span style="display: inline-block; width: 60px; height: 10px; float: right; background-color: #bfc1c3" />
* `$grey-3` <span style="display: inline-block; width: 60px; height: 10px; float: right; background-color: #dee0e2" />
* `$grey-4` <span style="display: inline-block; width: 60px; height: 10px; float: right; background-color: #f8f8f8" />
* `$white` <span style="display: inline-block; width: 60px; height: 10px; float: right; background-color: #fff" />

#### Semantic colour names

* `$link-colour` <span style="display: inline-block; width: 60px; height: 10px; float: right; background-color: #2e3191" />
* `$link-active-colour` <span style="display: inline-block; width: 60px; height: 10px; float: right; background-color: #2e8aca" />
* `$link-hover-colour` <span style="display: inline-block; width: 60px; height: 10px; float: right; background-color: #2e8aca" />
* `$link-visited-colour` <span style="display: inline-block; width: 60px; height: 10px; float: right; background-color: #2e3191" />
* `$text-colour: $black` <span style="display: inline-block; width: 60px; height: 10px; float: right; background-color: #0b0c0c" />
* `$secondary-text-colour` <span style="display: inline-block; width: 60px; height: 10px; float: right; background-color: #6f777b" />
* `$border-colour` <span style="display: inline-block; width: 60px; height: 10px; float: right; background-color: #bfc1c3" />
* `$panel-colour` <span style="display: inline-block; width: 60px; height: 10px; float: right; background-color: #dee0e2" />
* `$canvas-colour` <span style="display: inline-block; width: 60px; height: 10px; float: right; background-color: #f8f8f8" />
* `$highlight-colour` <span style="display: inline-block; width: 60px; height: 10px; float: right; background-color: #f8f8f8" />
* `$page-colour` <span style="display: inline-block; width: 60px; height: 10px; float: right; background-color: #fff" />

#### Usage:

    .column {
      background: $green;
    }

### <a id="typography"></a>Typography

A collection of font-mixins. There are two different types of font mixins.

1. Heading and Copy styles which are the font with added paddings to ensure a
   consistent baseline vertical grid.
2. Core styles which are base font styles with no extra padding.

#### Heading and Copy styles

The following heading and copy styles exist:

* `heading-80`
* `heading-48`
* `heading-36`
* `heading-27`
* `heading-24`
* `copy-19`
* `copy-16`
* `copy-14`

##### Usage

    h2 {
      @include heading-27;
    }

#### Core styles

The following core styles exist:

* `core-80`
* `core-48`
* `core-36`
* `core-27`
* `core-24`
* `core-19`
* `core-16`
* `core-14`

##### Description

`@include core-[size]($line-height, $line-height-640)`

##### Parameters

`$line-height` and `$line-height-640` are both optional. When used it is
recomended to pass a fraction in for readability.

##### Usage

    h1 {
      @include core-48;
    }
    h2 {
      @include core-24($line-height: (50/24), $line-height-640: (18/16));
    }

### <a id="css3"></a>css3

CSS3 helpers to abstract vendor prefixes.

#### border-radius

##### Description

`@mixin border-radius($radius)`

##### Parameters

`$radius` a pixel value.

##### Usage

    .column {
      @include border-radius(5px);
    }

#### box-shadow

##### Description

`@mixin box-shadow($shadow)`

##### Parameters

`$shadow` a value set to pass into [`box-shadow`](https://developer.mozilla.org/en-US/docs/CSS/box-shadow).

##### Usage

    .column {
      @include box-shadow(0 0 5px black);
    }

#### translate

##### Description

`@mixin translate($x, $y)`

##### Parameters

`$x` and `$y` are css values.

##### Usage

    .column {
      @include translate(2px, 3px);
    }

#### gradient

This can currently only handle linear top to bottom gradients.

##### Description

`@mixin gradient($from, $to)`

##### Parameters

`$from` and `$to` are colour values.

##### Usage

    .column {
      @include gradient(#000, #fff);
    }

#### transition

##### Description

`@mixin transition($property, $duration, $function)`

##### Parameters

Match up with the respective properties from [`transition`](https://developer.mozilla.org/en-US/docs/CSS/transition).

##### Usage

    .column {
      @include transition(left, 3s, ease);
    }

#### box-sizing

##### Description

`@mixin box-sizing($type)`

##### Parameters

`$type` is one of `border-box`, `content-box` and `padding-box`.

##### Usage

    .column {
      @include box-sizing(border-box);
    }


## JavaScript

The gem also includes some JavaScript which by itself will have no effect on a
page. It can be included with the asset_pipeline by adding the line:

    //=require govuk_toolkit

## Licence

Released under the MIT Licence, a copy of which can be found in the file `LICENCE`.
