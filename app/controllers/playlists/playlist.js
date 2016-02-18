import Ember from 'ember';

export default Ember.Controller.extend({
  isNameEditor : false,
  sortProperties : ['sort:asc'],
  playlistItems : Ember.computed.sort('playlistItemsRaw', 'sortProperties'),

  createItem : function(file) {
    let item =  {
        playlist : this.get('playlist.id'),
        name : file.name,
        isLocal : true,
        localPath : file.path,
        contentType: file.type,
        sort : 1
    };
    this.store.createRecord('playlistItem', item).save();
    this.updatePlaylist();
  },

  saveItems : function(items) {
      items.forEach( i => {
        let item = this.store.peekRecord('playlistItem', i.id);
        item.set('sort', i.sort);
        item.save();
      });
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

  },

  fileSelectionChanged : function(evt) {
    for (let i = 0; i < evt.target.files.length; i++) {
      Ums.__container__.lookup('controller:playlists.playlist').createItem(evt.target.files[i]);
    }
  },

  fileDrop : function(evt) {
    for (let i = 0; i < evt.dataTransfer.files.length; i++) {
      Ums.__container__.lookup('controller:playlists.playlist').createItem(evt.dataTransfer.files[i]);
    }
    evt.preventDefault();
    evt.stopPropagation();
  },

  reorderItems : function(items) {
    Ums.__container__.lookup('controller:playlists.playlist').saveItems(items);
  }
});
