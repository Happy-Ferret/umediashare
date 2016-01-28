import Ember from 'ember';

export default Ember.Controller.extend({
  application : Ember.inject.controller(),
  devices : Ember.computed.alias('application.devices'),
  customURL : null,


  isCustomDisabled : function() {
    return !this.get('customURL');
  }.property('customURL'),

  isDiscoveryEnabled : function() {
    if (this.get('discovery.browser') === null) {
      return false;
    }

    return true;
  }.property('discovery.browser'),


  actions : {
    appendCustom : function() {
      this.get('discovery').updateDevice(this.get('customURL'));
      this.set('customURL', null);
    },
    disableDiscovery : function() {
      this.get('discovery').stop();
    },
    enableDiscovery : function() {
      this.get('discovery').start();
    },
    removeDevices : function() {
      this.store.findAll('device').then((data) => {
        data.forEach((r) => {
          r.deleteRecord();
          r.save();
        });
      }).finally(() => {
        this.discovery.init();
        this.set('settings.defaultDevice', null);
      });
    },
    removeDevice : function(d) {
      d.destroyRecord();
      d.save();
    }
  }
});
