import Ember from 'ember';


export default Ember.Controller.extend({
  devices : null,
  devicesOnline : 0,
  devicesOffline : 0,
  defaultDevice : Ember.computed.alias('settings.defaultDevice'),

  init : function() {
    this._super();
    Ums.set('application', this);
  },

  defaultDeviceRecord : function() {
    if (this.get('defaultDevice') !== null && this.store) {
      return this.store.peekRecord('device', this.get('defaultDevice'));
    }
  }.property('defaultDevice'),

  devicesStatusObserver : function() {
    this.set('devicesOffline', 0);
    this.set('devicesOnline', 0);

    this.get('devices').forEach((d) => {
      if (d.get('online')) {
        this.incrementProperty('devicesOnline');
      } else {
        this.decrementProperty('devicesOffline');
      }
    });

    if (this.get('defaultDeviceRecord.online') === false
       && this.get('defaultDeviceRecord.id') === this.get('defaultDevice')){
      this.set('defaultDevice', null);
    }
  }.observes('devices', 'devices.@each.online')

});
