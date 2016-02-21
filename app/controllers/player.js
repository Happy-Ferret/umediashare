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
  updateur : null,
  ticks : 0,
  lastTime : 0,


  nextTrackWatchStart : function() {
    this.nextTrackWatchStop();
    let interval = setInterval(() => {
      let type = this.get('application.playlist.currentTrackRecord.type');

      if (type !== 'audio' && type !== 'video') {
        return;
      }

      this.incrementProperty('ticks');

      if (this.get('lastTime') !== this.get('trackRelTime')) {
        this.set('lastTime', this.get('trackRelTime'));
        this.set('ticks', 0);
      }

      if (this.get('ticks') > 10 && this.get('trackRelTime') === 0) {
        this.nextTrackWatchStop();
        this.send('forward');
      }

    },400);
    this.set('updateur', interval);
  },

  nextTrackWatchStop : function() {
    clearInterval(this.get('updateur'));
    this.set('ticks', 0);
    this.set('lastTime', 0);
  },

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
          this.get('playlist.currentTrackRecord.contentTypeFix'),
          this.nextTrackWatchStart.bind(this)
        );
      }

      this.set('isPaused', false);
    },

    pause : function() {
      if (this.get('isPaused')) {
        this.get('renderer').unpause();
        this.nextTrackWatchStart();
      } else {
        this.get('renderer').pause();
        this.nextTrackWatchStop();
      }
      this.toggleProperty('isPaused');
    },

    stop : function() {
      this.set('isPaused', false);
      this.set('playlist.currentTrack', null);
      this.get('renderer').stop();
      this.nextTrackWatchStop();
    },

    forward : function() {
      this.get('renderer').load(
        this.get('playlist').setupRecord(this.get('playlist.nextTrack')),
        this.get('playlist.currentTrackRecord.contentTypeFix'),
        this.nextTrackWatchStart.bind(this)
      );
    },

    backward : function() {
      this.get('renderer').load(
        this.get('playlist').setupRecord(this.get('playlist.prevTrack')),
        this.get('playlist.currentTrackRecord.contentTypeFix'),
        this.nextTrackWatchStart.bind(this)
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
