## JavaScript

The gem also includes some JavaScript which by itself will have no effect on a
page. It can be included with the asset_pipeline by adding the line:

    //=require govuk_toolkit

## Modules

The toolkit comes with a module pattern that makes it easy to write re-usable modular components, without having to worry about where and when the module should be instantiated.

### Usage

Javascript modules can be specified in markup using `data-` attributes:

```html
<div data-module="some-module">
  <strong>Some other markup inside the module</strong>
</div>
```

Modules can be found and started by including `govuk/modules.js` and running:

```javascript
$(document).ready(function(){
  GOVUK.modules.start()
});
```

This will attempt to find and start all modules in the page. For the example above it will look for a module at `GOVUK.Modules.SomeModule`. Note the value of the data attribute has been converted to _PascalCase_.

The module will be instantiated and then its `start` method called. The HTML element with the `data-module` attribute is passed as the first argument to the module. This limits modules to acting only within their containing elements.

```javascript
module = new GOVUK.Modules[type]()
module.start(element)
```

Running `GOVUK.modules.start()` multiple times will have no additional affect. When a module is started a flag is set on the element using the data attribute `module-started`. `data-module-started` is a reserved attribute. It can however be called with an element as the first argument, to allow modules to be started in dynamically loaded content:

```javascript
var $container = $('.dynamic-content')
GOVUK.modules.start($container)
```

### Module structure

A module must add its constructor to `GOVUK.Modules` and it must have a `start` method.
The simplest module looks like:

```javascript
;(function(Modules) {
  'use strict'

  Modules.SomeModule = function() {
    this.start = function($element) {
      // module code
    }
  }
})(window.GOVUK.Modules)
```

### Writing modules

Whilst this isn’t prescriptive, it helps if modules look and behave in a similar manner.

#### Use `js-` prefixed classes for interaction hooks

Make it clear where a javascript module will be applying behaviour:

```html
<div data-module="toggle-thing">
  <a href="/" class="js-toggle">Toggle</a>
  <div class="js-toggle-target">Target</div>
</div>
```

#### Declare event listeners at the start

Beginning with a set of event listeners clearly indicates the module’s intentions.

```js
this.start = function($element) {
  $element.on('click', '.js-toggle', toggle)
  $element.on('click', '.js-cancel', cancel)
}
```

Where possible, assign listeners to the module element to minimise the number of listeners and to allow for flexible markup:

```html
<div data-module="toggle-thing">
  <a href="/" class="js-toggle">This toggles</a>
  <div class="js-toggle-target">
    <p>Some content</p>
    <a href="/" class="js-toggle">This also toggles</a>
  </div>
</div>
```

#### Use data-attributes for configuration

Keep modules flexible by moving configuration to data attributes on the module’s element:

```html
<div
  data-module="html-stream"
  data-url="/some/endpoint"
  data-refresh-ms="5000">
  <!-- updates with content from end point -->
</div>
```

#### Include Jasmine specs

Modules should have their own tests, whether they’re being included with the toolkit or are app specific.

## Media player

There is a forked version of the Nomensa video player included and custom
GOV.UK styles to be used with it. To use it you will need to include the script
on your page and include the styles nested under an appropriate selector. For
example:

    @import "design-patterns/media-player";

    .media-player {
      @include media-player;
    }

You will also need to create your own initalizer to target the links you want
to turn into videos. There are examples of how this works in the [Nomensa
Accesible Media Player][nomensa] repository.

[nomensa]: https://github.com/nomensa/Accessible-Media-Player/tree/master/example

## Primary Links

`GOVUK.PrimaryList` hides elements in a list which don't have a supplied
selector, they will then be shown when the user clicks. `GOVUK.primaryLinks` is
a helper to add this behaviour to many elements.

Example markup:

```html
<ul id="primary-list">
  <li class="primary-item">Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ul>
```

To add it to all lists which have items with the class `primary-item` use
something like:

```javascript
GOVUK.primaryLinks.init('.primary-item')
```

Or to add it just to that list you could use:

```javascript
new GOVUK.PrimaryList($('#primary-list'), '.primary-item')
```

## Stick at top when scrolling

`GOVUK.stickAtTopWhenScrolling` tries to add a class to an element when the top
of that element would be scrolled out of the viewport.

The following would cause the element to stay when you scroll:

```html
<div class="js-stick-at-top-when-scrolling">something</div>
```

```css
.content-fixed {
  position: fixed;
  top: 0;
}
.shim {
  display: block;
}
```

```javascript
GOVUK.stickAtTopWhenScrolling.init()
```

If you also include `stop-scrolling-at-footer.js` this will stop
the elements overlapping the footer.

## Selection buttons

>If you are using GOV.UK Elements version 3.0.0 or above you *do not need* to include and initialise `GOVUK.SelectionButtons` to apply the correct radio button and checkbox styling. This module is deprecated and will be removed in the future.

