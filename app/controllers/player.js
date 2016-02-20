import Ember from 'ember';
import Duration from '../utils/utility-duration';

export default Ember.Controller.extend({
  application : Ember.inject.controller(),
  shareURL : '',
  trackRelTime : 0,
  isPlaying : false,
  isPaused : false,
  isLoading : Ember.computed.alias('renderer.isMediaLoading'),
  errorMessage : Ember.computed.alias('renderer.errorMessage'),

  seek: function(e) {
    this.get('application.player.renderer').seek(e.target.value);
  },

  actions : {
    play : function(id) {
      if (id) {
        this.get('playlist').setupRecord(id);
      }

      if (!this.get('playlist.currentTrackURI')) {
        this.get('playlist').setupRecord(this.get('playlist.nextTrack'));
      }

      if (this.get('playlist.currentTrackURI')) {
        this.get('renderer').load(
          this.get('playlist.currentTrackURI'),
          this.get('playlist.currentTrackRecord.contentType')
        );
      }

      this.set('isPaused', false);
    },

    pause : function() {
      if (this.get('isPaused')) {
        this.get('renderer').unpause();
      } else {
        this.get('renderer').pause();
      }
      this.toggleProperty('isPaused');
    },

    stop : function() {
      this.set('isPaused', false);
      this.set('playlist.currentTrack', null);
      this.get('renderer').stop();
    },

    forward : function() {
      this.get('renderer').load(
        this.get('playlist').setupRecord(this.get('playlist.nextTrack')),
        this.get('playlist.currentTrackRecord.contentType')
      );
    },

    backward : function() {
      this.get('renderer').load(
        this.get('playlist').setupRecord(this.get('playlist.prevTrack')),
        this.get('playlist.currentTrackRecord.contentType')
      );
    }
  },

  init : function() {
    this._super();
    this.get('renderer').lookupRenderer();
  },

  trackDuration : function() {
    return Duration.getTime(this.get('renderer.mediaInfo.TrackDuration')) ;
  }.property('renderer.mediaInfo.TrackDuration'),

  trackRelTimeObserver : function() {
    this.set('trackRelTime', Duration.getTime(this.get('renderer.mediaInfo.RelTime')));
  }.observes('renderer.mediaInfo.RelTime')
});
