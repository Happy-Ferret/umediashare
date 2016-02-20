import Ember from 'ember';
import hash from '../../utils/utility-hash';

export default Ember.Controller.extend({

  actions : {
    createPlaylist : function() {
      if (confirm('Create Playlist ?')) {
        let name = hash(new Date().getTime().toString());
        this.store.createRecord('playlist', {
          name : name,
          itemsNum : 0
        }).save();
      }
    }
  }
});
