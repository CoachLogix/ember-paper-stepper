import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, findAll } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | paper stepper', function(hooks) {
  setupRenderingTest(hooks);

  test('is linear by default', async function(assert) {
    assert.expect(1);

    await render(hbs`
      {{paper-stepper}}
    `);

    assert.dom('.md-steppers').hasClass('md-steppers-linear', 'linear class is present');
  });

  test('does not add linear class if `linear` is false', async function(assert) {
    assert.expect(1);

    await render(hbs`
      {{paper-stepper linear=false}}
    `);

    assert.dom('.md-steppers').doesNotHaveClass('md-steppers-linear', 'linear class is not present');
  });

  test('adds alternative class if `alternative` is true', async function(assert) {
    assert.expect(1);

    await render(hbs`
      {{paper-stepper alternative=true}}
    `);

    assert.dom('.md-steppers').hasClass('md-steppers-alternative', 'alternative class is present');
  });

  test('adds mobile class if `mobileStepper` is true', async function(assert) {
    assert.expect(1);

    await render(hbs`
      {{paper-stepper mobileStepper=true}}
    `);

    assert.dom('.md-steppers').hasClass('md-steppers-mobile-step-text', 'mobile class is present');
  });

  ['vertical', 'horizontal'].forEach((mode) => {
    let vertical = mode === 'vertical';

    test(`${mode} stepper: renders step buttons with correct labels`, async function(assert) {
      assert.expect(7);
      this.vertical = vertical;

      await render(hbs`
        {{#paper-stepper vertical=vertical as |stepper|}}
          {{stepper.step label="Step 1"}}
          {{stepper.step label="Step 2"}}
          {{stepper.step label="Step 3"}}
        {{/paper-stepper}}
      `);

      assert.dom(`.md-steppers-${mode} button.md-stepper-indicator`).exists({ count: 3 }, 'renders 3 buttons');

      let buttons = findAll(`.md-steppers-${mode} button.md-stepper-indicator`);
      buttons.forEach((button, i) => {
        assert.equal(button.querySelector('.md-stepper-number').textContent.trim(), i + 1, `renders number ${i + 1}`);
        assert.equal(button.querySelector('.md-stepper-title').textContent.trim(), `Step ${i + 1}`, `renders the "Step ${i + 1} label`);
      });
    });

    test(`${mode} stepper: you can render steps using an each`, async function(assert) {
      assert.expect(7);
      this.vertical = vertical;
      this.steps = ['Step 1', 'Step 2', 'Step 3'];

      await render(hbs`
        {{#paper-stepper vertical=vertical as |stepper|}}
          {{#each steps as |label|}}
            {{stepper.step label=label}}
          {{/each}}
        {{/paper-stepper}}
      `);

      assert.dom(`.md-steppers-${mode} button.md-stepper-indicator`).exists({ count: 3 }, 'renders 3 buttons');

      let buttons = findAll(`.md-steppers-${mode} button.md-stepper-indicator`);

      buttons.forEach((button, i) => {
        assert.equal(button.querySelector('.md-stepper-number').textContent.trim(), i + 1, `renders number ${i + 1}`);
        assert.equal(button.querySelector('.md-stepper-title').textContent.trim(), `Step ${i + 1}`, `renders the "Step ${i + 1} label`);
      });
    });

    test(`${mode} stepper: later rendered steps order`, async function(assert) {
      assert.expect(7);
      this.vertical = vertical;

      await render(hbs`
        {{#paper-stepper vertical=vertical as |stepper|}}
          {{stepper.step label="Step 1" stepNumber=1}}
          {{#if step2enabled}}
            {{stepper.step label="Step 2" stepNumber=2}}
          {{/if}}
          {{stepper.step label="Step 3" stepNumber=3}}
        {{/paper-stepper}}
      `);

      assert.dom(`.md-steppers-${mode} button.md-stepper-indicator .md-stepper-number`).exists({ count: 2 }, 'renders 2 buttons');
      let buttons = findAll(`.md-steppers-${mode} button.md-stepper-indicator .md-stepper-number`);

      buttons.forEach((button, i) => {
        assert.equal(button.textContent.trim(), i + 1, `renders number ${i + 1}`);
      });

      this.set('step2enabled', true);

      assert.dom(`.md-steppers-${mode} button.md-stepper-indicator .md-stepper-number`).exists({ count: 3 }, 'renders 3 buttons');

      buttons = findAll(`.md-steppers-${mode} button.md-stepper-indicator .md-stepper-number`);

      buttons.forEach((button, i) => {
        assert.dom(button).hasText(`${i + 1}`, `renders number ${i + 1}`);
      });
    });

    test(`${mode} stepper: later destroyed steps order`, async function(assert) {
      assert.expect(7);
      this.vertical = vertical;
      this.step2enabled = true;

      await render(hbs`
        {{#paper-stepper vertical=vertical as |stepper|}}
          {{stepper.step label="Step 1" stepNumber=1}}
          {{#if step2enabled}}
            {{stepper.step label="Step 2" stepNumber=2}}
          {{/if}}
          {{stepper.step label="Step 3" stepNumber=3}}
        {{/paper-stepper}}
      `);

      assert.dom(`.md-steppers-${mode} button.md-stepper-indicator .md-stepper-number`).exists({ count: 3 }, 'renders 3 buttons');

      let buttons = findAll(`.md-steppers-${mode} button.md-stepper-indicator .md-stepper-number`);
      buttons.forEach((button, i) => {
        assert.dom(button).hasText(`${i + 1}`, `renders number ${i + 1}`);
      });

      this.set('step2enabled', false);

      assert.dom(`.md-steppers-${mode} button.md-stepper-indicator .md-stepper-number`).exists({ count: 2 }, 'renders 2 buttons');
      buttons = findAll(`.md-steppers-${mode} button.md-stepper-indicator .md-stepper-number`);

      buttons.forEach((button, i) => {
        assert.dom(button).hasText(`${i + 1}`, `renders number ${i + 1}`);
      });
    });

    test(`${mode} stepper: has active class on the active step`, async function(assert) {
      assert.expect(2);
      this.vertical = vertical;
      this.currentStep = 0;

      await this.render(hbs`
        {{#paper-stepper vertical=vertical currentStep=currentStep as |stepper|}}
          {{stepper.step label="Step 1"}}
          {{stepper.step label="Step 2"}}
          {{stepper.step label="Step 3"}}
        {{/paper-stepper}}
      `);

      let buttons = findAll(`.md-steppers-${mode} button.md-stepper-indicator`);

      assert.dom(buttons[0]).hasClass('md-active', 'first step has md-active class');

      this.set('currentStep', 2);

      assert.dom(buttons[2]).hasClass('md-active', 'third step has md-active class');
    });

    test(`${mode} stepper: has completed class on the complete steps`, async function(assert) {
      assert.expect(2);
      this.vertical = vertical;
      this.currentStep = 0;

      await this.render(hbs`
        {{#paper-stepper vertical=vertical currentStep=currentStep as |stepper|}}
          {{stepper.step label="Step 1"}}
          {{stepper.step label="Step 2"}}
          {{stepper.step label="Step 3"}}
        {{/paper-stepper}}
      `);

      assert.dom(`.md-steppers-${mode} .md-stepper-indicator.md-completed`).doesNotExist('no complete steps');

      this.set('currentStep', 2);

      assert.dom(`.md-steppers-${mode} .md-stepper-indicator.md-completed`).exists({ count: 2 }, 'two complete steps');
    });

    test(`${mode} stepper: has error class and message if step has \`error\``, async function(assert) {
      assert.expect(3);
      this.vertical = vertical;

      await this.render(hbs`
        {{#paper-stepper vertical=vertical as |stepper|}}
          {{stepper.step label="Step 1"}}
          {{stepper.step label="Step 2" error="some error message"}}
          {{stepper.step label="Step 3"}}
        {{/paper-stepper}}
      `);

      let el = findAll(`.md-steppers-${mode} .md-stepper-indicator`);

      assert.dom(el[1]).hasClass('md-error', 'second step has error class');
      assert.dom(`.md-steppers-${mode} .md-stepper-error-indicator md-icon`).exists({ count: 1 }, 'one error indicator was rendered');
      assert.dom(`.md-steppers-${mode} .md-stepper-error-message`).hasText('some error message', 'error message was rendered');
    });

    test(`${mode} stepper: if \`optional\` is true add optional label`, async function(assert) {
      assert.expect(2);
      this.vertical = vertical;

      await render(hbs`
        {{#paper-stepper vertical=vertical as |stepper|}}
          {{stepper.step label="Step 1"}}
          {{stepper.step label="Step 2" optional=true optionalLabel="this is optional"}}
          {{stepper.step label="Step 3"}}
        {{/paper-stepper}}
      `);

      assert.dom(`.md-steppers-${mode} .md-stepper-title small`).exists({ count: 1 }, 'one optional message was rendered');
      assert.dom(`.md-steppers-${mode} .md-stepper-title small`).hasText('this is optional', 'with the correct text');
    });

    test(`${mode} stepper: if \`summary\` is true adds summary label`, async function(assert) {
      assert.expect(2);
      this.vertical = vertical;

      await render(hbs`
        {{#paper-stepper vertical=vertical as |stepper|}}
          {{stepper.step label="Step 1" summary="This is a summary" optional=true}}
          {{stepper.step label="Step 2"}}
          {{stepper.step label="Step 3"}}
        {{/paper-stepper}}
      `);

      assert.dom(`.md-steppers-${mode} .md-stepper-title small`).exists({ count: 1 }, 'one summary was rendered');
      assert.dom(`.md-steppers-${mode} .md-stepper-title small`).hasText('This is a summary', 'with the correct text (takes precedence over `optional`)');
    });

    test(`${mode} stepper: clicking step button makes it the current step if linear is false`, async function(assert) {
      assert.expect(8);
      this.vertical = vertical;
      this.linear = true;

      await render(hbs`
        {{#paper-stepper vertical=vertical linear=linear currentStep=currentStep onStepChange=(action (mut currentStep)) as |stepper|}}
          {{stepper.step label="Step 1"}}
          {{stepper.step label="Step 2"}}
          {{stepper.step label="Step 3"}}
        {{/paper-stepper}}
      `);

      let buttons = findAll(`.md-steppers-${mode} .md-stepper-indicator`);

      await click(buttons[2]);

      assert.dom(buttons[0]).hasClass('md-active', 'first step has md-active class');

      buttons.forEach((button, i) => {
        assert.dom(button).hasAttribute('disabled', '', `button ${i} is disabled`)
      });

      this.set('linear', false);

      buttons = findAll(`.md-steppers-${mode} .md-stepper-indicator`);
      await click(buttons[2]);

      assert.dom(buttons[2]).hasClass('md-active', 'third step has md-active class');

      buttons.forEach((button, i) => {
        if (i === 2) {
          assert.dom(button).hasAttribute('disabled', '', `active step button ${i} is disabled`)
        } else {
          assert.dom(button).doesNotHaveAttribute('disabled', `active step button ${i} is disabled`);
        }
      });
    });

  });

  test('nextStep and previousStep actions changes the current step', async function(assert) {
    assert.expect(3);

    await render(hbs`
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

    let buttons = findAll('.md-steppers-horizontal button.md-stepper-indicator');

    assert.dom(buttons[0]).hasClass('md-active', 'first step has md-active class');

    await click('.next-button');

    assert.dom(buttons[1]).hasClass('md-active', 'second step has md-active class');

    await click('.previous-button');

    assert.dom(buttons[0]).hasClass('md-active', 'first step has md-active class again');

  });

  test('completing the last step triggers an `onStepperCompleted` action', async function(assert) {
    assert.expect(2);

    this.currentStep = 2;
    this.onStepperCompleted = () => {
      assert.ok(true, 'onStepperCompleted was called');
    };

    await render(hbs`
      {{#paper-stepper vertical=vertical currentStep=currentStep onStepperCompleted=(action onStepperCompleted) as |stepper|}}
        {{stepper.step label="Step 1"}}
        {{stepper.step label="Step 2"}}
        {{#stepper.step label="Step 3" as |step|}}
          {{#step.actions as |nextStep|}}
            {{#paper-button class="next-button" onClick=(action nextStep)}}
              Complete
            {{/paper-button}}
          {{/step.actions}}
        {{/stepper.step}}
      {{/paper-stepper}}
    `);

    let buttons = findAll('.md-steppers-horizontal button.md-stepper-indicator');

    assert.dom(buttons[2]).hasClass('md-active', 'last step has md-active class');

    await click('.next-button');
  });

  test('completing the last step triggers an `onStepperCompleted` action (last step was rendered afterwards)', async function(assert) {
    assert.expect(3);

    this.currentStep = 1;
    this.onStepperCompleted = () => {
      assert.ok(true, 'onStepperCompleted was called');
    };

    await render(hbs`
      {{#paper-stepper vertical=vertical currentStep=currentStep onStepperCompleted=(action onStepperCompleted) as |stepper|}}
        {{stepper.step label="Step 1"}}
        {{stepper.step label="Step 2"}}
        {{#if show}}
          {{#stepper.step label="Step 3" as |step|}}
            {{#step.actions as |nextStep|}}
              {{#paper-button class="next-button" onClick=(action nextStep)}}
                Complete
              {{/paper-button}}
            {{/step.actions}}
          {{/stepper.step}}
        {{/if}}
      {{/paper-stepper}}
    `);

    let buttons = findAll('.md-steppers-horizontal button.md-stepper-indicator');

    assert.dom(buttons[1]).hasClass('md-active', 'second step has md-active class');

    this.set('show', true);
    this.set('currentStep', 2);

    buttons = findAll('.md-steppers-horizontal button.md-stepper-indicator');

    assert.dom(buttons[2]).hasClass('md-active', 'third step has md-active class');

    await click('.next-button');
  });
});
