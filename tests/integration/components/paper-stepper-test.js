import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('paper-stepper', 'Integration | Component | paper stepper', {
  integration: true
});

test('is linear by default', function(assert) {
  assert.expect(1);

  this.render(hbs`
    {{paper-stepper}}
  `);

  assert.ok(this.$('.md-steppers').hasClass('md-steppers-linear'), 'linear class is present');
});

test('does not add linear class if `linear` is false', function(assert) {
  assert.expect(1);

  this.render(hbs`
    {{paper-stepper linear=false}}
  `);

  assert.notOk(this.$('.md-steppers').hasClass('md-steppers-linear'), 'linear class is not present');
});

test('adds alternative class if `alternative` is true', function(assert) {
  assert.expect(1);

  this.render(hbs`
    {{paper-stepper alternative=true}}
  `);

  assert.ok(this.$('.md-steppers').hasClass('md-steppers-alternative'), 'alternative class is present');
});

['vertical', 'horizontal'].forEach((mode) => {
  let vertical = mode === 'vertical';

  test(`${mode} stepper: renders step buttons with correct labels`, function(assert) {
    assert.expect(4);
    this.vertical = vertical;

    this.render(hbs`
      {{#paper-stepper vertical=vertical as |stepper|}}
        {{stepper.step label="Step 1"}}
        {{stepper.step label="Step 2"}}
        {{stepper.step label="Step 3"}}
      {{/paper-stepper}}
    `);

    let buttons = this.$(`.md-steppers-${mode} button.md-stepper-indicator .md-stepper-title`);

    assert.equal(buttons.length, 3, 'renders 3 buttons');
    buttons.toArray().forEach((button, i) => {
      assert.equal(button.textContent.trim(), `Step ${i + 1}`, `renders the "Step ${i + 1} label`);
    });
  });

  test(`${mode} stepper: has active class on the active step`, function(assert) {
    assert.expect(2);
    this.vertical = vertical;
    this.currentStep = 0;

    this.render(hbs`
      {{#paper-stepper vertical=vertical currentStep=currentStep as |stepper|}}
        {{stepper.step label="Step 1"}}
        {{stepper.step label="Step 2"}}
        {{stepper.step label="Step 3"}}
      {{/paper-stepper}}
    `);

    let buttons = this.$(`.md-steppers-${mode} button.md-stepper-indicator`);

    assert.ok(buttons.eq(0).hasClass('md-active'), 'first step has md-active class');

    this.set('currentStep', 2);

    assert.ok(buttons.eq(2).hasClass('md-active'), 'third step has md-active class');
  });

  test(`${mode} stepper: has completed class on the complete steps`, function(assert) {
    assert.expect(2);
    this.vertical = vertical;
    this.currentStep = 0;

    this.render(hbs`
      {{#paper-stepper vertical=vertical currentStep=currentStep as |stepper|}}
        {{stepper.step label="Step 1"}}
        {{stepper.step label="Step 2"}}
        {{stepper.step label="Step 3"}}
      {{/paper-stepper}}
    `);

    assert.equal(this.$(`.md-steppers-${mode} .md-stepper-indicator.md-completed`).length, 0, 'no complete steps');

    this.set('currentStep', 2);

    assert.equal(this.$(`.md-steppers-${mode} .md-stepper-indicator.md-completed`).length, 2, 'two complete steps');
  });

  test(`${mode} stepper: has error class and message if step has \`error\``, function(assert) {
    assert.expect(3);
    this.vertical = vertical;

    this.render(hbs`
      {{#paper-stepper vertical=vertical as |stepper|}}
        {{stepper.step label="Step 1"}}
        {{stepper.step label="Step 2" error="some error message"}}
        {{stepper.step label="Step 3"}}
      {{/paper-stepper}}
    `);

    assert.ok(this.$(`.md-steppers-${mode} .md-stepper-indicator`).eq(1).hasClass('md-error'), 'second step has error class');
    assert.equal(this.$(`.md-steppers-${mode} .md-stepper-error-indicator md-icon`).length, 1, 'one error indicator was rendered');
    assert.equal(this.$(`.md-steppers-${mode} .md-stepper-error-message`).text().trim(), 'some error message', 'error message was rendered');
  });

  test(`${mode} stepper: if \`optional\` is true add optional class and label`, function(assert) {
    assert.expect(3);
    this.vertical = vertical;

    this.render(hbs`
      {{#paper-stepper vertical=vertical as |stepper|}}
        {{stepper.step label="Step 1"}}
        {{stepper.step label="Step 2" optional=true optionalLabel="this is optional"}}
        {{stepper.step label="Step 3"}}
      {{/paper-stepper}}
    `);

    assert.ok(this.$(`.md-steppers-${mode} .md-stepper-indicator`).eq(1).hasClass('md-stepper-optional'), 'second step has optional class');
    assert.equal(this.$(`.md-steppers-${mode} .md-stepper-title small`).length, 1, 'one optional message was rendered');
    assert.equal(this.$(`.md-steppers-${mode} .md-stepper-title small`).text().trim(), 'this is optional', 'with the correct text');
  });

  test(`${mode} stepper: clicking step button makes it the current step if linear is false`, function(assert) {
    assert.expect(8);
    this.vertical = vertical;
    this.linear = true;

    this.render(hbs`
      {{#paper-stepper vertical=vertical linear=linear currentStep=currentStep onStepChange=(action (mut currentStep)) as |stepper|}}
        {{stepper.step label="Step 1"}}
        {{stepper.step label="Step 2"}}
        {{stepper.step label="Step 3"}}
      {{/paper-stepper}}
    `);

    let buttons = this.$(`.md-steppers-${mode} .md-stepper-indicator`);

    this.$(`.md-steppers-${mode} .md-stepper-indicator`).eq(2).click();

    assert.ok(buttons.eq(0).hasClass('md-active'), 'first step has md-active class');

    buttons.toArray().forEach((button, i) => {
      assert.ok(button.disabled, `button ${i} is disabled`);
    });

    this.set('linear', false);

    this.$(`.md-steppers-${mode} .md-stepper-indicator`).eq(2).click();

    assert.ok(buttons.eq(2).hasClass('md-active'), 'third step has md-active class');

    buttons.toArray().forEach((button, i) => {
      if (i === 2) {
        assert.ok(button.disabled, `active step button ${i} is disabled`);
      } else {
        assert.notOk(button.disabled, `button ${i} is not disabled`);
      }
    });
  });

});

