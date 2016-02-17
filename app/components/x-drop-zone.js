import Ember from 'ember';

var { set } = Ember;

export default Ember.Component.extend({
  classNames        : [ 'upload-drop-zone' ],
  classNameBindings : [ 'dragClass' ],
  dragClass         : 'deactivated',
  tagName : 'div',

  dragLeave(event) {
    event.preventDefault();
    set(this, 'dragClass', 'deactivated');
  },

  dragOver(event) {
    event.preventDefault();
    set(this, 'dragClass', 'activated');
  },

  drop(event) {
    this.sendAction('dropped', event);
    set(this, 'dragClass', 'deactivated');
  }
});
