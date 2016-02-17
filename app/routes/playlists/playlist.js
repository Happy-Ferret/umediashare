import Ember from 'ember';

export default Ember.Route.extend({
  model : function(params) {
    return Ember.RSVP.hash({
        playlist : this.store.findRecord('playlist', params.id),
        /* localstore has no empty queries support, broken relations ((( */
        playlistItems : new Promise(resolve => {
          this.store.query('playlistItem', {playlist : params.id}).then(r => resolve(r)).catch(r => resolve());
        })
      });
  },

  setupController(controller, model) {
    controller.set('playlist', model.playlist);
    controller.set('playlistItems', model.playlistItems);

    model.playlist.set('itemsNum', model.playlistItems ? model.playlistItems.get('length') : 0);
    model.playlist.save();
  },

  actions: {
    resetRoute: function() {
      this.refresh();
    }
  }
});
