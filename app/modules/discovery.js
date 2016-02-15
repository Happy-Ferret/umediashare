import Ember from 'ember';

var Browser = require('nodecast-js');

export default Ember.Object.extend({
  browser : null,
  updateur  : null,

  onDevice : function(device) {
    this.updateDevice.call(this, device.xml);
  },

  updateInfo : function(xml) {
    this.store.query('device', {xml : xml}).then((r) => r.get('firstObject'))
    .then((r) => {
        $.get(r
          .get('xml')).then((data) => {
          try {
            var c = $.xml2json(data)['#document']['root']['device'];
            r.set('friendlyName', c['friendlyName']);
            r.set('manufacturerURL', c['manufacturerURL']);
            r.set('modelDescription', c['modelDescription']);
            r.set('modelName', c['modelName']);
            r.set('modelURL', c['modelURL']);
            r.set('online', true);
          } catch(e) {}

          r.save();
        });
    });
  },

  updateDevice : function(xml) {
    this.store.query('device', {xml : xml}).catch(() => {
      this.store.createRecord('device', {
        xml : xml
      }).save();
    }).finally(() => this.updateInfo.call(this, xml));
  },

  updateStatus : function() {
    this.store.findAll('device').then((devices) => {
        devices.forEach((d) => {
          Ember.$.ajax({
            type : 'HEAD',
            url : d.get('xml'),
            complete : (res) => {
              if (res.status === 200) {
                d.set('online', true);
              } else {
                d.set('online', false);
              }

              d.save();
            }
          });
        });
    });
  },

  start : function() {
    var browser = this.get('browser');

    if (this.get('browser') !== null) {
      this.stop();
    }

    if (this.get('updateur') !== null) {
      clearInterval(this.get('updateur'));
    }

    browser = new Browser();
    browser.onDevice(this.onDevice.bind(this));
    browser.start();

    this.set('browser', browser);
    this.updateStatus();
    this.set('updateur', setInterval(this.updateStatus.bind(this), 20000));
    this.set('settings.isDiscoveryEnabled',true);
  },

  stop : function() {
    if (this.get('devices.length') > 0) {
      this.get('devices').clear();
    }

    if (this.get('updateur') !== null) {
      clearInterval(this.get('updateur'));
    }

    if (this.get('browser') !== null) {
      this.get('browser').destroy();
      this.set('browser', null);
    }
    this.set('settings.isDiscoveryEnabled',false);
  },

  init : function() {
    this._super();
    if (this.get('settings.isDiscoveryEnabled') === true) {
      this.start();
    }
  }

});
