import Ember from 'ember';

export default Ember.Object.extend({
  currentPlaylist : Ember.computed.alias('settings.currentPlaylist'),
  currentTrack : null,
  isShuffle : false,
  playlists : null,
  playlistItems : null,


  setupRecord : function(id) {
    if (this.get('settings.defaultDevice')) {
      let record = this.store.peekRecord('playlistItem', id);
      this.set('currentPlaylist', record.get('playlist'));
      this.set('currentTrack', id);
      return this.get('currentTrackURI');
    }
    return null;
  },

  init : function() {
    this.set('playlists', this.store.peekAll('playlist'));
    this.playlistObserver();
  },

  prevTrack : function() {
    let trackSort = this.get('currentTrackRecord.sort');
    let maxSort = this.get('playlistItems').reduce( (p,c) => p > c.get('sort') ? p : c.get('sort'));
    let nextTrack = trackSort > 0 ? trackSort - 1 : maxSort;

    return this.trackBySort(nextTrack).get('id');
  }.property('currentTrack'),

  nextTrack : function() {
    let trackSort = this.get('currentTrackRecord.sort') !== null ? this.get('currentTrackRecord.sort') :  -1;
    let maxSort = this.get('playlistItems').reduce( (p,c) => p > c.get('sort') ? p : c.get('sort'));
    let nextTrack = trackSort < maxSort ? trackSort + 1 : 0;

    return this.trackBySort(nextTrack).get('id');
  }.property('currentTrack'),


  trackBySort : function(sort) {
    return this.get('playlistItems').filter( i => i.get('sort') === sort)[0];
  },

  currentTrackURI : function() {
    if (this.get('currentTrack')) {
      return this.store.peekRecord('playlistItem', this.get('currentTrack')).get('remotePath');
    }
    return null;
  }.property('currentTrack'),

  currentTrackRecord : function() {
    return this.store.peekRecord('playlistItem', this.get('currentTrack'));
  }.property('currentTrack'),

  notEmpty : function() {
    return this.get('playlists').filter( p => p.get('itemsNum'));
  }.property('playlists.@each.itemsNum'),

  currentPlaylistRecord : function() {
    return this.store.peekRecord('playlist', this.get('currentPlaylist'));
  }.property('playlists.[]', 'currentPlaylist'),

  deviceObserver : function() {
    if (!this.get('settings.defaultDevice')) {
      this.set('currentTrack', null);
    }
  }.observes('settings.defaultDevice'),

  playlistObserver : function() {
    if (this.get('currentPlaylist')) {
      this.store.query('playlistItem', {'playlist': this.get('currentPlaylist')})
        .then( r => this.set('playlistItems', r));
    } else {
      this.set('playlistItems', null);
    }
  }.observes('currentPlaylist')

});
