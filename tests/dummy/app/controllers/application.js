import { reads } from '@ember/object/computed';
import Controller from '@ember/controller';

export default Controller.extend({
  linear: true,
  vertical: false,

  clampedStep: reads('currentStep'),

  actions: {
    toggle(propName) {
      this.toggleProperty(propName);
    },

    validityChange(isValid, isTouched, isInvalidAndTouched) {
      this.set('isInvalid', isInvalidAndTouched);
    }
  }
});