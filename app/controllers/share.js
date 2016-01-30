import Ember from 'ember';
import Duration from '../utils/utility-duration';


export default Ember.Controller.extend({
  application : Ember.inject.controller(),
  shareURL : '',
  trackRelTime : 0,

  init : function() {
    this._super();
    this.get('renderer').lookupRenderer();
  },

  trackDuration : function() {
    return Duration.getTime(this.get('renderer.mediaInfo.TrackDuration'));
  }.property('renderer.mediaInfo.TrackDuration'),

  trackRelTimeObserver : function() {
    this.set('trackRelTime', Duration.getTime(this.get('renderer.mediaInfo.RelTime')));
  }.observes('renderer.mediaInfo.RelTime'),

  isaddItemDisabled : function() {
    return  !this.get('shareURL').match(/.*\/(.*)$/);
  }.property('shareURL'),

  seek : function(e) {
    this.get('application.renderer').seek(e.target.value);
  },

  actions : {
    play : function(item) {
      this.get('renderer').load(item.get('remotePath'));
    },

    stopMedia : function() {
      this.get('renderer').stop();
    },

    addItem : function() {
      if (this.get('shareURL').match(/.*\/(.*)$/)) {
        this.store.createRecord('playlist-item', {
          remotePath : this.get('shareURL')
        }).save();

        this.set('shareURL', '');
      }
    },

    removeItem : function(item) {
      item.deleteRecord();
      item.save();
    }
  }

});
