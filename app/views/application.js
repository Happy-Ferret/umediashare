import Ember from 'ember';
import ctxMenu from '../utils/utility-contextmenu';

export default Ember.Component.extend({
  tagName : '',

  /* some electron initializers avoiding vendour globals */
  didInsertElement : function() {
    ctxMenu();
  }

});
