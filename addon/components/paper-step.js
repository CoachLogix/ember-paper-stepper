import Ember from 'ember';
import layout from '../templates/components/paper-step';
import { ChildMixin } from 'ember-composability-tools';

const { Component, computed } = Ember;

export default Component.extend(ChildMixin, {
  layout,
  tagName: 'md-step',
  bodyComponent: 'paper-step-body',
  actionsComponent: 'paper-step-actions',

  optionalLabel: 'Optional',

  isActive: computed('stepNumber', 'currentStep', function() {
    return this.get('stepNumber') === this.get('currentStep');
  }),

  isCompleted: computed('stepNumber', 'currentStep', 'linear', function() {
    let { stepNumber, currentStep, linear } = this.getProperties('stepNumber', 'currentStep', 'linear');
    return linear && stepNumber < currentStep;
  }),

  hasError: computed.bool('error'),

  showOptional: computed.or('optional', 'hasError'),

  stepNumberLabel: computed('stepNumber', function() {
    return this.get('stepNumber') + 1;
  }),

  isButtonDisabled: computed.or('linear', 'isActive')
});
