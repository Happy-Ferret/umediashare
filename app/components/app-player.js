import Ember from 'ember';


export default Ember.Component.extend({
  classNames : ['application-player'],
  tagName : 'div',
  player : Ember.computed.alias('application.player'),
  isPlaying : false,



  actions : {
    play() {
      this.get('player').send('play');
    },
    forward() {
      this.get('player').send('forward');
    },
    backward() {
      this.get('player').send('backward');
    }
  }
});
