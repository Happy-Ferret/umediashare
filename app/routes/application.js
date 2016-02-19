import Ember from 'ember';

export default Ember.Route.extend({
  model : function() {
    return Ember.RSVP.hash({
      devices : this.store.findAll('device'),
      playlists : this.store.findAll('playlist')
    });
  },

  setupController : function(controller, model) {
    controller.set('devices', model.devices);
    controller.set('playlists', model.playlists);
  }
});