test('nextStep and previousStep actions changes the current step', function(assert) {
  assert.expect(3);

  this.render(hbs`
    {{#paper-stepper vertical=vertical currentStep=currentStep onStepChange=(action (mut currentStep)) as |stepper|}}
      {{#stepper.step label="Step 1" as |step|}}
        {{#step.actions as |nextStep|}}
          {{#paper-button class="next-button" onClick=(action nextStep)}}
            Continue
          {{/paper-button}}
        {{/step.actions}}
      {{/stepper.step}}
      {{#stepper.step label="Step 2" as |step|}}
        {{#step.actions as |nextStep previousStep|}}
          {{#paper-button class="previous-button" onClick=(action previousStep)}}
            Back
          {{/paper-button}}
        {{/step.actions}}
      {{/stepper.step}}
      {{stepper.step label="Step 3"}}
    {{/paper-stepper}}
  `);

  let buttons = this.$('.md-steppers-horizontal button.md-stepper-indicator');

  assert.ok(buttons.eq(0).hasClass('md-active'), 'first step has md-active class');

  this.$('.next-button').click();

  assert.ok(buttons.eq(1).hasClass('md-active'), 'second step has md-active class');

  this.$('.previous-button').click();

  assert.ok(buttons.eq(0).hasClass('md-active'), 'first step has md-active class again');
});
