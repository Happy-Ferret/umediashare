import Ember from 'ember';

export default Ember.Object.extend({
  currentPlaylist : Ember.computed.alias('settings.currentPlaylist'),
  currentTrack : null,
  isShuffle : false,
  playlists : null,
  playlistItems : null,


  mergePlaylists : function(source, target) {
    this.store.query('playlistItem', {playlist : source}).then( i => {
      i.forEach( s => {
        s.set('playlist', target);
        s.save();
      });
      let t = this.store.peekRecord('playlist', source);
      t.deleteRecord();
      return t.save();
    }).then(() => {
      this.store.query('playlistItem', {playlist : target}).then( i => {
        let t = this.store.peekRecord('playlist', target);
        t.set('itemsNum', i.get('length'));
        t.save();
      });
    });
  },

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

    return this.trackBySort(nextTrack);
  }.property('currentTrack'),

  nextTrack : function() {
    let trackSort = this.get('currentTrackRecord.sort') !== null ? this.get('currentTrackRecord.sort') :  -1;
    let maxSort = this.get('playlistItems').reduce( (p,c) => p > c.get('sort') ? p : c.get('sort'));
    let nextTrack = trackSort < maxSort ? trackSort + 1 : 0;

    return this.trackBySort(nextTrack);
  }.property('currentTrack'),


  trackBySort : function(sort) {
    let track = this.get('playlistItems').filter( i => i.get('sort') === sort)[0];
    return track ? track.get('id') : this.get('playlistItems.content')[0].id;
  },

  currentTrackIsMovie : function() {
      if (this.get('currentTrack')) {
        return this.get('currentTrackRecord.type') === 'video' || this.get('currentTrackRecord.type') === 'audio' ;
      }
      return false;
  }.property('currentTrack'),

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
