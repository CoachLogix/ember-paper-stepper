import Ember from 'ember';
import layout from '../templates/components/paper-stepper';
import { ParentMixin } from 'ember-composability-tools';
const { Component, computed, String: { loc } } = Ember;

export default Component.extend(ParentMixin, {
  layout,
  tagName: 'md-stepper',

  stepComponent: 'paper-step',

  linear: true,

  currentStep: 0,
  currentStepLabel: computed('currentStep', function() {
    return this.get('currentStep') + 1;
  }),
  totalSteps: computed.reads('steps.length'),

  steps: computed.reads('childComponents'),

  mobileHeaderTemplate: 'Step %@ of %@',
  mobileHeaderLabel: computed('mobileHeaderTemplate', 'currentStepLabel', 'totalSteps', function() {
    let { mobileHeaderTemplate, currentStepLabel, totalSteps } = this.getProperties('mobileHeaderTemplate', 'currentStepLabel', 'totalSteps');
    return loc(mobileHeaderTemplate, [currentStepLabel, totalSteps]);
  }),

  goTo(stepNumber) {
    if (stepNumber < this.get('totalSteps')) {
      this.set('currentStep', stepNumber);
    }
  },

  nextStep() {
    if (this.get('currentStep') < this.get('totalSteps')) {
      this.incrementProperty('currentStep');
      if (this.get('currentStep') === this.get('totalSteps')) {
        this.sendAction('onStepperCompleted');
      }
    }
  },

  previousStep() {
    if (this.get('currentStep') > 0) {
      this.decrementProperty('currentStep');
    }
  },

  registerChild(childComponent) {
    this._super(...arguments);
    let stepNumber = this.childComponents.indexOf(childComponent);
    childComponent.set('stepNumber', stepNumber);
  }
});
