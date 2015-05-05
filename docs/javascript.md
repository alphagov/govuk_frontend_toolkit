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
 - `name`: The name of the text (alphanumeric and underscores), which will be part of the cookie.
 - `defaultWeight`: Number of times each cohorts should appear in an array the random cohort is picked from, to be used in conjunction with weights on individual cohorts.
 - `cohorts`: An object that maps cohort name to an object that defines the cohort. Name must be same format as test name. Object contains keys (all optional):
   - `html`: HTML to fill element with when this cohort is picked.
   - `callback`: Function to call when this cohort is chosen. If it is a string, that method on the test object is called.
   - `weight`: Number of times this cohort should appear in an array the random cohort is picked from, defaults to the `defaultWeight` of the test.

Full documentation on how to design multivariate tests, use the data in GA and construct hypothesis tests is on its way soon.

### Reporting to Google Content Experiments
The toolkit includes a library for multivariate testing that is capable of reporting data into [Google Content Experiments](https://developers.google.com/analytics/devguides/platform/experiments-overview).

#### To create a new experiment

1. Log in to Google Universal Analytics, select "UA - 1. GOV.UK(Entire Site - Filtered)".

2. In the left column, click on Behaviour, then Experiments and follow [these instructions](https://support.google.com/analytics/answer/1745152?hl=en-GB) to set up your experiment; you will need to have edit permissions on the Universal Analytics profile. If you cannot see a "Create experiment" button, this means you don't have these permissions; you can ask someone from the Performance Analyst team to set the experiment up for you.

3. In step number 2, in our case the address of the web pages will purely be used as descriptions in reports, so we recommend you pick the addresses accordingly, ie: "www.gov.uk" and "www.gov.uk/?=variation1".

4. In step number 3, "Setting up your experiment code", select "Manually insert the code" and make a note of the Experiment ID number located under the script window.

5. Add the below code to the page you want to test.
    - the contentExperimentId is the Experiment ID you retrieved in step 3.
    - the variantId is 0 for the original variant, 1 for the first modified variant, 2 for the second modified variant, etc.
    - see section above for other elements.
This code requires analytics to be loaded in order to run; static is the app that would load the analytics by default, which automatically happens before experiments are run.

6. Check that it works: launch the app, open the page of your app, and check that there is a cookie with the name you had picked in your experiment. You can delete the cookie and refresh the page to check whether you can be assigned to another cohort. Then in your browser console, go to the Networks tab and search for xid and xvar. The values should correspond to your contentExperimentId and the cohort your cookie indicates you were assigned to.

7. If it works, in Google Universal Analytics, click on "Next Step" and then "Start Experiment". You can ignore the error messages relative to Experiment Code Validation as they don't concern us in our setup.
 
```js
var test = new GOVUK.MultivariateTest({
  name: 'car_tax_button_text',
  contentExperimentId: "Your_Experiment_ID",
  cohorts: {
    pay_your_car_tax: {weight: 25, variantId: 0},
    give_us_money: {weight: 25, variantId: 1}
  }
});

```

### Using Google custom dimensions with your own statistical model

It is possible to use Google custom dimensions for determining the results of
the multivariate test (as an alternative to Google Content Experiments). This
may be appropriate if you wish to build the statistical model yourself or you
aren't able to use Content Experiments for some reason.

This requires setting the optional `customDimensionIndex` variable:

```js
var test = new GOVUK.MultivariateTest({
  name: 'car_tax_button_text',
  customDimensionIndex: 555,
  cohorts: {
    pay_your_car_tax: {weight: 25},
    give_us_money: {weight: 50}
  }
});
```

`customDimensionIndex` is the index of the custom variable in Google Analytics. GA only gives 50 integer slots to each account, and it is important that a unique integer is assigned to each test. Current contact for assigning a custom var slot for GOV.UK is: Ashraf Chohan <ashraf.chohan@digital.cabinet-office.gov.uk>

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
