import DS from 'ember-data';
import getProps from '../utils/utility-getprop';
var MediaRendererClient = require('upnp-mediarenderer-client');
var Client = require('upnp-device-client');

export default DS.Model.extend({
  xml  : DS.attr('string'),
  online : DS.attr('boolean'),
  friendlyName : DS.attr('string'),
  manufacturerURL : DS.attr('string'),
  modelDescription: DS.attr('string'),
  modelName : DS.attr('string'),
  modelURL : DS.attr('string'),

  isDefault : function() {
    return this.get('id') === Ums.get('application.defaultDevice');
  }.property('Ums.application.defaultDevice'),

  _renderer : null,
  _client : null,

  renderer : function() {
    if (this.get('_renderer') === null) {
      this.set('_renderer', new MediaRendererClient(this.get('xml')));
    }
    return this.get('_renderer');
  }.property(),

  client : function() {
    if (this.get('_client') === null) {
      this.set('_client', new Client(this.get('xml')));
    }

    return this.get('_client');
  }.property(),


  clientDescription : function() {
    return DS.PromiseObject.create({
     promise: new Ember.RSVP.Promise((resolve) => {
          this.get('client').getDeviceDescription(function(err, description) {
            resolve(getProps(description));
          });
        })
    });
  }.property(),

  clientProtocol : function() {
    return DS.PromiseObject.create({
     promise: new Ember.RSVP.Promise((resolve, reject) => {
          this.get('client').callAction('ConnectionManager', 'GetProtocolInfo', { },function(err, description) {
            if (description.Sink) {
              resolve(description.Sink.split(','));
            } else {
              reject('wrong data');
            }
          });
        })
    });
  }.property(),

  clientMediaInfo : function() {
    return DS.PromiseObject.create({
     promise: new Ember.RSVP.Promise((resolve) => {
          this.get('client').callAction('AVTransport', 'GetMediaInfo', { InstanceID: 0 } ,function(err, description) {
            resolve(getProps(description));
          });
        })
    });
  }.property()
});