`GOVUK.SelectionButtons` adds classes to a parent `<label>` of a radio button or checkbox, allowing you to style it based on the input’s state. Given this example HTML structure:

```html
<label>
  <input type="radio" name="size" value="medium" />
  Medium size
</label>
```

When the input is focused or its `checked` attribute is set, representative classes are added to the label.

### Usage

#### GOVUK.SelectionButtons

To apply this behaviour to elements that follow the above HTML, call the `GOVUK.SelectionButtons` constructor with a jQuery collection of the inputs:

```javascript
var $buttons = $('label input[type=radio], label input[type=checkbox]')
var selectionButtons = new GOVUK.SelectionButtons($buttons)
```

If you want to bind your events to the document instead of the elements directly (delegated events) you can call `GOVUK.SelectionButtons` with a selector string:

```javascript
var selectionButtons = new GOVUK.SelectionButtons('label input[type=radio], label input[type=checkbox]')
```

This will bind all events to the document meaning any new elements (for example, by AJAX) that match this selector will automatically gain this functionality.

If you do add elements that need this functionality dynamically to the page, you will need to initialise their state. You can do this by calling `SelectionButtons.setInitialState` with the same selector string:

```javascript
var buttonSelector = 'label input[type=radio], label input[type=checkbox]'
var selectionButtons = new GOVUK.SelectionButtons(buttonSelector)
```

then later, after adding more elements:

```javascript
selectionButtons.setInitialState(buttonSelector)
```

The classes that get added to the `<label>` tags can be passed in as options:

```javascript
var $buttons = $('label input[type=radio], label input[type=checkbox]')
var selectionButtons = new GOVUK.SelectionButtons($buttons, {
  focusedClass: 'selectable-focused',
  selectedClass: 'selectable-selected'
})
```

or, using delegated events:

```javascript
var buttonSelector = 'label input[type=radio], label input[type=checkbox]'
var selectionButtons = new GOVUK.SelectionButtons($buttonSelector, {
  focusedClass: 'selectable-focused',
  selectedClass: 'selectable-selected'
})
```

#### destroy method

The returned instance object includes a `destroy` method to remove all events bound to either the elements or the document.

Using any of the `selectionButtons` objects created above, it can be called like so:

```javascript
selectionButtons.destroy();
```

### Deprecated functionality

The previous method of calling selection buttons is now deprecated. If you need to call them using this method, you will need to define this function:

```javascript
GOVUK.selectionButtons = function (elms, opts) {
  new GOVUK.SelectionButtons(elms, opts)
}
```

This method will mean the `destroy` method is not available to call.

## Shim links with button role

Links styled to look like buttons lack button behaviour. This script will allow them to be triggered with a space key after they’ve been focused, to match standard buttons.

### Usage

By default, this behaviour will only be applied to links with a role of button.

```html
<a class="button" role="button">A button</a>
```

```javascript
GOVUK.shimLinksWithButtonRole.init()
```

If you need to override the elements this is applied to then you can do that by passing in a custom selector to the initialiser:

```javascript
GOVUK.shimLinksWithButtonRole.init({
  selector: '.my-class'
})
```

It’s also possible to define more or different keycodes to activate against:

```javascript
// activate when the user presses space or ‘r’
GOVUK.shimLinksWithButtonRole.init({
  keycodes: [32, 114]
});
```

## Show/Hide content

Script to support show/hide content, toggled by radio buttons and checkboxes. This allows for progressive disclosure of question and answer forms based on selected values:

    <div class="multiple-choice" data-target="show-me">
      <input type="radio" name="enabled" value="yes" />
      <label>Yes</label>
    </div>

    <div class="multiple-choice">
      <input type="radio" name="enabled" value="no" />
      <label>No</label>
    </div>

    <div id="show-me" class="panel js-hidden">
      <p>Show/Hide content to be toggled</p>
    </div>

When the input's `checked` attribute is set, the show/hide content's `.js-hidden` class is removed and ARIA attributes are added to enable it. Note the sample `show-me` id attribute used to link the label to show/hide content.

### Usage

#### GOVUK.ShowHideContent

To apply this behaviour to elements with the above HTML pattern, call the `GOVUK.ShowHideContent` constructor:

```
var showHideContent = new GOVUK.ShowHideContent()
showHideContent.init()
```

This will bind two event handlers to $(document.body), one for radio inputs and one for checkboxes. By listening for events bubbling up to the `body` tag, additional show/hide content added to the page will still be picked up after `.init()` is called.

Alternatively, pass in your own selector. In the example below, event handlers are bound to the form instead.

```
var showHideContent = new GOVUK.ShowHideContent()
showHideContent.init($('form.example'))
```
