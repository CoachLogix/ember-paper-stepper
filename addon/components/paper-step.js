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

  isActive: computed('orderedIndex', 'currentStep', function() {
    return this.get('orderedIndex') === this.get('currentStep');
  }),

  isCompleted: computed('orderedIndex', 'currentStep', 'linear', function() {
    let { orderedIndex, currentStep, linear } = this.getProperties('orderedIndex', 'currentStep', 'linear');
    return linear && orderedIndex < currentStep;
  }),

  hasError: computed.bool('error'),

  showOptional: computed.or('optional', 'hasError'),

  stepNumberLabel: computed('orderedIndex', function() {
    return this.get('orderedIndex') + 1;
  }),

  isButtonDisabled: computed.or('linear', 'isActive')
});
