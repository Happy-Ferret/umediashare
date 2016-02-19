import Ember from 'ember';
import Duration from '../utils/utility-duration';

export default Ember.Controller.extend({
  application : Ember.inject.controller(),
  shareURL : '',
  trackRelTime : 0,
  isPlaying : false,

  seek: function(e) {
    this.get('application.player.renderer').seek(e.target.value);
  },

  actions : {
    play : function(id) {
      let uri = null;

      if (id) {
        this.get('playlist').setupRecord(id);
      }

      if (!this.get('playlist.currentTrackURI')) {
        this.get('playlist').setupRecord(this.get('playlist.nextTrack'));
      }

      if ((uri = this.get('playlist.currentTrackURI'))) {
        this.get('renderer').load(uri);
      }
    },

    pause : function() {

    },

    stop : function() {
      this.set('playlist.currentTrack', null);
      this.get('renderer').stop();
    },

    forward : function() {
      this.get('renderer').load(
        this.get('playlist').setupRecord(this.get('playlist.nextTrack'))
      );
    },

    backward : function() {
      this.get('renderer').load(
        this.get('playlist').setupRecord(this.get('playlist.prevTrack'))
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
