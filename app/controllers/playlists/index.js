import Ember from 'ember';
import hash from '../../utils/utility-hash';

export default Ember.Controller.extend({

  isSelected : function() {
    return !!this.model.filter(p => p.get('selected')).length;
  }.property('model.@each.selected'),

  actions : {
    toggleSelection : function(playlist) {
      playlist.toggleProperty('selected');
    },
    removePlaylist : function() {
      this.get('model').filter(p => p.get('selected')).forEach(p => {
        p.destroyRecord();
        p.save();
      });
    },
    createPlaylist : function() {
      let name = hash(new Date().getTime().toString());
      this.store.createRecord('playlist', {
        name : name,
        itemsNum : 0
      }).save();
    }
  }
});
