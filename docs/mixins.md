## Mixin-sets

* [`_grid_layout.scss`](#grid-layout)
* [`_conditionals.scss`](#conditionals)
* [`_colours.scss`](#colours)
* [`_css3.scss`](#css3)
* [`_typography.scss`](#typography)
* [`design-patterns/_buttons.scss`](#buttons)
* [`design-patterns/_alpha-beta.scss`](#alpha-beta)
* [`design-patterns/_breadcrumbs.scss`](#breadcrumbs)

### <a id="grid-layout"></a>Grid layout

Grid helpers to enable easy cross browser grids. The grids use absolute widths
in older versions of IE or percentage based widths in modern browsers.

- `%site-width-container` creates a 960px wide elastic container for you site content block
- `%grid-row` container for a row of columns
- `@mixin grid-column($width, $full-width: tablet)` a mixin to create grid columns of fraction width

These three grid helpers are designed to be used together and aren't guaranteed
to work or behave in a predictable way if used in isolation.

There is also an `%outdent-to-full-width` selector which can be extended to
outdent and element and cause it to take up the edge gutters and butt up to the
edge of smaller screens.

#### Usage:

```
#page-container {
  @extend %site-width-container;
}
.grid-row {
  @extend %grid-row;

  .column-third {
    @include grid-column( 1/3 );
  }
  .column-two-thirds {
    @include grid-column( 2/3 );
  }
}
.hero-image {
  @extend %outdent-to-full-width;
}


<div id="page-container">
  <div class="grid-row">
    <div class="column-two-thirds">
      Main content
    </div>
    <div class="column-third">
      Sidebar
    </div>
  </div>

  <div class="hero-image">
    <img ...>
  </div>
</div>
```

### <a id="conditionals"></a>Conditionals

Media query and IE helpers. These make producing responsive layouts and
attaching IE specific styles to elements really easy.

To use the IE conditionals you will need to add extra stylesheets for each IE,
there's an example of how to do this in the [GOV.UK template](https://github.com/alphagov/govuk_template/blob/master/source/views/layouts/govuk_template.html.erb#L9-L12).

    <!--[if gt IE 8]><!--><link href="<%= asset_path "govuk-template.css" %>" media="screen" rel="stylesheet" type="text/css" /><!--<![endif]-->
    <!--[if IE 6]><link href="<%= asset_path "govuk-template-ie6.css" %>" media="screen" rel="stylesheet" type="text/css" /><![endif]-->
    <!--[if IE 7]><link href="<%= asset_path "govuk-template-ie7.css" %>" media="screen" rel="stylesheet" type="text/css" /><![endif]-->
    <!--[if IE 8]><link href="<%= asset_path "govuk-template-ie8.css" %>" media="screen" rel="stylesheet" type="text/css" /><![endif]-->

The conditional logic ensures that only one stylesheet is downloaded.

    <!--[if gt IE 8]><!--> // [1]
        <link href="<%= asset_path "govuk-template.css" %>" media="screen" rel="stylesheet" type="text/css" />
    <!--<![endif]--> // [1]

    [1] Note the comment syntax to hide this stylesheet from IE 6-8.

At the top of each stylesheet, you will need:

    $is-ie: true;
    $ie-version: 6; // [1]
    @import "application.scss"; // [2]

  [1] This example is for ie6.css, use 6, 7 or 8 as required here
  [2] Here `application.scss` is the name of your main stylesheet

There are examples for [an IE 6 stylesheet](https://github.com/alphagov/govuk_elements/blob/master/public/sass/main-ie6.scss), [an IE 7 stylesheet](https://github.com/alphagov/govuk_elements/blob/master/public/sass/main-ie7.scss) and [an IE 8 stylesheet](https://github.com/alphagov/govuk_elements/blob/master/public/sass/main-ie8.scss).

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

`$min-width`
`$max-width`

These should be set to an absolute pixel value. They will get added directly to
their respective @media queries.

`$ignore-for-ie`

Styles that would normally be wrapped in @media queries by this mixin will be instead
added to the main block if the `$is-ie` variable is true.

Setting `$ignore-for-ie` to `true` means those styles will not be added.

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
* `$department-for-environment-food-and-rural-affairs` <span style="display:inline-block; width: 60px; height: 10px; float: right; background-color: #00a33b" />
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

#### Changing font

Typography mixins use a “New Transport” font stack by default.

If you are using the toolkit on projects that aren’t GOVUK branded you can
override the font using two variables: `$toolkit-font-stack` and
`$toolkit-font-stack-tabular`. These must be declared before they are used, eg by
the core typography mixins.

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

#### Tabular numbers

Tabular numbers have numerals of a standard fixed width. As all numbers have the same width, sets of numbers may be more easily compared. We recommend using them where different numbers are likely to be compared, or where different numbers should line up with each other, eg in tables.

`$tabular-numbers` is an optional variable that may be passed to the heading, copy and core styles to use (or explicitly not use) tabular numbers. When no variable is passed, the default is non-tabular.

##### Usage

    h1 {
      @include core-48;
    }
    h2 {
      @include core-24($tabular-numbers: true);
    }

[See an example of tabular numbers in a table](http://govuk-elements.herokuapp.com/data/#data-table-numeric)

#### external links

`external-link-default` sets up the background image for all external links.
This should be included on the default link style for a project.

After setting the default, apply includes from the following for different font sizes:

* `external-link-12`
* `external-link-12-no-hover`
* `external-link-13`
* `external-link-13-no-hover`
* `external-link-14`
* `external-link-14-bold-no-hover`
* `external-link-16`
* `external-link-16-bold-no-hover`
* `external-link-19`
* `external-link-19-no-hover`

`external-link-heading` is a unique style a background image for headings to groups of external links.

This uses the `file-url` helper which will by default output an `image-url` to
be used with Compass or Rails Asset Pipeline, if you want to use a static path
then set the `$path` variable to point to the public location of the toolkit
image assets.

#### Description

For a set style:

`@include external-link-[style]`

For a specific font size:

`@include external-link-[size]-[weight]-[no-hover]`

#### Usage

    /* Default link style */
    a[rel="external"] {
      @include external-link-default;
      @include external-link-19;
    }

    th.external-link {
      @include external-link-heading;
    }

    .inner a[rel="external"] {
      @include external-link-16;
    }

    .departments a[rel="external"] {
     @include external-link-16-bold-no-hover;
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

`@mixin transition($property, $duration, $function, $delay:0s)`

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

#### calc

##### Description

`@mixin calc($property, $calc)`

##### Parameters

`$property` the property to apply the calc to.
`$calc` the calculation to.

##### Usage

    .column {
      @include calc(width, "300% - 20px");
    }

### <a id="buttons"></a>Buttons

A mixin for creating buttons in the GOV.UK style.

##### Description

`@mixin button($colour)`

##### Parameters

`$colour` the background colour of the button (default is `$green`).

##### Usage

    .button{
      @include button;
    }
    .button-secondary{
      @include button($grey-3);
    }
    .button-warning{
      @include button($red);
    }

##### Notes

The button text colour is set by the mixin to either light or dark, depending on the button background colour.

If you're applying these styles to non form elements, adding a class of 'disabled' to the element will emulate the disabled button style.


### <a id="alpha-beta"></a> Phase banner

A mixin to create a GOV.UK Phase banner, with alpha/beta tag inside.

#### Description

`@mixin phase-banner($state)`

`$state` is either `alpha` or `beta`.

`$state` sets the background colour of the phase tag to the appropriate alpha or beta colour.

##### Phase banner - Alpha

    .phase-banner  {
      @include phase-banner(alpha);
    }

    <div class="phase-banner">
      <p>
        <strong class="phase-tag">ALPHA</strong>
        <span>This is a new service – your <a href="#">feedback</a> will help us to improve it.</span>
      </p>
    </div>

##### Phase banner - Beta

    .phase-banner  {
      @include phase-banner(beta);
    }

    <div class="phase-banner">
      <p>
        <strong class="phase-tag">BETA</strong>
        <span>This is a new service – your <a href="#">feedback</a> will help us to improve it.</span>
      </p>
    </div>

### <a id="phase-tags"></a> Phase tags

A mixin to create an alpha/beta tag.

#### Description

`@mixin phase-tag($state)`

`$state` is either `alpha` or `beta`.

`$state` sets the background colour of the phase tag to the appropriate alpha or beta colour.

##### Phase tag - Alpha

    .alpha-tag{
      @include phase-tag(alpha);
    }
    <h2>
      Apply using the new service <span class="alpha-tag">ALPHA</span>
    </h2>

##### Phase tag - Beta

    .beta-tag{
      @include phase-tag(beta);
    }
    <h2>
      Apply using the new service <span class="beta-tag">BETA</span>
    </h2>

### <a id="breadcrumbs"></a> Breadcrumbs

A mixin for creating breadcrumb navigation, showing page hierarchy in the GOV.UK style.

#### Description

`@mixin breadcrumbs`

#### Usage

    .breadcrumbs {
      @include breadcrumbs;
    }

    <div class="breadcrumbs">
      <ol role="breadcrumbs">
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          <a href="/section-name">Section name</a>
        </li>
        <li>
          Page name
        </li>
      </ol>
    </div>
