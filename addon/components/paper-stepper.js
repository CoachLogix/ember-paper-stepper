import Ember from 'ember';
import layout from '../templates/components/paper-stepper';
import { ParentMixin } from 'ember-composability-tools';
const { Component, computed, String: { loc } } = Ember;

export default Component.extend(ParentMixin, {
  layout,
  tagName: 'md-stepper',
  stepComponent: 'paper-step',
  optionalLabel: 'Optional',
  stepLabel: 'Step',
  ofLabel: 'of',

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

  registerChild(childComponent) {
    this._super(...arguments);
    let stepNumber = this.childComponents.indexOf(childComponent);
    childComponent.set('stepNumber', stepNumber);
  }
});
