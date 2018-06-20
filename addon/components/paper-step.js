import { bool, or } from '@ember/object/computed';
import Component from '@ember/component';
import { computed } from '@ember/object';
import layout from '../templates/components/paper-step';
import { ChildMixin } from 'ember-composability-tools';

export default Component.extend(ChildMixin, {
  layout,
  tagName: 'md-step',
  classNameBindings: ['vertical::layout-column', 'isActiveAndHorizontal:flex'],
  bodyComponent: 'paper-step-body',
  actionsComponent: 'paper-step-actions',

  optionalLabel: 'Optional',

  isActive: computed('orderedIndex', 'currentStep', function() {
    return this.get('orderedIndex') === this.get('currentStep');
  }),

  isActiveAndHorizontal: computed('isActive', 'vertical', function() {
    return this.get('isActive') && !this.get('vertical');
  }),

  isCompleted: computed('orderedIndex', 'currentStep', 'linear', function() {
    let { orderedIndex, currentStep, linear } = this.getProperties('orderedIndex', 'currentStep', 'linear');
    return linear && orderedIndex < currentStep;
  }),

  hasError: bool('error'),

  showOptional: or('optional', 'hasError'),

  stepNumberLabel: computed('orderedIndex', function() {
    return this.get('orderedIndex') + 1;
  }),

  isButtonDisabled: or('linear', 'isActive')
});
