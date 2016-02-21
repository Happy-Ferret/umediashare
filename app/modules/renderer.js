/*
  AbsCount: "0"
  AbsTime: "NOT_IMPLEMENTED"
  RelCount: "-1"
  RelTime: "00:00:00"
  Track: "1"
  TrackDuration: "00:11:23"
  TrackMetaData: "<DIDL-Lite xmlns="urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:upnp="urn:schemas-upnp-org:metadata-1-0/upnp/" xmlns:dlna="urn:schemas-dlna-org:metadata-1-0/"><item id="0" parentID="34" restricted="0"><dc:title>222397405</dc:title><dc:creator>-</dc:creator><upnp:genre>Unknown</upnp:genre><res protocolInfo="http-get:*:video/x-matroska:*">http://www.ex.ua/get/222397405</res><upnp:class>object.item.videoItem.movie</upnp:class></item></DIDL-Lite>"
  TrackURI: "http://www.ex.ua/get/222397405" */

import Ember from 'ember';

export default Ember.Object.extend({
  errorMessage : null,
  device : null,
  renderer : null,
  upRepeater : null,
  isMediaLoading : false,
  mediaInfo : Ember.Object.create(),

  init : function() {
      this._super();
      this.statusUpdateur();
  },

  statusUpdateur: function() {
    this.set('upRepeater', setInterval(() => {
      Ember.run.debounce(this, 'updateStatus', 800);
    }, 1500));
  },

  updateStatus : function() {
    var client = this.get('device.client');

    if (client) {
      client.callAction('AVTransport', 'GetPositionInfo', { InstanceID: 0 }, (err, result) => {
        if (err) {
         this.set('errorMessage', err.toString());
        } else {
          this.get('mediaInfo').setProperties(result);
        }
      });
    }
  },

 seek : function(time) {
   this.get('renderer').seek(time, (err) =>  {
     if (err) { this.set('errorMessage', err.toString()); }
   });
 },

 pause : function() {
   this.get('renderer').pause((err) =>  {
     if (err) { this.set('errorMessage', err.toString()); }
   });
 },

 unpause : function() {
   this.get('renderer').play((err) =>  {
     if (err) { this.set('errorMessage', err.toString()); }
   });
 },

 stop: function() {
   this.lookupRenderer();
   if (this.get('renderer')) {
     this.get('renderer').stop();
   }
   this.set('device', null);
 },

 load : function(url, contentType, cb) {
    var renderer = this.lookupRenderer();
    if (!renderer) {
      this.set('errorMessage', 'Cannot lookup renderer');
      return;
    }

    renderer.stop((err) => {
      if (err) {
        this.set('errorMessage', err.toString());
      }

      setTimeout( () => {
        this.set('isMediaLoading', true);

        renderer.load(url, this.lookupOptions(url, contentType), (err) => {
            if(err) {
              this.set('errorMessage', err.toString());
            }
            this.set('isMediaLoading', false);
            if (cb) {
              cb();
            }
        });
      }, 500);
    });
  },

  lookupRenderer : function() {
      this.set('errorMessage', null);
      this.set('device', null);
      this.set('renderer', null);
      Object.keys(this.get('mediaInfo')).forEach( a => {
        this.set(`mediaInfo.${a}`, null);
      });
      var device = null;
      var renderer = null;

      if (!(device = this.store.peekRecord('device', this.get('settings.defaultDevice')))) {
        this.set('errorMessage', 'No device found');
        return;
      }

      if (!(renderer = device.get('renderer'))) {
        this.set('errorMessage', `Cannot lookup device renderer ${device.id}`);
        return;
      }

      this.set('device', device);
      this.set('renderer', renderer);

      return renderer;
  },

  lookupOptions : function(url, contentType) {
    return {
            autoplay: true,
            contentType: contentType,
            metadata: {
              title: url.match(/.*\/(.*)$/)[1],
              type: contentType.split('/')[0],
              protocolInfo : 'http-get:*:'+contentType+':*'
            }
    };
  }

});
