import Ember from 'ember';
const { Controller } = Ember;

export default Controller.extend({

  linear: true,

  actions: {
    toggle(propName) {
      this.toggleProperty(propName);
    },

    completed() {
      alert('Congratulations! You completed the stepper.');
    }
  }
});