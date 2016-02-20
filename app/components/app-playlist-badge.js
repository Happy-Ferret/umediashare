import Ember from 'ember';
import DS from 'ember-data';


export default Ember.Component.extend({
  classNames : ['playlist-badge', 'pointer'],
  attributeBindings : ['draggable'],
  draggable : false,

  itemTypes : function() {
    let types = new Set();

    return DS.PromiseObject.create({
       promise : this.get('model.store').query('playlistItem', {playlist : this.get('playlist.id')}).then( r => {
                  r.forEach( i => {
                    types.add(i.get('type'));
                  });
                 return types;
              })
    });
  }.property('model'),

  actions : {
    toggleSelection : function(playlist) {
      this.get('model').filter(p => p.get('selected')).forEach(p => {
        if (p.get('id') !== playlist.get('id')) {
          p.set('selected', false);
        }
      });
      playlist.toggleProperty('selected');
      this.set('playlist.currentPlaylist', playlist.get('id'));
    },

    removePlaylist : function(playlist) {
        if (this.get('playlist.currentPlaylist') === playlist.get('id')) {
          this.set('playlist.currentPlaylist', null);
        }

        this.get('model.store').query('playlistItem', {playlist : playlist.get('id')}).then( i => {
          i.forEach( r => {
              r.destroyRecord();
              r.save();
          });
        });

        playlist.destroyRecord();
        playlist.save();
    }
  }
});
