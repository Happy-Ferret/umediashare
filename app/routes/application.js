import Ember from 'ember';

export default Ember.Route.extend({
  model : function() {
    return this.store.findAll('device');
  },

  setupController : function(controller, model) {
    controller.set('devices', model);
  }
});
