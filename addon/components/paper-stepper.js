import { reads, sort } from '@ember/object/computed';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { loc } from '@ember/string';
import layout from '../templates/components/paper-stepper';
import { ParentMixin } from 'ember-composability-tools';

function computedFallbackIfUndefined(fallback) {
  return computed({
    get() {
      return fallback;
    },
    set(_, v) {
      return v === undefined ? fallback : v;
    }
  });
}

export default Component.extend(ParentMixin, {
  layout,
  tagName: 'md-stepper',
  classNameBindings: ['vertical::layout-column'],

  stepComponent: 'paper-step',

  linear: computedFallbackIfUndefined(true),
  vertical: computedFallbackIfUndefined(false),

  // fallback to 0 if is undefined
  currentStep: computedFallbackIfUndefined(0),
  currentStepLabel: computed('currentStep', function() {
    return this.get('currentStep') + 1;
  }),
  totalSteps: reads('steps.length'),

  steps: sort('childComponents', function(a, b) {
    if (a.get('stepNumber') > b.get('stepNumber')) {
      return 1;
    } else if (a.get('stepNumber') < b.get('stepNumber')) {
      return -1;
    }
    return 0;
  }),

  mobileHeaderTemplate: 'Step %@ of %@',
  mobileHeaderLabel: computed('mobileHeaderTemplate', 'currentStepLabel', 'totalSteps', function() {
    let { mobileHeaderTemplate, currentStepLabel, totalSteps } = this.getProperties('mobileHeaderTemplate', 'currentStepLabel', 'totalSteps');
    return loc(mobileHeaderTemplate, [currentStepLabel, totalSteps]);
  }),

  goTo(stepNumber) {
    if (stepNumber < this.get('totalSteps') && this.get('onStepChange')) {
      this.get('onStepChange')(stepNumber);
    }
  },

  nextStep() {
    if (this.get('currentStep') < this.get('totalSteps')) {
      let nextStep = this.get('currentStep') + 1;
      if (this.get('onStepChange')) {
        this.get('onStepChange')(nextStep);
      }
      if (nextStep === this.get('totalSteps') && this.get('onStepperCompleted')) {
        this.get('onStepperCompleted')();
      }
    }
  },

  previousStep() {
    if (this.get('currentStep') > 0 && this.get('onStepChange')) {
      this.get('onStepChange')(this.get('currentStep') - 1);
    }
  },

  registerChild(childComponent) {
    this._super(...arguments);
    // automatically set stepNumber if not manually set
    if (childComponent.get('stepNumber') === undefined) {
      let stepNumber = this.childComponents.get('length');
      childComponent.set('stepNumber', stepNumber - 1);
    }

    this.updateLabels();
  },

  unregisterChild() {
    this._super(...arguments);
    this.updateLabels();
  },

  updateLabels() {
    // update labels based on the sorted index
    this.get('steps').forEach((c, i) => {
      if (c.get('orderedIndex') !== i) {
        c.set('orderedIndex', i);
      }
    });
  }
});
