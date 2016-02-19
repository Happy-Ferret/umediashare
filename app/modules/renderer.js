import Ember from 'ember';

export default Ember.Object.extend({

  errorMessage : null,
  isLoading : false,
  device : null,
  renderer : null,
  upRepeater : null,

  mediaInfo : Ember.Object.create(),

  isError : function() {
    return this.get('errorMessage') ? true : false;
  }.property('errorMessage'),

/*
  AbsCount: "0"
  AbsTime: "NOT_IMPLEMENTED"
  RelCount: "-1"
  RelTime: "00:00:00"
  Track: "1"
  TrackDuration: "00:11:23"
  TrackMetaData: "<DIDL-Lite xmlns="urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:upnp="urn:schemas-upnp-org:metadata-1-0/upnp/" xmlns:dlna="urn:schemas-dlna-org:metadata-1-0/"><item id="0" parentID="34" restricted="0"><dc:title>222397405</dc:title><dc:creator>-</dc:creator><upnp:genre>Unknown</upnp:genre><res protocolInfo="http-get:*:video/x-matroska:*">http://www.ex.ua/get/222397405</res><upnp:class>object.item.videoItem.movie</upnp:class></item></DIDL-Lite>"
  TrackURI: "http://www.ex.ua/get/222397405" */

  defaultDeviceObserver : function() {
    this.stop();
    this.lookupRenderer();
    this.updateStatus();
  }.observes('settings.defaultDevice'),

  statusUpdateur: function() {
    this.set('upRepeater', setInterval(() => {
        this.updateStatus.call(this);
      }, 1200));
  }.observes('device'),

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
    } else {
      clearInterval(this.get('upRepeater'));
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

 stop: function() {
   this.lookupRenderer();
   if (this.get('renderer')) {
     this.get('renderer').stop();
   }
   this.set('device', null);
   this.set('isLoading', false);
 },

 load : function(url, contentType) {
    if (!url || !url.match(/.*\/(.*)$/)) {
      this.set('errorMessage', 'Invalid source url: ' + url);
      return;
    }

    var renderer = this.lookupRenderer();
    if (!renderer) {
      this.set('errorMessage', 'Cannot lookup renderer');
      return;
    }

    this.set('isLoading', true);
    renderer.load(url, this.lookupOptions(url, contentType), (err) => {
        this.set('isLoading', false);

        if(err) {
          this.set('errorMessage', err.toString());
        }
    });
  },

  lookupRenderer : function() {
      this.set('errorMessage', null);
      this.set('device', null);
      this.set('renderer', null);
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
