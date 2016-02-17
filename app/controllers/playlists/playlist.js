import Ember from 'ember';

export default Ember.Controller.extend({
  isNameEditor : false,

  saveItem : function(file) {
    let item =  {
        playlist : this.get('playlist.id'),
        name : file.name,
        isLocal : true,
        localPath : file.path,
        contentType: file.type
    };
    this.store.createRecord('playlistItem', item).save();
    this.updatePlaylist();
  },

  fileSelectionChanged : function(evt) {
    for (let i = 0; i < evt.target.files.length; i++) {
      Ums.__container__.lookup('controller:playlists.playlist').saveItem(evt.target.files[i]);
    }
  },

  fileDrop : function(evt) {
    for (let i = 0; i < evt.dataTransfer.files.length; i++) {
      Ums.__container__.lookup('controller:playlists.playlist').saveItem(evt.dataTransfer.files[i]);
    }
    evt.preventDefault();
    evt.stopPropagation();
  },

  updatePlaylist : function() {
    this.send('resetRoute');
  },

  actions : {
    renamePlaylist : function() {
      this.playlist.save();
      this.set('isNameEditor', false);
    },

    removeItem : function(item) {
      item.deleteRecord();
      item.save();
      this.updatePlaylist();
    }

  }
});
