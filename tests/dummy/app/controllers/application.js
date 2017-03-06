import Ember from 'ember';
const { Controller } = Ember;

export default Controller.extend({
  linear: true,
  vertical: true,

  actions: {
    toggle(propName) {
      this.toggleProperty(propName);
    },
    validityChange(isValid, isTouched, isInvalidAndTouched) {
      this.set('isInvalid', isInvalidAndTouched);
    }
  }
});