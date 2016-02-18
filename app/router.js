import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('home', {path : '/'});
  this.resource('devices', {path : '/devices'}, function() {
    this.route('info', {path : ':id/info'});
  });
  this.resource('playlists', { path : '/playlists'}, function() {
      this.route('playlist', {path : ':id/playlist'});
  });
});

export default Router;
