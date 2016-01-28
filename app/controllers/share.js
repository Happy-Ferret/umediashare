import Ember from 'ember';


export default Ember.Controller.extend({
  application : Ember.inject.controller(),
  shareURL : '',

  isaddItemDisabled : function() {
    return  !this.get('shareURL').match(/.*\/(.*)$/);
  }.property('shareURL'),

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
