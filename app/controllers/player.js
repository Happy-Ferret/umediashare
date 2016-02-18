import Ember from 'ember';
import Duration from '../utils/utility-duration';

export default Ember.Controller.extend({
  application : Ember.inject.controller(),
  shareURL : '',
  trackRelTime : 0,


  seek : function(e) {
    this.get('application.renderer').seek(e.target.value);
  },

  actions : {
    play : function() {

    },

    pause : function() {

    },

    stop : function() {
      this.get('renderer').stop();
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
