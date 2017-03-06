import Ember from 'ember';
const { Controller, computed } = Ember;

export default Controller.extend({
  linear: true,
  vertical: true,

  clampedStep: computed.reads('currentStep'),

  actions: {
    toggle(propName) {
      this.toggleProperty(propName);
    },

    validityChange(isValid, isTouched, isInvalidAndTouched) {
      this.set('isInvalid', isInvalidAndTouched);
    }
  }
});