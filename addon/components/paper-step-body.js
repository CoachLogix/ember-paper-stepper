import Component from '@ember/component';
import layout from '../templates/components/paper-step-body';

export default Component.extend({
  layout,
  tagName: 'md-step-body',
  classNames: ['flex'],
  classNameBindings: ['vertical::md-padding']
});
