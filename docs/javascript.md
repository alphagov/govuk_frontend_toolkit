## JavaScript

The gem also includes some JavaScript which by itself will have no effect on a
page. It can be included with the asset_pipeline by adding the line:

    //=require govuk_toolkit

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

## Multivariate test framework

`GOVUK.MultiVariateTest` runs split tests to display different content, layouts etc to users.

It randomly assigns a user a cohort on first execution by setting a cookie, and on every execution sets a session level custom variable on Google Analytics to mark which cohort a user is in. This can be used to segment users in GA.

A simple content replacement test can be done by defining a set of cohorts with content. E.g.:

```javascript
var test = new GOVUK.MultivariateTest({
  el: '.car-tax-button',
  name: 'car_tax_button_text',
  customVarIndex: 555,
  cohorts: {
    pay_your_car_tax: {html: "Pay Your Car Tax"},
    give_us_money: {html: "Give Us Money Or We Will Crush Your Car"}
  }
});
```

A more complex test can be done by defining callbacks for what to do
when a user is in each cohort:

```javascript
var test = new GOVUK.MultivariateTest({
  name: 'car_tax_button_text',
  customVarIndex: 555,
  cohorts: {
    pay_your_car_tax: {callback: function() { ... }},
    give_us_money: {callback: function() { ... }}
  }
});
```

If you want one cohort to appear 25% of the time then you can optionally weight
that cohort:

```javascript
var test = new GOVUK.MultivariateTest({
  name: 'car_tax_button_text',
  customVarIndex: 555,
  cohorts: {
    pay_your_car_tax: {weight: 25, callback: function() { ... }}, // 25%
    give_us_money:    {weight: 75, callback: function() { ... }}  // 75%
  }
});
```

If you have a complex test, it may be worth extending MultivariateTest with
your own. Callbacks can be strings which will call a method of that name
on the current object.

Takes these options:
 - `el`: Element to run this test on (optional)
 - `name`: The name of the text (alphanumeric and underscores)
 - `customVarIndex`: The index of the custom variable in Google Analytics. GA only gives 50 integer slots to each account, and it is important that a unique integer is assigned to each test. Current contact for assigning a custom var slot for GOV.UK is: Ashraf Chohan <ashraf.chohan@digital.cabinet-office.gov.uk>
 - `defaultWeight`: Number of times each cohorts should appear in an array the random cohort is picked from, to be used in conjunction with weights on individual cohorts.
 - `cohorts`: An object that maps cohort name to an object that defines the cohort. Name must be same format as test name. Object contains keys (all optional):
   - `html`: HTML to fill element with when this cohort is picked.
   - `callback`: Function to call when this cohort is chosen. If it is a string, that method on the test object is called.
   - `weight`: Number of times this cohort should appear in an array the random cohort is picked from, defaults to the `defaultWeight` of the test.

Full documentation on how to design multivariate tests, use the data in GA and construct hypothesis tests is on its way soon.

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
GOVUK.primaryLinks.init('.primary-item');
```

Or to add it just to that list you could use:

```javascript
new GOVUK.PrimaryList($('#primary-list'), '.primary-item');
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
GOVUK.stickAtTopWhenScrolling.init();
```

If you also include the `stopScrollingAtFooter` JavaScript this will also try
and stop the elements before they get to the bottom.

## Selection buttons

Script to support a design of radio buttons and checkboxes requiring them to be wrapped in `<label>` tags:

    <label>
      <input type="radio" name="size" value="medium" />
    </label>

When the input is focused or its `checked` attribute is set, classes are added to their parent labels so their styling can show this.

### Usage

#### GOVUK.SelectionButtons

To apply this behaviour to elements with the above HTML pattern, call the `GOVUK.SelectionButtons` constructor with their inputs:

```
var $buttons = $("label input[type='radio'], label input[type='checkbox']");
var selectionButtons = new GOVUK.SelectionButtons($buttons);
```

You can also call `GOVUK.SelectionButtons` with a selector:

```
var selectionButtons = new GOVUK.SelectionButtons("label input[type='radio'], label input[type='checkbox']");
```

This will bind all events to the document, meaning any changes to content (for example, by AJAX) will not effect the button's behaviour.

The classes that get added to the `<label>` tags can be passed in as options:

```
var $buttons = $("label input[type='radio'], label input[type='checkbox']");
var selectionButtons = new GOVUK.SelectionButtons($buttons, { focusedClass : 'selectable-focused', selectedClass : 'selectable-selected' });

var selectionButtons = new GOVUK.SelectionButtons("label input[type='radio'], label input[type='checkbox']", { focusedClass : 'selectable-focused', selectedClass : 'selectable-selected' });
```

#### destroy method

The returned instance object includes a `destroy` method to remove all events bound to either the elements or the document.

Using any of the `selectionButtons` objects created above, it can be called like so:

```
selectionButtons.destroy();
```

### Deprecated functionality

The previous method of calling selection buttons is now deprecated. If you need to call them using this method, you will need to define this function:

```
GOVUK.selectionButtons = function (elms, opts) {
  new GOVUK.SelectionButtons(elms, opts);
};
```

This method will mean the `destroy` method is not available to call.
