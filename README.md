# ember-paper-stepper [![Build Status](https://travis-ci.org/CoachLogix/ember-paper-stepper.svg?branch=master)](https://travis-ci.org/CoachLogix/ember-paper-stepper) [![Ember Observer Score](http://emberobserver.com/badges/ember-paper-stepper.svg)](http://emberobserver.com/addons/ember-paper-stepper)

This is an [ember-paper](https://github.com/miguelcobain/ember-paper) addon that provides an implementation of [material steppers](https://material.io/guidelines/components/steppers.html).

## Usage

An example usage:

```hbs
{{#paper-stepper currentStep=currentStep onStepChange=(action (mut currentStep))
  onStepperCompleted=(action "saveModel") as |stepper|}}

  {{#stepper.step label="Select how it looks" as |step|}}
    {{#step.body}}
      {{!-- Content here. Probably some form. --}}
    {{/step.body}}
    {{#step.actions as |nextStep previousStep|}}
      {{#paper-button primary=true raised=true onClick=(action nextStep)}}
        Continue
      {{/paper-button}}
      {{#paper-button onClick=(action previousStep)}}
        Back
      {{/paper-button}}
    {{/step.actions}}
  {{/stepper.step}}

  {{!-- add as many steps as necessary --}}

{{/paper-stepper}}
```

## Demo

You can see how this addon looks like at https://coachlogix.github.io/ember-paper-stepper/

## Installation

```bash
ember install ember-paper-stepper
```

Don't forget to import your styles in your `app.scss` **after** importing ember paper styles:

```scss
@import "ember-paper";
@import "ember-paper-stepper";
```

## API

### `{{#paper-stepper as |stepper|}}`

- `currentStep` - defaults to `0` - this is the 0-indexed number of the current active step. Use this together with `onStepChange` to update steps.
- `vertical` - defaults to `false` - this toggles the stepper between vertical and horizontal modes.
- `linear` - defaults to `true` - if `true`, the user must pass through all the steps in a "linear" fashion. If `false`, the user is able to click on the steps at will, not following any particular order.
- `alternative` - if `true`, the stepper will show an alternative form of the horizontal stepper detailed in the spec. Only works when `vertical` is falsy.
- `mobileStepper` - if `true`, an *horizontal* stepper will turn into a mobile stepper if viewport width is below `599px`.
- `onStepChange` - an action that is sent when a nextStep, previousStep or header button is pressed. Use this together with `currentStep` to update steps.
- `onStepperCompleted` - an action that is sent when a nextStep button is pressed on the last step.

This component yields a hash that contains a `step` component which you can use to define multiple steps.

### `{{#stepper.step as |step|}}`

- `label` - the label to display on the header buttons.
- `optional` - if `true`, an optional styling and label are rendered on the respective step header button.
- `optionalLabel` - defaults to `'Optional'` - this is the text that is rendered when `optional` is `true`.
- `error` - Set this property to a string containing an error message. Use this property to
  1. user an error style on the respective header buttons to an error style
  2. display an error message on the respective header button
- `summary` - you can specify a summary for each step. This text will be displayed next to the step number.
It is useful to remember the user what has been selected in previous steps. *This will take precedence over the `optional` option.*
- `stepNumber` - this property is automatically assigned by the parent stepper *based on the rendering order*. For most
use cases you won't need this property and the default behavior is enough. However, in some cases you may want to insert
some steps dynamically in the middle of the steps. This makes sure that the steps are ordered when rendered. You don't
need to specify sequencial numbers. You can use, for example, steps with stepNumbers `1`, `8` and `10`.
They will be rendered in the correct order.

This component yields a hash that contains a `body` and an `actions` component which you can use to define multiple the content of the step.

The hash also contains `nexStep` and `previousStep` actions to be used separately.

### `{{#step.body}}`

Use this component to render your content with the correct styles/markup.

### `{{#step.actions as |nextStep previousStep|}}`

This component yields two actions: `nextStep` and `previousStep`.
You can use those actions in any way you prefer.
They work perfectly using ember-paper's paper-button like: `{{#paper-button onClick=(action nextStep)`

## Credits

This addon was inspired by [material-steppers](https://github.com/eberlitz/material-steppers) project.

## Running

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

## Running Tests

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).
