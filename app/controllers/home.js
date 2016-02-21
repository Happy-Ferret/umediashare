import Ember from 'ember';

export default Ember.Controller.extend({
  application : Ember.inject.controller(),

  serverPort  : Ember.computed.alias('settings.serverPort'),
  serverAddress : Ember.computed.alias('settings.serverAddress'),

  actions : {
    restartHttp : function() {
      this.get('application.resolver.server').close();
      this.get('application.resolver').startServer();
    }
  }

});
