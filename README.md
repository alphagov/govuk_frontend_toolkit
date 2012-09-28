# GOV.UK Frontend Toolkit

A collection of Rails/Ruby tools and templates for generating frontend
code.

## Installing

Just include `govuk_frontend_toolkit` in your `Gemfile`. It
automatically attaches itself to your asset path so the static/SCSS
files will be available to the asset pipeline.

## Usage

At the top of a Sass file in your Rails project you should be able to include
the mixins that you require. For example if you want the conditionals and
typography mixins you should add:

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

It is recommended that you primarily use `desktop` for new styleseets to
enhance mobile first as serving to mobile devices.

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

* `$treasury`
* `$cabinet-office`
* `$department-for-education`
* `$department-of-transport`
* `$home-office`
* `$department-of-health`
* `$ministry-of-justice`
* `$ministry-of-defence`
* `$foreign-and-commonwealth-office`
* `$department-for-communities-and-local-government`
* `$department-for-energy-and-climate-change`
* `$department-for-culture-media-and-sport`
* `$department-for-environment-food-and-rural-affairs`
* `$department-for-work-and-pensions`
* `$department-for-business-innovation-and-skills`
* `$department-for-international-development`
* `$government-equalities-office`
* `$attorney-generals-office`
* `$scotland-office`
* `$wales-office`

#### Standard palette, colours
* `$purple`
* `$purple-50`
* `$purple-25`
* `$mauve`
* `$mauve-50`
* `$mauve-25`
* `$fuschia`
* `$fuschia-50`
* `$fuschia-25`
* `$pink`
* `$pink-50`
* `$pink-25`
* `$baby-pink`
* `$baby-pink-50`
* `$baby-pink-25`
* `$red`
* `$red-50`
* `$red-25`
* `$mellow-red`
* `$mellow-red-50`
* `$mellow-red-25`
* `$orange`
* `$orange-50`
* `$orange-25`
* `$brown`
* `$brown-50`
* `$brown-25`
* `$yellow`
* `$yellow-50`
* `$yellow-25`
* `$grass-green`
* `$grass-green-50`
* `$grass-green-25`
* `$green`
* `$green-50`
* `$green-25`
* `$turquoise`
* `$turquoise-50`
* `$turquoise-25`
* `$light-blue`
* `$light-blue-50`
* `$light-blue-25`

#### Standard palette, greys

* `$charcoal-grey`
* `$dark-blue-grey`
* `$light-blue-grey`
* `$light-warm-grey`
* `$cool-grey`
* `$white`
* `$light-beige`
* `$light-tan`

#### Pure greys

* `$black`
* `$grey-20`
* `$grey-40`
* `$grey-63`
* `$grey-76`
* `$grey-88`
* `$grey-95`
* `$white`

#### Usage:

    .column {
      background: $green;
    }

### <a id="typography"></a>Typography

A collection of font-mixins. There are two different types of font mixins. One
which is the font with added paddings to ensure a consistent baseline vertical
grid. The other is a base font style with no extra padding.

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

`$type` is one of `border`, `content` and `padding`.

##### Usage

    .column {
      @include box-sizing(border);
    }


